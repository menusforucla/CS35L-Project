import { useState } from "react";
import { Button } from "@radix-ui/themes";

import { api } from "~/utils/api";
import StarRating from "./star-rating";

interface ReviewFormProps {
  restaurantId: number;
  menuItemIds: number[];
}

export default function ReviewForm({
  restaurantId,
  menuItemIds,
}: ReviewFormProps) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const createReview = api.review.create.useMutation();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    console.log(review);
    console.log(rating);
    if (review.length > 0 && rating != null) {
      window.location.reload();
      createReview.mutate({
        restaurantId: Number(restaurantId),
        rating: rating,
        review: review,
        menuItemIds: menuItemIds,
        images: [],
      });

      setReview("");
      setRating(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-2">
      <h2 className="text-xl font-semibold">Write a Review</h2>
      <StarRating onRating={(rating: number) => setRating(rating)} />
      <textarea
        className="w-full rounded-md border-gray-300 p-4 text-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Write your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Submit Review
      </button>
    </form>
  );
}
