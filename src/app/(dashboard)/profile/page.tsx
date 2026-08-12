import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const ProfilePage = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;

  return (
    <div className="bg-white p-6 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Profile</h1>
      <div className="flex items-center gap-4">
        <Image
          src={user?.imageUrl || "/noAvatar.png"}
          alt=""
          width={72}
          height={72}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="font-medium text-lg">
            {user?.firstName || user?.username || "User"} {user?.lastName || ""}
          </h2>
          <p className="text-sm text-gray-500 capitalize">{role || "No role set"}</p>
          <p className="text-sm text-gray-500">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
