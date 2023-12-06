"use client";

import "@radix-ui/themes/styles.css";

import { api } from "~/utils/api";

import "react-circular-progressbar/dist/styles.css";

import React from "react";
import Link from "next/link";

import { DiningHall } from "./_components/home/dining-hall";

export default function HomePage() {
  const { data: restaurants, error, isLoading } = api.restaurant.all.useQuery();
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-black">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <Link href="/auth">
          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
            Sign In
          </button>
        </Link>
        <h1 className="text-5xl font-normal tracking-tight sm:text-[5rem]">
          Menus for UCLA
        </h1>
        <div className="flex w-full justify-around">
          {restaurants?.map((restaurant, index: number) => (
            <DiningHall
              key={index}
              title={restaurant.name}
              imageUrl="/images/KrustyKrab.webp"
              availability={restaurant.currentActivityLevel}
              id={restaurant.id}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
