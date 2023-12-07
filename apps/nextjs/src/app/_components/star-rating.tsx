import { useState } from "react";
import Star from "@mui/icons-material/Star";

interface StarRatingProps {
  onRating: (rating: number) => void;
}

export default function StarRating({ onRating }: StarRatingProps) {
  const [rating, setRating] = useState(0);

  const handleSetRating = (newRating: number) => {
    setRating(newRating);
    if (onRating) {
      onRating(newRating);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => handleSetRating(star)}
        >
          {star <= rating ? (
            <Star className="h-6 w-6 text-yellow-400" />
          ) : (
            <Star className="h-6 w-6 text-gray-400" />
          )}
        </button>
      ))}
    </div>
  );
}
