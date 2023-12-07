"use client";

import type { FormEvent } from "react";
import React, { useState } from "react";
import { Grid, styled } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Text } from "@radix-ui/themes";

import { api } from "~/utils/api";
import { FoodItem } from "../_components/dining-hall/food-item";
import ReviewForm from "../_components/review-form";

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
    <main className="bg-gradient-to-br from-blue-300 via-blue-200 to-yellow-50">
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
      <div className="pl-10 pr-10">
        {diningHall?.menuSections.map((menuSection) => (
          <div key={menuSection.id} className="mb-5">
            <h2
              className="mb-2 mt-10 text-4xl font-bold"
              style={{ color: "#454545" }}
            >
              {menuSection.name}
            </h2>
            <div className="my-4">
              <Divider className="bg-violet-500/30" />
            </div>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {menuSection?.menuItems.map((menuItem) => (
                <Grid item xs={2} sm={4} md={4} key={menuItem.id}>
                  <FoodItem
                    name={menuItem.name}
                    description={menuItem.description}
                    id={menuItem.id}
                    avgRating={5}
                    allergens={menuItem.allergens}
                    dietPrefs={menuItem.dietaryPreferences}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        ))}
        <div className="w-100  h-72 items-center justify-center">
          <h2
            className="mb-2 mt-10 text-4xl font-bold"
            style={{ color: "#454545" }}
          >
            Reviews
          </h2>
          <div className="my-4">
            <Divider className="bg-violet-500/30" />
          </div>
          <ReviewForm restaurantId={diningHall.id} menuItemIds={[]} />
          {/* {submittedReview && <p>{submittedReview}</p>} */}
        </div>
        {/* <div className="my-4">
          <h2 className="mb-1 text-xl font-bold">Reviews</h2>
        </div>
        <Text size="8">Review</Text>
        <ReviewForm /> */}
      </div>
    </main>
  );
}
