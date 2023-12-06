"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import { api } from "~/utils/api";
import { AllergenTag, DietaryTag } from "../_components/tags";
import { Allergen, DietaryPreference } from "@menus-for-ucla/db";
import { MenuList } from "@mui/material";


interface FoodItemsProps {
  name: string;
  description: string;
  id: number;
  avgRating: number;
  allergens?: Allergen;
  dietPrefs?: DietaryPreference;
}

const FoodItem: React.FC<FoodItemsProps> = ({
  name,
  description,
  id,
  avgRating,
  allergens,
  dietPrefs,
}) => {
  const calculateWidth = (name: string) => {
    return `${100 + 12* name.length}px`;
  };
  const allergenArray = Object.values(allergens ?? {});
  const dietPrefsArray = Object.values(dietPrefs ?? {})

  return (
    <Grid>
      <Link
        href={{
          pathname: "/dining-hall/food-item",
          query: { name: name, id: id },
        }}
      >
        <div
          className="rounded-2xl border-2 border-violet-900/50 transition-colors bg-sky-500/30 backdrop-blur p-2 shadow-sm hover:bg-sky-200"
          style={{ width: calculateWidth(name) }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{name}</h2>
            <span className="mr-2  flex items-center text-lg font-semibold">
              <StarIcon style={{ fill: "#D2B41A", marginTop: "-1px" }} />
              {avgRating}
            </span>
          </div>
          <p className="text-base font-semibold text-gray-700">{description}</p>
          {allergenArray.map((allergen) => (
            <AllergenTag key={allergen.id} name={allergen.name}/>
          ))}
          {dietPrefsArray.map((dietPref)=> (
            <DietaryTag key={dietPref.id} name={dietPref.name}/>
          ))}
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
    <main className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
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
            className="mb-2 mt-10 text-4xl font-bold"
            style={{ color: "#ab9f00" }}
          >
            {menuSection.name}
          </h2>
          <div className="my-4">
            <Divider className="bg-violet-500/30"/>
          </div>
          <Grid container spacing={2}>
            {menuSection?.menuItems.map((menuItem) => (
              <FoodItem
                key={menuItem.id}
                name={menuItem.name}
                description={menuItem.description}
                id={menuItem.id}
                avgRating={5}
                allergens={menuItem.allergens}
                dietPrefs={menuItem.dietaryPreferences}
              />
            ))}
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
    </main>
  );
}
