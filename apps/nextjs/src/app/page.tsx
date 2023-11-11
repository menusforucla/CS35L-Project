import { Suspense } from "react";

import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

// export const runtime = "edge";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center text-black">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-normal tracking-tight sm:text-[5rem]">
          Menus for UCLA
        </h1>
        <AuthShowcase />

        {/* <CreatePostForm /> */}
        {/* <div className="h-[40vh] w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          ></Suspense>
        </div> */}
      </div>
    </main>
  );
}
