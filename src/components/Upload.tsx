import { Input } from "@/components/ui/input";
import { api } from "~/utils/api";
import { z } from "zod";
import { Form, SubmitButton, useZodForm } from "./Form";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const createPostValidationSchema = z.object({
  text: z.string(),
  images: z.string().array().max(10),
});
export default function Upload() {
  const presigned = api.posts.createPresignedUrl.useMutation();
  const utils = api.useContext();
  const mutation = api.posts.createOne.useMutation({
    onSuccess: async () => {
      await utils.posts.invalidate();
    },
  });

  const [images, setImages] = useState<File[]>([]);

  const form = useZodForm({
    schema: createPostValidationSchema,
    defaultValues: {
      text: "",
      images: [],
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
      console.log(images);
    },
    [images],
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: true,
    maxSize: 1048576,
  });

  return (
    <>
      <div className="w-full max-w-3xl">
        <Form
          form={form}
          handleSubmit={async (values) => {
            const data = await mutation.mutateAsync(values);
            if (data?.id) {
              const files = images;
              for (const file of files) {
                const uploadData = await presigned.mutateAsync({
                  postId: data.id,
                });
                const formData = new FormData();
                Object.entries({ ...uploadData.fields, file }).forEach(
                  ([key, value]) => {
                    formData.append(key, value as unknown as string);
                  },
                );

                const upload = await fetch(uploadData.url, {
                  method: "POST",
                  body: formData,
                });

                if (upload.ok) {
                  console.log("Uploaded successfully!");
                } else {
                  console.error("Upload failed.");
                  console.error(upload.json());
                }
              }
            }
            setImages([]);
            form.reset();
          }}
          className="space-y-2"
        >
          <div className="w-full">
            <Textarea
              placeholder="Tu wrzuć swoje notatki."
              {...form.register("text")}
              className="border"
            />

            {form.formState.errors.text?.message && (
              <p className="text-red-700">
                {form.formState.errors.text?.message}
              </p>
            )}
          </div>
          <div className="mt-5 text-center">
            <div
              className={`flex h-32 w-full items-center justify-center rounded border-2 border-dashed border-neutral-700 ${
                isDragAccept && "border-green-500 "
              } ${isDragReject && " border-red-600"} `}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? "file" : "+"}
            </div>
            {images[0] && (
              <Carousel className="w-full max-w-full">
                <CarouselContent className=" max-w-[200px]">
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square  items-center justify-center p-6">
                            <img src={URL.createObjectURL(image)} alt="" />
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
          </div>
        </Form>
      </div>
      <SubmitButton
        form={form}
        className="mb-8 inline-flex h-10 w-full max-w-3xl items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Dodaj Post
      </SubmitButton>
    </>
  );
}
