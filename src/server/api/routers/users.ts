import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  bookmarkPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          bookmarks: true,
        },
      });
      if (!post) {
        return {
          success: false,
          message: "Post not found",
        };
      }
      if (
        post.bookmarks.find((bookmark) => bookmark.id === ctx.session.user.id)
      ) {
        return await ctx.db.post.update({
          where: {
            id: input.postId,
          },
          data: {
            bookmarks: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }

      return await ctx.db.post.update({
        where: {
          id: input.postId,
        },
        data: {
          bookmarks: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  likePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          likes: true,
        },
      });
      if (!post) {
        return {
          success: false,
          message: "Post not found",
        };
      }
      if (post.likes.find((like) => like.id === ctx.session.user.id)) {
        return await ctx.db.post.update({
          where: {
            id: input.postId,
          },
          data: {
            likes: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }

      return await ctx.db.post.update({
        where: {
          id: input.postId,
        },
        data: {
          likes: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getBookmarkedPosts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      where: {
        bookmarks: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      include: {
        likes: true,
        bookmarks: true,
        images: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
