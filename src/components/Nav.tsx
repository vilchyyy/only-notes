import { HomeIcon, BellRingIcon, MailsIcon, BookmarkIcon, UserCircleIcon } from "lucide-react";
import NavElement from "./NavElement";
import UserInfo from "./UserInfo";

export default function Nav() {
    return (
        <div className="flex flex-col min-w-max w-2/12 p-5 justify-between">
            <div className="flex flex-col gap-3 w-full ">
                <NavElement
                icon={<HomeIcon className="mr-3"/>}
                text="Strona Główna"
                />
                <NavElement 
                text="Powiadomienia"
                icon={<BellRingIcon className="mr-3"/>}
                />
                <NavElement 
                text="Wiadomości Prywatne"
                icon={<MailsIcon className="mr-3"/>}
                />
                <NavElement 
                text="Zapisane"
                icon={<BookmarkIcon className="mr-3"/>}
                />
                <NavElement 
                text="Profil"
                icon={<UserCircleIcon className="mr-3"/>}
                />
            </div>
            <UserInfo/>
        </div>

    )
}