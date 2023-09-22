import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserInfo() {
    const { data: sessionData } = useSession();
    return (
        <div className="flex gap-8 m-2 items-center">
            <Avatar>
                <AvatarImage className="rounded-full" src={sessionData?.user.image ?? ""} />
                <AvatarFallback>XD</AvatarFallback>
            </Avatar>
            {sessionData && <p className="text-lg font-semibold">{sessionData.user.name}</p>}
           <Button
                variant={"outline"}
                size={"icon"}
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {
                sessionData ? <LogOutIcon className="h-4 w-4"/>
                : <LogInIcon className="h-4 w-4"/>   
            }  
            </Button>
        </div>
    )
}