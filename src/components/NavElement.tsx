import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { type ReactNode } from "react";

interface NavElementProps {
  text: string;
  icon: ReactNode;
  link: string;
}

export default function NavElement({ text, icon, link }: NavElementProps) {
  const router = useRouter();
  return (
    <div>
      <Button
        className="z-10 flex h-14 w-full justify-start"
        variant={"ghost"}
        onClick={(e) => {
          e.preventDefault();
          router.push(link).catch((e) => {
            console.log(e);
          });
        }}
      >
        {icon} <p className="hidden text-lg sm:block">{text}</p>
      </Button>
    </div>
  );
}
