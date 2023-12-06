import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import { Grid } from "@mui/material";

import type { Allergen, DietaryPreference } from "@menus-for-ucla/db";

import { AllergenTag, DietaryTag } from "../tags";
import React from "react";

interface FoodItemsProps {
  name: string;
  description: string;
  id: number;
  avgRating: number;
  allergens?: Allergen[];
  dietPrefs?: DietaryPreference[];
}

export const FoodItem: React.FC<FoodItemsProps> = ({
  name,
  description,
  id,
  avgRating,
  allergens,
  dietPrefs,
}) => {
  const calculateWidth = (name: string) => {
    return `${100 + 12 * name.length}px`;
  };
  const allergenArray = Object.values(allergens ?? {});
  const dietPrefsArray = Object.values(dietPrefs ?? {});

  return (
    <Grid>
      <Link
        href={{
          pathname: "/dining-hall/food-item",
          query: { name: name, id: id },
        }}
      >
        <div
          className="rounded-2xl border-2 border-violet-900/50 bg-sky-500/30 p-2 shadow-sm backdrop-blur transition-colors hover:bg-sky-200"
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
            <AllergenTag key={allergen.id} name={allergen.name} />
          ))}
          {dietPrefsArray.map((dietPref) => (
            <DietaryTag key={dietPref.id} name={dietPref.name} />
          ))}
        </div>
      </Link>
    </Grid>
  );
};