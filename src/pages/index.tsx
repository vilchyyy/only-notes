import { Button } from "@/components/ui/button";
import { BellRingIcon, BookmarkIcon, HomeIcon, MailsIcon, UserCircleIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Nav from "~/components/Nav";
import NavElement from "~/components/NavElement";
import Upload from "~/components/Upload";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "" });
  const data = api.s3.getObjects.useQuery()

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between sm:justify-normal sm:flex-row min-h-screen">
        <div className="sm:flex flex-col hidden h-screen ">
          <h1 className="mx-9 px-10 my-4 w-min pb-0 text-4xl border border-white">ONLY NOTES</h1>
          <Nav/>
        </div>
        
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
        <div className="sm:hidden block">
          <Nav/>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );
  const presigned = api.posts.createPresignedUrl.useMutation(
  )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <Button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
      <Button 
        onClick={ () => { console.log(presigned.mutate({postId: "clnyedjt000052zp4xbkac072"}))}}
      >presigned</Button>
      <Upload/>
    </div>
  );
}
