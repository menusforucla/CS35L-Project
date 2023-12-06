"use client";
import { useState } from "react";
import { api } from "~/utils/api";
import TextField from '@mui/material/TextField';
import '@radix-ui/themes/styles.css';
import { Button } from "@radix-ui/themes";

export function CreateReviewForm() {
  const context = api.useContext();

  const [review, setReview] = useState("");

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReview(event.target.value);
  };

  const { mutateAsync: createReview, error } = api.review.create.useMutation({
    async onSuccess() {
      await context.review.invalidate();
    },
  });

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createReview({
              review: review,
              rating: 5,
              restaurantId: 1,
              images: [{ type: "temp", url: "temp" }],
              menuItemIds: [1],
            });
            console.log(review);
            setReview("");
            await context.review.invalidate();
          } catch {
            // noop
          }
        }}
      >
        <div className="flex">
          <TextField
            className="w-full"
            multiline
            value={review}
            placeholder="Write your Bloop!"
            onChange={handleReviewChange}
          />
        </div>
        <div className="my-2">
          <Button type="submit" style={{ borderRadius: '5px' }} variant="solid" color="indigo" size="3"><p className="my-2 mx-8">Submit</p></Button>
        </div>
        {error?.data?.code === "UNAUTHORIZED" && (
          <span className="mt-2 text-red-500">
            You must be logged in to post
          </span>
        )}
      </form>
    </div>
  );
}

export function PostList(props: { restaurantId: number }) {
  const reviews = api.review.byRestId.useQuery(props.restaurantId).data;
  if (!reviews) return;
  if (!(reviews instanceof Array)) return;
  if (reviews.length === 0) {
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
      {reviews.map((p) => {
        return <PostCard key={p.review} review={p.review} />;
      })}
    </div>
  );
}

export function PostCard(props: { review: string | null }) {
  // const context = api.useContext();
  // const deletePost = api.review.delete.useMutation();

  return (
    <div className="flex-center w-80 rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-pink-400">{"Review"}</h2>
        <p className="mt-2 text-sm">{props.review}</p>
      </div>
      <div>
        <button
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={() => {
            console.log("delete");
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
