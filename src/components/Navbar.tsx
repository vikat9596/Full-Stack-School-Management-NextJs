import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

const Navbar = async () => {
  const user = await currentUser();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "User";

  const announcementCount = await prisma.announcement.count();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
          disabled
        />
      </div>
      <div className="flex items-center gap-6 justify-end w-full">
        <Link
          href="/list/messages"
          className="bg-white rounded-full flex w-7 h-7 items-center justify-center cursor-pointer"
        >
          <Image src="/message.png" width={20} height={20} alt="message" />
        </Link>
        <Link
          href="/list/announcements"
          className="bg-white rounded-full flex w-7 h-7 items-center justify-center cursor-pointer relative"
        >
          <Image
            src="/announcement.png"
            width={20}
            height={20}
            alt="announcement"
          />
          {announcementCount > 0 && (
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs">
              {announcementCount > 9 ? "9+" : announcementCount}
            </div>
          )}
        </Link>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{displayName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {(user?.publicMetadata?.role as string) || ""}
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
