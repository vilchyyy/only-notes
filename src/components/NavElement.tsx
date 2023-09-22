import { Button } from "@/components/ui/button";
import { Home, HomeIcon } from "lucide-react";


interface NavElementProps {
    text: string,
}

export default function NavElement({text}: NavElementProps) {
    return (
        <div>       
            <Button
                variant={"ghost"}
            >
                 <Home className="mr-2" />{text}
            </Button>

        </div>
    )
}