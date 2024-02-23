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
import { useRouter } from "next/router";
import { Suspense, type ReactNode } from "react";
import { api } from "~/utils/api";

interface PostProps {
  text: string;
  user: string;
  images: (string | null)[];
}

export default function Post({ text, user, images }: PostProps) {
  const author = api.user.getOne.useQuery({ id: user });

  const router = useRouter();
  return (
    <Card className="w-full max-w-3xl p-3">
      <CardHeader>
        <CardTitle>{author.data?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
        {images[0] && (
          <Carousel className="w-full max-w-full">
            <CarouselContent className=" max-w-[200px]">
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square  items-center justify-center p-6">
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
        )}
      </CardContent>
      <CardFooter>
        <Input placeholder="Napisz komentarz" />
      </CardFooter>
    </Card>
  );
}
