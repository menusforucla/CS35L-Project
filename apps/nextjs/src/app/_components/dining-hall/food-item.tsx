import React from "react";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";

import type { Allergen, DietaryPreference } from "@menus-for-ucla/db";

import { AllergenTag, DietaryTag } from "../tags";

interface FoodItemsProps {
  name: string;
  description: string;
  id: number;
  avgRating: number;
  allergens?: Allergen[];
  dietPrefs?: DietaryPreference[];
  restaurantId: number;
  imageUrl: string | undefined;
}

export const FoodItem: React.FC<FoodItemsProps> = ({
  name,
  description,
  id,
  avgRating,
  allergens,
  dietPrefs,
  restaurantId,
  imageUrl,
}) => {
  const allergenArray = Object.values(allergens ?? {});
  const dietPrefsArray = Object.values(dietPrefs ?? {});

  return (
    <Link
      href={{
        pathname: "/dining-hall/food-item",
        query: { name: name, restaurantId: restaurantId, menuItemId: id },
      }}
    >
      <div className="flex h-60 rounded-lg border-2 border-blue-400/50 bg-sky-500/30 p-2 shadow-sm backdrop-blur transition-colors hover:bg-sky-200">
        <img
          className="h-full w-1/2 rounded-l-lg object-cover"
          src={imageUrl ?? "/images/default-food.jpg"}
          alt={name}
        />
        <div className="flex w-1/2 flex-col justify-between p-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{name}</h2>
              <span className="flex items-center text-lg font-semibold">
                <StarIcon style={{ fill: "#D2B41A", marginTop: "-1px" }} />
                {avgRating}
              </span>
            </div>
            <p className="text-base font-semibold text-gray-700">
              {description}
            </p>
          </div>
          <div>
            <div>
              {allergenArray.map((allergen) => (
                <AllergenTag key={allergen.id} name={allergen.name} />
              ))}
            </div>
            <div>
              {dietPrefsArray.map((dietPref) => (
                <DietaryTag key={dietPref.id} name={dietPref.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
