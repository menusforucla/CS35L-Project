"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import { api } from "~/utils/api";

interface TagProps {
  name: string;
}

const Tag: React.FC<TagProps> = ({ name }) => {
  return (
    <Chip
      className="my-2 mr-2 text-sm text-white"
      label={name}
      style={{ backgroundColor: "#58a1d1", color: "white" }}
      sx={{ borderRadius: 2 }}
    />
  );
};

interface FoodItemsProps {
  name: string;
  description: string;
  id: number;
  avgRating: number;
}

const FoodItem: React.FC<FoodItemsProps> = ({
  name,
  description,
  id,
  avgRating,
}) => {
  const calculateWidth = (name: string) => {
    return `${100 + 20 * name.length}px`;
  };

  return (
    <Grid>
      <Link
        href={{
          pathname: "/dining-hall/food-item",
          query: { name: name, id: id },
        }}
      >
        <div
          className="rounded-2xl border-2 border-solid transition-colors bg-sky-100 p-2 shadow-sm hover:bg-sky-200"
          style={{ width: calculateWidth(name) }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{name}</h2>
            <span className="mr-2  flex items-center text-lg font-semibold">
              <StarIcon style={{ fill: "#D2B41A", marginTop: "-1px" }} />
              {avgRating}
            </span>
          </div>
          <p className="text-base font-semibold text-gray-700">{description}</p>
          <Tag name="Vegetarian" />
          <Tag name="Halal" />
        </div>
      </Link>
    </Grid>
  );
};

export default function DiningHall({
  searchParams,
}: {
  searchParams: {
    title: string;
    id: number;
  };
}) {
  const [review, setReview] = useState("");
  const [submittedReview, setSubmittedReview] = useState("");
  const {
    data: diningHall,
    error,
    isLoading,
  } = api.restaurant.byId.useQuery(Number(searchParams.id));
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
    <div>
      <div className="relative">
        <img
          className="blur-sm brightness-50"
          src={"/images/KrustyKrab.webp"}
          alt="Krusty Krab"
          style={{
            width: "100%",
            height: "33vh",
            objectFit: "cover",
          }}
        />
        <h1
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-5xl font-bold"
          style={{ color: "white" }}
        >
          {searchParams.title}
        </h1>
      </div>
      <div className="ml-8">
      {diningHall?.menuSections.map((menuSection) => (
        <div key={menuSection.id} className="mb-5">
          <h2
            className="mb-2 mt-10 text-3xl font-bold"
            style={{ color: "#ccad04" }}
          >
            {menuSection.name}
          </h2>
          <div className="my-4">
            <Divider />
          </div>
          <Grid container spacing={2}>
            {menuSection?.menuItems.map((menuItem) => (
              <FoodItem
                key={menuItem.id}
                name={menuItem.name}
                description={menuItem.description}
                id={menuItem.id}
                avgRating={5}
              />
            ))}
            <FoodItem
              name="Krabby Patty"
              description="Lorem ipsum dolor sit amet, consectetur adipiscingeu aliquam diam elementum. Quisque sagittis pulvinar nisl, nec finibus massa mollis eget. Proin"
              id={1}
              avgRating={5}
            />
            <FoodItem
              name="Bucket of Chum"
              description="JJ flip, what the zip"
              id={2}
              avgRating={1}
            />
            <FoodItem
              name="Kelp"
              description="Loi molestie vehicula ut in nunc. Vivam diam elementum. Quisque sagittis pulvinar nisl, nec finibus massa mollis eget. Proin"
              id={3}
              avgRating={3.2}
            />
          </Grid>
        </div>
      ))}
      <div className="w-100  h-72 items-center justify-center">
        <h2 className="mb-1 text-xl font-bold">Reviews</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={review}
            placeholder="Write your review!"
            onChange={handleReviewChange}
          />
          <button
            className="mx-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Submit
          </button>
        </form>
        {submittedReview && <p>{submittedReview}</p>}
        </div>
      </div>
    </div>
  );
}
