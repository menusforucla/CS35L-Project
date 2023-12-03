"use client";

import { useState } from "react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

export function CreateReviewForm() {
  const context = api.useContext();

    const [review, setReview] = useState("");

    const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value);
    };

  const { mutateAsync: createReview, error } = api.review.create.useMutation({
    async onSuccess() {
      await context.review.invalidate();
    },
  });

  return (
    <form onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createReview({
            review: review,
            rating: 5,
            restaurantId: 1,
            images: [{type: "temp", url: "temp"}],
            menuItemIds: [1],
          });
          console.log(review)
          setReview("");
          await context.review.invalidate();
        } catch {
          // noop
        }
      }}>
    <textarea value={review} placeholder="Write your Bloop!" onChange={handleReviewChange}/>
    <button type="submit">Submit</button>
    {error?.data?.code === "UNAUTHORIZED" && (
      <span className="mt-2 text-red-500">You must be logged in to post</span>
    )}
</form>
  );
}

/*
export function PostList() {
  const [posts] = api.post.all.useSuspenseQuery();

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const context = api.useContext();
  const deletePost = api.post.delete.useMutation();

  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-pink-400">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <button
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={async () => {
            await deletePost.mutateAsync(props.post.id);
            await context.post.all.invalidate();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2
          className={`w-1/4 rounded bg-pink-400 text-2xl font-bold ${
            pulse && "animate-pulse"
          }`}
        >
          &nbsp;
        </h2>
        <p
          className={`mt-2 w-1/3 rounded bg-current text-sm ${
            pulse && "animate-pulse"
          }`}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
*/