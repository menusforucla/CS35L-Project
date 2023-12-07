import React from "react";

import { auth, signIn, signOut } from "@menus-for-ucla/auth";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          Sign in with Google
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center justify-center text-black">
        {session && (
          // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
          <img
            src={session.user.image}
            className="ml-5 mr-5 h-14 w-14 rounded-md"
          />
        )}
        {session && <span>{session.user.name}</span>}
      </div>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="ml-10 font-semibold no-underline transition">
          Sign out
        </button>
      </form>
    </div>
  );
}
