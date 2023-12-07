"use client";

import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";

import "@uploadthing/react/styles.css";

import { Image } from "@menus-for-ucla/db";

import ReviewComponent from "~/app/_components/food-item/review-component";
import ReviewForm from "~/app/_components/review-form";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";
import { AllergenTag, DietaryTag } from "../../_components/tags";
import type {
  MenuItemsWithAllergensAndDietPrefsAndImages,
  ReviewWithUser,
} from "../page";

export default function FoodItem({
  searchParams,
}: {
  searchParams: { name: string; menuItemId: number; restaurantId: number };
}) {
  const [menuItem, setMenuItem] =
    useState<MenuItemsWithAllergensAndDietPrefsAndImages | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[] | null>(null);

  const {
    data: foodItem,
    error,
    isLoading,
  } = api.menuItemRouter.byId.useQuery(Number(searchParams.menuItemId));
  const { data: menuItemReviews, error: reviewsError } =
    api.review.byMenuItemId.useQuery(Number(searchParams.menuItemId));

  const createImage = api.image.create.useMutation();

  useEffect(() => {
    if (foodItem) {
      setMenuItem(foodItem);
    }
  }, [foodItem]);

  useEffect(() => {
    if (menuItemReviews) {
      setReviews(menuItemReviews);
    }
  }, [menuItemReviews]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-yellow-50">
      <div className="flex p-20">
        {isLoading ? (
          <div>Loading menu item information...</div>
        ) : error ? (
          <div>Failed to load menu item information.</div>
        ) : (
          <>
            <div className="flex-1 space-y-4 pr-10">
              <div>
                <h1 className="text-align break-words text-7xl font-bold">
                  {searchParams.name}
                </h1>
                <p className="text-lg">{menuItem?.description}</p>
              </div>

              <div>
                <h2
                  className="pb-2 pt-10 text-4xl font-bold"
                  style={{ color: "#0E0E0E" }}
                >
                  Details
                </h2>
                <Divider className="bg-violet-500/30" />
                <div>
                  <strong>Ingredients</strong>
                  <p>{menuItem?.ingredients}</p>
                </div>

                <div>
                  <strong>Allergens</strong>
                  <div>
                    {menuItem?.allergens && menuItem.allergens.length > 0 ? (
                      menuItem.allergens.map((allergen) => (
                        <span key={allergen.id}>
                          <AllergenTag name={allergen.name} />
                        </span>
                      ))
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </div>

                <div>
                  <strong>Dietary Preferences</strong>
                  <div>
                    {menuItem?.dietaryPreferences &&
                    menuItem.dietaryPreferences.length > 0 ? (
                      menuItem.dietaryPreferences.map((dietaryPreference) => (
                        <span key={dietaryPreference.id}>
                          <DietaryTag name={dietaryPreference.name} />
                        </span>
                      ))
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2
                  className="pb-2 pt-10 text-4xl font-bold"
                  style={{ color: "#0E0E0E" }}
                >
                  Reviews
                </h2>
                <Divider className="bg-violet-500/30" />
                <ReviewForm
                  restaurantId={Number(searchParams.restaurantId)}
                  menuItemIds={[Number(searchParams.menuItemId)]}
                />
                {reviewsError ? (
                  <div>Failed to load reviews.</div>
                ) : (
                  reviews?.map((review) => (
                    <ReviewComponent key={review.id} review={review} />
                  ))
                )}
              </div>

              <div>
                <h2
                  className="pb-2 pt-10 text-4xl font-bold"
                  style={{ color: "#0E0E0E" }}
                >
                  Upload Image
                </h2>
                <Divider className="bg-violet-500/30" />
                <UploadButton
                  className="ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 mt-5 rounded-md bg-blue-300 p-16"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Image uploaded successfully!");
                    res.forEach((file) => {
                      createImage.mutate({
                        menuItemId: Number(searchParams.menuItemId),
                        url: file.url,
                        type: "image",
                      });
                    });
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </div>
            </div>
            <div className="m-10 flex-1">
              {menuItem?.images && menuItem.images.length > 0 ? (
                menuItem.images.map((image: Image, index) => (
                  <img
                    key={index}
                    className="w-full rounded-3xl rounded-lg object-cover"
                    src={image.url}
                    alt="Author"
                  />
                ))
              ) : (
                <img
                  className="w-full rounded-3xl rounded-lg object-cover"
                  src="/images/default-food.jpg"
                  alt="Author"
                />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}