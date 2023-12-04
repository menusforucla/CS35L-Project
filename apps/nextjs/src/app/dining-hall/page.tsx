"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";

import { api } from "~/utils/api";

interface FoodItemsProps {
  name: string;
  id: number
}

const FoodItem: React.FC<FoodItemsProps> = ({ name, id}) => {
  return (
    <li>
      <Link
        href={{ pathname: "/dining-hall/food-item", query: { name: name, id:id } }}
      >
        {name}
      </Link>
    </li>
  );
};

export default function DiningHall({searchParams,}: {
  searchParams: {
    title: string;
    id: number;
  };
}) {
  const [review, setReview] = useState("");
  const [submittedReview, setSubmittedReview] = useState("");
  const {data: diningHall, error, isLoading} = api.restaurant.byId.useQuery(Number(searchParams.id));
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReview(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedReview(review);
    setReview("");
  };
  return (
    <div className="mx-auto w-fit h-auto">
      <h1 className="mt-20 mb-10 text-3xl font-bold text-center">{searchParams.title}</h1>
      {diningHall?.menuSections.map((menuSection) => (
        <div key={menuSection.id} className="mb-5">
          <h2 className="text-xl mb-1 font-bold">{menuSection.name}</h2>
          <ul>
            {menuSection?.menuItems.map((menuItem) => (
                <FoodItem key={menuItem.id} name={menuItem.name} id={menuItem.id} />
            )
            )}
          </ul>
        </div>
      ))}
      <div className="w-100 relative mx-auto h-72 items-center justify-center">
        <h2 className="text-xl mb-1 font-bold">Reviews</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={review}
            placeholder="Write your review!"
            onChange={handleReviewChange}
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2" type="submit">Submit</button>
        </form>
        {submittedReview && <p>{submittedReview}</p>}
      </div>
    </div>
  );
}
