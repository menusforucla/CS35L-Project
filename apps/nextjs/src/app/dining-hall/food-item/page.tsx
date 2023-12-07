"use client";

import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import * as Accordion from "@radix-ui/react-accordion";
import { UploadButton } from "@uploadthing/react";
import NutritionLabel from "../../../../../../node_modules/react-nutrition-label/src/components/NutritionLabel/index";
import { api } from "~/utils/api";
import { AllergenTag, DietaryTag } from "../../_components/tags";

export default function FoodItem({
  searchParams,
}: {
  searchParams: {
    name: string;
    id: number;
  };
}) {
  const {
    data: foodItem,
    error,
    isLoading,
  } = api.menuItemRouter.byId.useQuery(Number(searchParams.id));
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  console.log(foodItem?.allergens);
  return (
    <main className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Grid direction={"column"}>
        <Grid>
          <Grid>
            <img
              className="ml-8 rounded-3xl"
              src="/images/KrustyKrab.webp"
              alt="Author"
              width="700vw"
              style={{ float: "right" }}
            />
          </Grid>
          <Grid>
            <h1 className="text-align break-words text-7xl font-bold">
              {searchParams.name}
            </h1>
          </Grid>
        </Grid>
        <Grid className="text-lg">
          <p>{foodItem?.description}</p>
        </Grid>
        <Grid className="mt-4">
          <Accordion.Root
            className="flex rounded-lg bg-white p-4"
            type="multiple"
            style={{ flexDirection: "column" }}
          >
            <Accordion.Item value="value1">
              <Accordion.AccordionTrigger>
                Ingredients
              </Accordion.AccordionTrigger>
              <Accordion.AccordionContent>
                <p>{foodItem?.ingredients}</p>
              </Accordion.AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="value2">
              <Accordion.AccordionTrigger>Allergens</Accordion.AccordionTrigger>
              <Accordion.AccordionContent>
                {foodItem?.allergens.map((allergen) => (
                  <span key={allergen.id}>
                    <AllergenTag name={allergen.name} />
                  </span>
                ))}
              </Accordion.AccordionContent>
            </Accordion.Item>
            <Accordion.Item value="value3">
              <Accordion.AccordionTrigger>
                Dietary Preferences
              </Accordion.AccordionTrigger>
              <Accordion.AccordionContent>
                {foodItem?.dietaryPreferences.map((dietaryPreference) => (
                  <span key={dietaryPreference.id}>
                    <DietaryTag name={dietaryPreference.name} />
                  </span>
                ))}
              </Accordion.AccordionContent>
            </Accordion.Item>
            <Accordion.Item value="value4">
              <Accordion.AccordionTrigger>
              Nutrition Facts
              </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  {
                  foodItem?.nutritionFacts ?
                  <NutritionLabel 
                  servingSize={foodItem.nutritionFacts.servingSize} 
                  saturatedFat={foodItem.nutritionFacts.saturatedFat} 
                  sodium={foodItem.nutritionFacts.sodium} 
                  servingsPerContainer={foodItem.nutritionFacts.servingsPerContainer} 
                  calories={foodItem.nutritionFacts.calories} 
                  caloriesFromFat={foodItem.nutritionFacts.caloriesFromFat} 
                  totalFat={foodItem.nutritionFacts.totalFat}
                  transFat={foodItem.nutritionFacts.transFat}
                  cholesterol={foodItem.nutritionFacts.cholesterol}
                  totalCarbohydrate={foodItem.nutritionFacts.totalCarbohydrate}
                  dietaryFiber={foodItem.nutritionFacts.dietaryFiber}
                  sugars={foodItem.nutritionFacts.sugars}
                  protein={foodItem.nutritionFacts.protein}
                  vitamins={[foodItem.nutritionFacts.vitamins]}/>
                  : <Grid></Grid>
                  }
                </Accordion.AccordionContent>            
              </Accordion.Item>
          </Accordion.Root>
        </Grid>
      </Grid>
      <div className="w-100 relative mx-52 mt-8 h-72 items-center justify-center">
        <h1 className="text-4xl font-bold">Wanna see more?</h1>
        <h2 className="text-xl font-semibold">
          Leave a review or upload an image!
        </h2>
        {/* <ImageUploader images={images} onChange={onChange} maxImages={5} /> */}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
        <h2 className="text-xl font-bold">Reviews</h2>
      </div>
    </main>
  );
}
