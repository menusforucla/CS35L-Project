"use client";

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";

import type {
  Allergen,
  DietaryPreference,
  MenuItem,
  MenuSection,
  Restaurant,
  Review,
  User,
} from "@menus-for-ucla/db";

import { api } from "~/utils/api";
import { FoodItem } from "../_components/dining-hall/food-item";
import ReviewComponent from "../_components/food-item/review-component";
import ReviewForm from "../_components/review-form";

export type ReviewWithUser = Review & { user: User };
export type MenuItemsWithAllergensAndDietPrefs = MenuItem & {
  allergens: Allergen[];
  dietaryPreferences: DietaryPreference[];
};
type MenuSectionsWithMenuItems = MenuSection & {
  menuItems: MenuItemsWithAllergensAndDietPrefs[];
};
type RestaurantWithMenuSections = Restaurant & {
  menuSections: MenuSectionsWithMenuItems[];
};

export default function DiningHall({
  searchParams,
}: {
  searchParams: {
    title: string;
    restaurantId: number;
  };
}) {
  const [restaurant, setRestaurant] =
    useState<RestaurantWithMenuSections | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[] | null>(null);

  const {
    data: diningHall,
    error: diningHallError,
    isLoading: isDiningHallLoading,
  } = api.restaurant.byId.useQuery(Number(searchParams.restaurantId));

  const { data: restaurantReviews, error: reviewsError } =
    api.review.byRestaurantId.useQuery(Number(searchParams.restaurantId));

  useEffect(() => {
    if (diningHall) {
      setRestaurant(diningHall);
    }
  }, [diningHall]);

  useEffect(() => {
    if (restaurantReviews) {
      setReviews(restaurantReviews);
    }
  }, [restaurantReviews]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-yellow-50">
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
        {isDiningHallLoading ? (
          <div>Loading dining hall information...</div>
        ) : diningHallError ? (
          <div>Failed to load dining hall information.</div>
        ) : (
          restaurant?.menuSections.map((menuSection) => (
            <div key={menuSection.id} className="mb-5">
              <h2
                className="mb-2 mt-10 text-4xl font-bold"
                style={{ color: "#0E0E0E" }}
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
                {menuSection.menuItems.map((menuItem) => (
                  <Grid item xs={2} sm={4} md={4} key={menuItem.id}>
                    <FoodItem
                      name={menuItem.name}
                      description={menuItem.description}
                      id={menuItem.id}
                      avgRating={5}
                      allergens={menuItem.allergens}
                      dietPrefs={menuItem.dietaryPreferences}
                      restaurantId={searchParams.restaurantId}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          ))
        )}

        <div className="w-100 h-72 items-center justify-center">
          <h2
            className="mb-2 mt-10 text-4xl font-bold"
            style={{ color: "#0E0E0E" }}
          >
            Reviews
          </h2>
          <div className="my-4">
            <Divider className="bg-violet-500/30" />
          </div>
          <ReviewForm restaurantId={searchParams.restaurantId} menuItemIds={[]} />

          {reviewsError ? (
            <div>Failed to load reviews.</div>
          ) : (
            reviews?.map((review) => (
              <ReviewComponent key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
