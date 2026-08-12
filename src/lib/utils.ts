import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserRole() {
  const { sessionClaims } = auth();
  const fromClaims = (sessionClaims?.metadata as { role?: string } | undefined)
    ?.role;
  if (fromClaims) return fromClaims;

  const user = await currentUser();
  return user?.publicMetadata?.role as string | undefined;
}

/** Sync role from session claims during a request. Do not call at module top-level. */
export function getRole() {
  const { sessionClaims } = auth();
  return (sessionClaims?.metadata as { role?: string } | undefined)?.role;
}
