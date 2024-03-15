import {
  HomeIcon,
  BellRingIcon,
  MailsIcon,
  BookmarkIcon,
  UserCircleIcon,
} from "lucide-react";
import NavElement from "./NavElement";
import UserInfo from "./UserInfo";

export default function Nav() {
  return (
    <div className="flex w-full flex-row justify-between p-1 sm:h-full sm:min-w-max sm:flex-col sm:p-5">
      <div className="flex w-full flex-row justify-around sm:flex-col sm:justify-normal sm:gap-5 ">
        <NavElement
          icon={<HomeIcon className="sm:mr-3" />}
          text="Strona Główna"
        />
        <NavElement
          text="Powiadomienia"
          icon={<BellRingIcon className="sm:mr-3" />}
        />
        <NavElement
          text="Wiadomości Prywatne"
          icon={<MailsIcon className="sm:mr-3" />}
        />
        <NavElement
          text="Zapisane"
          icon={<BookmarkIcon className="sm:mr-3" />}
        />
        <NavElement
          text="Profil"
          icon={<UserCircleIcon className="sm:mr-3" />}
        />
      </div>
      <UserInfo />
    </div>
  );
}
