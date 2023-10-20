import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { LogInIcon, LogOutIcon, User2Icon, UserCircleIcon, UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserInfo() {
    const { data: sessionData } = useSession();
    return (
        <div className="sm:flex hidden flex-col sm:flex-row gap-4 sm:gap-8 m-1 items-center">
            <Avatar>
                <AvatarImage className="rounded-full " src={sessionData?.user.image ?? ""} />
                <AvatarFallback>
                    <UserCircleIcon className="h-8 w-8"/>
                </AvatarFallback>
            </Avatar>
            {sessionData && <p className="text-lg hidden sm:block font-semibold">{sessionData.user.name}</p>}
           <Button
                className="hidden sm:flex"
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