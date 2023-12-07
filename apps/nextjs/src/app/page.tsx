"use client";

import "@radix-ui/themes/styles.css";

import { api } from "~/utils/api";

import "react-circular-progressbar/dist/styles.css";

import React from "react";
import Link from "next/link";
import { Text, Theme } from "@radix-ui/themes";

import { DiningHall } from "./_components/home/dining-hall";

const restaurantImageMapping = {
  Epicuria: "/images/epic1.webp",
  DeNeve: "/images/deneve1.webp",
  BruinPlate: "/images/bplate1.webp",
  // Add more mappings as needed
};
export default function HomePage() {
  const { data: restaurants, error, isLoading } = api.restaurant.all.useQuery();
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Theme>
      <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-blue-200 to-yellow-100 text-black">
        <div className="container flex flex-col items-center justify-center gap-4 py-8">
          <Text
            size="9"
            style={{
              fontFamily: "Anton, sans-serif",
              fontWeight: "bold",
              color: "#0192c6",
            }}
          >
            Menus for UCLA
          </Text>
          <div className="flex w-full justify-around">
            {restaurants?.map((restaurant, index: number) =>
              restaurant.name == "Epic at Ackerman" ? null : (
                <DiningHall
                  key={index}
                  title={restaurant.name}
                  imageUrl={restaurantImageMapping[restaurant.name]}
                  availability={restaurant.currentActivityLevel}
                  id={restaurant.id}
                />
              ),
            )}
          </div>
          
        </div>
        <div className="container mt-12 flex" >

        <img
        src="/image/bplate.webp"  // Replace with the actual path to your bear image
        alt="Bear Image"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100px',  // Adjust the size as needed
          height: 'auto',  // Maintain aspect ratio
        }}
        />
        </div>
      </main>
    </Theme>
  );
}
