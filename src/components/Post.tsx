import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark, Heart, MessageSquare, SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { env } from "process";
import { Suspense, type ReactNode, useState } from "react";
import { api } from "~/utils/api";

interface PostProps {
  id: string;
  text: string;
  user: string;
  comments: string[];
  images: (string | null)[];
  likes: string[];
  bookmarks: string[];
}

export default function Post({
  id,
  text,
  user,
  images,
  likes,
  bookmarks,
  comments,
}: PostProps) {
  const author = api.user.getOne.useQuery({ id: user });
  const router = useRouter();
  const likePost = api.user.likePost.useMutation();
  const bookmarkPost = api.user.bookmarkPost.useMutation();
  const commentPost = api.posts.comment.useMutation();
  const [clientLikes, setClientLikes] = useState(likes);
  const [clientBookmarks, setClientBookmarks] = useState(bookmarks);
  const post = api.posts.getOne.useQuery({ postId: id });
  const [sendComment, setSendComment] = useState("");

  const { data: session } = useSession();

  if (!session?.user.id) {
    router.push("signin").catch(console.error);
    return;
  }

  return (
    <Card className="w-full max-w-3xl p-3">
      <CardHeader>
        <CardTitle>{author.data?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
        {images[0] && (
          <div className="flex justify-center">
            <Carousel className="w-[90%] max-w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/3">
                    <Dialog>
                      <DialogTrigger>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <Image
                                width={100}
                                height={100}
                                src={`http://127.0.0.1:9000/only-notes/${image}`}
                                alt=""
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <Image
                          src={`http://127.0.0.1:9000/only-notes/${image}`}
                          alt="notatka"
                          width={800}
                          height={800}
                        />
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
        <div className="mt-4 flex justify-around">
          <div className="flex gap-1">
            <Heart
              fill={clientLikes.includes(session?.user.id) ? "white" : "none"}
              className="cursor-pointer"
              onClick={() => {
                likePost.mutate({ postId: id });

                if (clientLikes.includes(session?.user.id)) {
                  setClientLikes(
                    clientLikes.filter((like) => like !== session?.user.id),
                  );
                } else {
                  setClientLikes([...clientLikes, session?.user.id]);
                }
              }}
            />
            {clientLikes.length}
          </div>
          <div className="flex gap-1">
            <Dialog>
              <DialogTrigger>
                <div className="flex">
                  <MessageSquare className="mr-1" />
                  {comments.length}
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Komentarze</DialogTitle>
                </DialogHeader>
                <div>
                  <ScrollArea className="h-[600px] ">
                    {post.data?.comments.map((comment) => (
                      <div key={comment.id} className="mb-2">
                        <p className="font-semibold">{comment.user.name}</p>
                        <div>{comment.text}</div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-1">
            <Bookmark
              fill={
                clientBookmarks.includes(session?.user.id) ? "white" : "none"
              }
              className="cursor-pointer"
              onClick={() => {
                if (clientBookmarks.includes(session?.user.id)) {
                  setClientBookmarks(
                    clientBookmarks.filter((like) => like !== session?.user.id),
                  );
                } else {
                  setClientBookmarks([...clientBookmarks, session?.user.id]);
                }
                bookmarkPost.mutate({ postId: id });
              }}
            />
            {clientBookmarks.length}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-6">
        <Input
          placeholder="Napisz komentarz"
          value={sendComment}
          onChange={(event) => {
            setSendComment(event.target.value);
          }}
        />
        <Button
          className="w-11"
          onClick={() => {
            commentPost.mutate({ postId: id, text: sendComment });
            setSendComment("");
          }}
        >
          <SendHorizonal width={20} className="-m-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
