import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";


interface NavElementProps {
    text: string,
    icon: ReactNode
}

export default function NavElement({text, icon}: NavElementProps) {
    return (
        <div>       
            <Button
                className="flex justify-start w-full h-14"
                variant={"ghost"}
            >
                {icon} <p className="text-lg">{text}</p>
            </Button>

        </div>
    )
}