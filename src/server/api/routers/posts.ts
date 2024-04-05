import { TRPCError } from "@trpc/server";
import {
  experimental_isMultipartFormDataRequest,
  experimental_parseMultipartFormData,
  experimental_createMemoryUploadHandler,
} from "@trpc/server/adapters/node-http/content-type/form-data";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { uploadFileSchema } from "~/utils/schemas";
import { writeFileToDisk } from "~/utils/writeFileToDisk";
import { s3 } from "~/server/s3/s3";
import { createPostValidationSchema } from "~/components/Upload";
import { env } from "process";

const formDataProcedure = publicProcedure.use(async (opts) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!experimental_isMultipartFormDataRequest(opts.ctx.req)) {
    return opts.next();
  }
  const formData = await experimental_parseMultipartFormData(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    opts.ctx.req,
    experimental_createMemoryUploadHandler(),
  );

  return opts.next({
    rawInput: formData,
  });
});

export const postsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      return post;
    }),

  createPresignedUrl: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id;
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the post does not exist",
        });
      }

      const imageId = nanoid() + ".jpg";
      await ctx.db.image.create({
        data: {
          postId: post.id,
          remoteId: imageId,
        },
      });

      return createPresignedPost(s3, {
        Bucket: env.S3_BUCKET_NAME ?? "",
        Key: imageId,
        Fields: {
          key: imageId,
        },
        Conditions: [
          ["content-length-range", 0, 5 * 1048576], // up to 5 MB
        ],
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      include: {
        images: true,
        likes: true,
        comments: true,

        bookmarks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  comment: protectedProcedure
    .input(z.object({ text: z.string(), postId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          text: input.text,
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });
    }),

  upload: formDataProcedure.input(uploadFileSchema).mutation(async (opts) => {
    return {
      image: await writeFileToDisk(opts.input.image),
    };
  }),

  createOne: protectedProcedure
    .input(createPostValidationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.post.create({
          data: {
            text: input.text,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
