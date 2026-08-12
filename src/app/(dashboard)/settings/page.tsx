import Link from "next/link";

const SettingsPage = () => {
  return (
    <div className="bg-white p-6 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Settings</h1>
      <p className="text-sm text-gray-500 mt-2">
        Account settings are managed through Clerk. Use the user button in the
        navbar to manage your account, or open your{" "}
        <Link href="/profile" className="text-blue-500 underline">
          profile
        </Link>
        .
      </p>
    </div>
  );
};

export default SettingsPage;
