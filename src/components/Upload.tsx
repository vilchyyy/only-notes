import { Input } from "@/components/ui/input";
import { api } from "~/utils/api";
import { z } from "zod";
import { Form, SubmitButton, useZodForm } from "./Form";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

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
          form.reset();
        }}
        className="space-y-2"
      >
        <div>
          <label>
            Title
            <br />
            <Input {...form.register("text")} className="border" />
          </label>

          {form.formState.errors.text?.message && (
            <p className="text-red-700">
              {form.formState.errors.text?.message}
            </p>
          )}
        </div>
        <div>
          <label>
            Text
            <br />
            <Textarea {...form.register("text")} className="border" />
          </label>
          {form.formState.errors.text?.message && (
            <p className="text-red-700">
              {form.formState.errors.text?.message}
            </p>
          )}
        </div>
        <div className="mt-5 text-center">
          <div
            className={`flex h-32 w-full items-center justify-center rounded border-2 border-dashed border-neutral-700 ${
              isDragAccept && " border-emerald-500 "
            } ${isDragReject && "border-red-600 "}`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? "file" : "+"}
          </div>
        </div>
      </Form>
      <SubmitButton
        form={form} // If you place the submit button outside of the form, you need to specify the form to submit
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Add post
      </SubmitButton>
    </>
  );
}
