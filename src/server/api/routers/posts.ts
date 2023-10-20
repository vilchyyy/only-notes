import { experimental_isMultipartFormDataRequest, experimental_parseMultipartFormData, experimental_createMemoryUploadHandler } from "@trpc/server/adapters/node-http/content-type/form-data";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { uploadFileSchema } from "~/utils/schemas";
import { writeFileToDisk } from "~/utils/writeFileToDisk";

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

  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.post.findMany({});
    }),
  
  upload: formDataProcedure
  .input(uploadFileSchema)
  .mutation(async (opts) => {
    return {
      image: await writeFileToDisk(opts.input.image),
    };
  }),

    createOne: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ ctx, input}) => {
        try {
          await ctx.db.post.create({
            data: {
              text: input.text,
              userId: ctx.session.user.id
            }
          })
        } catch (error) {
          console.log(error)
        }

      }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
