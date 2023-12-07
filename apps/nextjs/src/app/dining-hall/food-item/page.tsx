"use client";

import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";

import "@uploadthing/react/styles.css";

import * as Dialog from "@radix-ui/react-dialog";

import { Image } from "@menus-for-ucla/db";

import { DialogBox } from "~/app/_components/dialog-box";
import ReviewComponent from "~/app/_components/food-item/review-component";
import ReviewForm from "~/app/_components/review-form";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";
import { AllergenTag, DietaryTag } from "../../_components/tags";
import NutritionLabel from "../../../../../../node_modules/react-nutrition-label/src/components/NutritionLabel/index";
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
            <div className="mt-10 flex-1 space-y-4 pr-10">
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
                <Divider className="mb-5 bg-violet-500/30" />

                <div className="mb-5 mt-5">
                  <strong>Ingredients</strong>
                  <p>{menuItem?.ingredients}</p>
                </div>

                <div className="mb-5">
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

                <div className="mb-5">
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
                <Dialog.Root>
                  <Dialog.Trigger>
                    <strong className="relative after:absolute after:block after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition after:duration-300 after:content-[''] after:hover:scale-x-100">
                      Click to View Nutrition Facts
                    </strong>
                  </Dialog.Trigger>
                  <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                  <Dialog.Content
                    className="absolute left-1/2 top-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 transform justify-center rounded-lg bg-white p-4 shadow-lg"
                    style={{ width: "30rem" }}
                  >
                    {menuItem?.nutritionFacts ? (
                      <NutritionLabel
                        servingSize={menuItem.nutritionFacts.servingSize}
                        saturatedFat={menuItem.nutritionFacts.saturatedFat}
                        sodium={menuItem.nutritionFacts.sodium}
                        servingsPerContainer={
                          menuItem.nutritionFacts.servingSize
                        }
                        calories={menuItem.nutritionFacts.calories}
                        caloriesFromFat={menuItem.nutritionFacts.calories}
                        totalFat={menuItem.nutritionFacts.totalFat}
                        transFat={menuItem.nutritionFacts.transFat}
                        cholesterol={menuItem.nutritionFacts.cholesterol}
                        totalCarbohydrate={
                          menuItem.nutritionFacts.totalCarbohydrate
                        }
                        dietaryFiber={menuItem.nutritionFacts.dietaryFiber}
                        sugars={menuItem.nutritionFacts.sugars}
                        protein={menuItem.nutritionFacts.protein}
                        vitamins={[menuItem.nutritionFacts.vitaminD]}
                      />
                    ) : (
                      <p>Not Available</p>
                    )}
                  </Dialog.Content>
                </Dialog.Root>
              </div>
              <div>
                <h2
                  className="pb-2 pt-10 text-4xl font-bold"
                  style={{ color: "#0E0E0E" }}
                >
                  Reviews
                </h2>
                <Divider className="mb-5 bg-violet-500/30" />
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
                    //alert("Image uploaded successfully!");
                    window.location.reload();
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
            <div className="max-w-xxl max-h-xxl m-10 flex-1 items-center justify-center">
              {menuItem?.images && menuItem.images.length > 0 ? (
                menuItem.images.map((image: Image, index) => (
                  <img
                    key={index}
                    className="max-h-l mb-4 w-full max-w-xl rounded-3xl rounded-lg object-cover"
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
