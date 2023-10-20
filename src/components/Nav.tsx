import { HomeIcon, BellRingIcon, MailsIcon, BookmarkIcon, UserCircleIcon } from "lucide-react";
import NavElement from "./NavElement";
import UserInfo from "./UserInfo";

export default function Nav() {
    return (
        <div className="flex flex-row sm:flex-col sm:h-full sm:min-w-max w-full p-1 sm:p-5 justify-between">
            <div className="flex flex-row sm:flex-col w-full justify-around sm:gap-5 sm:justify-normal ">
                <NavElement
                icon={<HomeIcon className="sm:mr-3"/>}
                text="Strona Główna"
                />
                <NavElement 
                text="Powiadomienia"
                icon={<BellRingIcon className="sm:mr-3"/>}
                />
                <NavElement 
                text="Wiadomości Prywatne"
                icon={<MailsIcon className="sm:mr-3"/>}
                />
                <NavElement 
                text="Zapisane"
                icon={<BookmarkIcon className="sm:mr-3"/>}
                />
                <NavElement 
                text="Profil"
                icon={<UserCircleIcon className="sm:mr-3"/>}
                />
            </div>
            <UserInfo/>
        </div>

    )
}