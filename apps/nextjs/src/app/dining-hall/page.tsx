"use client";

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Text } from "@radix-ui/themes";

import type {
  Allergen,
  DietaryPreference,
  Image,
  MenuItem,
  MenuSection,
  Restaurant,
  Review,
  User,
} from "@menus-for-ucla/db";

import { api } from "~/utils/api";
import DiningHallActivity from "../_components/dining-hall/dining-hall-activity";
import { FoodItem } from "../_components/dining-hall/food-item";
import ReviewComponent from "../_components/food-item/review-component";
import ReviewForm from "../_components/review-form";

export type ReviewWithUser = Review & { user: User };
export type MenuItemsWithAllergensAndDietPrefsAndImages = MenuItem & {
  allergens: Allergen[];
  dietaryPreferences: DietaryPreference[];
  images: Image[];
};
type MenuSectionsWithMenuItems = MenuSection & {
  menuItems: MenuItemsWithAllergensAndDietPrefsAndImages[];
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
        {restaurant?.name === "Epicuria" ? (
          <img
            className="blur-sm"
            src={"/images/epic.webp"}
            alt="Dining Hall 1"
            style={{
              width: "100%",
              height: "33vh",
              objectFit: "cover",
              objectPosition: "100% 40%",
              filter: "brightness(0.75)",
            }}
          />
        ) : restaurant?.name === "DeNeve" ? (
          <img
            className="brightness-30"
            src={"/images/deneve.webp"}
            alt="Dining Hall 2"
            style={{
              width: "100%",
              height: "33vh",
              objectFit: "cover",
              objectPosition: "75% 70%",
              filter: "brightness(0.75)",
            }}
          />
        ) : restaurant?.name === "BruinPlate" ? (
          <img
            className="brightness-30"
            src={"/images/bplate.webp"}
            alt="Dining Hall 3"
            style={{
              width: "100%",
              height: "33vh",
              objectFit: "cover",
              objectPosition: "75% 60%",
              filter: "brightness(0.75)",
            }}
          />
        ) : null}
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
          <div>
            {restaurant?.menuSections.map((menuSection) => (
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
                    <Grid item xs={3} sm={3} md={3} key={menuItem.id}>
                      <FoodItem
                        name={menuItem.name}
                        description={menuItem.description}
                        id={menuItem.id}
                        avgRating={Math.floor(Math.random() * 5) + 1}
                        allergens={menuItem.allergens}
                        dietPrefs={menuItem.dietaryPreferences}
                        restaurantId={searchParams.restaurantId}
                        imageUrl={menuItem.images[0]?.url}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </div>
        )}
        <div className="mt-20">
          <h2
            className="mb-2 mt-10 text-4xl font-bold"
            style={{ color: "#0E0E0E" }}
          >
            Activity Level
          </h2>
          <div className="my-4">
            <Divider className="bg-violet-500/30" />
          </div>
          <div>
            <h2 className="mb-2 mt-5 text-2xl font-bold">
              Same time last week
            </h2>
            <div style={{ width: "700px", height: "350px" }}>
              <DiningHallActivity />
            </div>
            <h3 className="mb-2 mt-5 text-xl font-medium">
              Best time to go: <strong>5 pm</strong>
            </h3>
          </div>
        </div>
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
          <ReviewForm
            restaurantId={searchParams.restaurantId}
            menuItemIds={[]}
          />

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
