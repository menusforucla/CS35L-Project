"use client";

import React, { useEffect, useRef, useState } from "react";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Grid, Input } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Text } from "@radix-ui/themes";

import {
  DietaryPreferenceEnum,
  FoodAllergen,
  type Allergen,
  type DietaryPreference,
  type Image,
  type MenuItem,
  type MenuSection,
  type NutritionFacts,
  type Restaurant,
  type Review,
  type User,
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
  nutritionFacts: NutritionFacts;
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

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: diningHall,
    error: diningHallError,
    isLoading: isDiningHallLoading,
  } = api.restaurant.byId.useQuery(Number(searchParams.restaurantId));

  const { data: restaurantReviews, error: reviewsError } =
    api.review.byRestaurantId.useQuery(Number(searchParams.restaurantId));

  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const allAllergenOptions = Object.values(FoodAllergen);

  const handleAllergenChange = (event, newValue) => {
    setSelectedAllergens(newValue);
  };

  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    [],
  );
  const allDietaryPreferenceOptions = Object.values(DietaryPreferenceEnum);

  const handleDietaryPreferenceChange = (event, newValue) => {
    setSelectedDietaryPreferences(newValue);
  };

  useEffect(() => {
    if (diningHall) {
      setRestaurant(diningHall as RestaurantWithMenuSections);
    }
  }, [diningHall]);

  useEffect(() => {
    if (restaurantReviews) {
      setReviews(restaurantReviews as ReviewWithUser[]);
    }
  }, [restaurantReviews]);

  const filteredMenuSections = restaurant?.menuSections.map((menuSection) => ({
    ...menuSection,
    menuItems: menuSection.menuItems.filter(
      (menuItem) =>
        menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        selectedAllergens.every(
          (selectedAllergen) =>
            !menuItem.allergens.some(
              (allergen) => allergen.name === selectedAllergen,
            ),
        ) &&
        selectedDietaryPreferences.every((selectedDietaryPreference) =>
          menuItem.dietaryPreferences.some(
            (dietaryPreference) =>
              dietaryPreference.name === selectedDietaryPreference,
          ),
        ),
    ),
  }));

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
          <div className="mt-10">Loading dining hall information...</div>
        ) : diningHallError ? (
          <div className="mt-10">Failed to load dining hall information.</div>
        ) : (
          <div>
            <form
              className="mt-10 flex justify-center space-x-4 "
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                className="w-full rounded-md px-4 py-2"
                placeholder="Search for a menu item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex items-center rounded-md bg-blue-300 p-1">
                <label className="whitespace-nowrap px-4 py-2 text-gray-800">
                  Allergies to Exclude:
                </label>
                <Select
                  defaultValue={[]}
                  multiple
                  value={selectedAllergens}
                  onChange={handleAllergenChange}
                  sx={{ minWidth: "13rem" }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  {allAllergenOptions.map((allergen) => (
                    <Option key={allergen} value={allergen}>
                      {allergen}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center rounded-md bg-blue-300 p-1">
                <label className="whitespace-nowrap px-4 py-2 text-gray-800">
                  Dietary Preferences
                </label>
                <Select
                  defaultValue={[]}
                  multiple
                  value={selectedDietaryPreferences}
                  onChange={handleDietaryPreferenceChange}
                  sx={{ minWidth: "13rem" }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  {allDietaryPreferenceOptions.map((dietaryPreference) => (
                    <Option key={dietaryPreference} value={dietaryPreference}>
                      {dietaryPreference}
                    </Option>
                  ))}
                </Select>
              </div>
            </form>

            {filteredMenuSections?.map(
              (menuSection) =>
                menuSection.menuItems.length > 0 && (
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
                            avgRating={5}
                            allergens={menuItem.allergens}
                            dietPrefs={menuItem.dietaryPreferences}
                            restaurantId={searchParams.restaurantId}
                            imageUrl={menuItem.images[0]?.url}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ),
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
        )}
        <div className="mt-[800px]">
          <Divider />
        </div>
      </div>
    </main>
  );
}
