import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { type ReactNode } from "react";


interface NavElementProps {
    text: string,
    icon: ReactNode
}

export default function NavElement({text, icon}: NavElementProps) {
    const router = useRouter()
    return (
        <div>       
            <Button
                className="flex justify-start w-full z-10 h-14"
                variant={"ghost"}
                onClick={(e) => {
                    e.preventDefault()
                    router.push('/home').catch((e) =>{
                        console.log(e)
                    })
                }}
            >
                {icon} <p className="text-lg hidden sm:block">{text}</p>
            </Button>

        </div>
    )
}