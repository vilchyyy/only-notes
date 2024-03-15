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
import { Input } from "@/components/ui/input";
import { Bookmark, Heart, MessageSquare, SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Suspense, type ReactNode, useState } from "react";
import { api } from "~/utils/api";

interface PostProps {
  id: string;
  text: string;
  user: string;
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
}: PostProps) {
  const author = api.user.getOne.useQuery({ id: user });
  const router = useRouter();
  const likePost = api.user.likePost.useMutation();
  const bookmarkPost = api.user.bookmarkPost.useMutation();
  const [clientLikes, setClientLikes] = useState(likes);
  const [clientBookmarks, setClientBookmarks] = useState(bookmarks);
  const { data: session } = useSession();

  if (!session?.user.id) {
    router.push("signin");
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
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <img
                            src={`http://127.0.0.1:9000/notes-imgs/${image}`}
                            alt=""
                          />
                        </CardContent>
                      </Card>
                    </div>
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
            <MessageSquare />
            21
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
        <Input placeholder="Napisz komentarz" />
        <Button className="w-11">
          <SendHorizonal width={20} className="-m-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
