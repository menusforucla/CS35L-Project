'use client'
import '@radix-ui/themes/styles.css';
//import { Theme } from '@radix-ui/themes';
//import * as Popover from '@radix-ui/react-popover';
//import { AuthShowcase } from "./_components/auth-showcase";
import { api } from "~/utils/api";
//import Image from "next/image";
import Link from 'next/link';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from 'react';

interface DiningHallProps {
  title: string;
  imageUrl: string;
  availability: number;
  id: number;
}
const DiningHall: React.FC<DiningHallProps> = ({title, imageUrl, availability, id}) => {
  return( // https://flowbite.com/docs/components/card/
    <Link href={{pathname: "/dining-hall", query: {title: title, id:id}}}>
      <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:shadow-sky-100 max-w-sm overflow-hidden mx-2 mt-8 shadow-lg bg-white border-2 border-violet-800/30 rounded-lg bg-white/40 backdrop-blur">
        <img
          className="rounded-t-lg w-full" 
          src={imageUrl} 
          alt={title}
        />
        <div className="px-6 py-4"> 
          <h1 className="font-bold text-center text-4xl mb-2">{title}</h1>
          <h2 className=" mt-4 text-gray-700 text-center text-xl font-bold">Availability:</h2>
          <CircularProgressbar className='mt-4 flex justify-center items-center h-28' value={availability} text={`${availability}%`} strokeWidth={5}/>
        </div>
      </div>
    </Link>
  );
};

export default function HomePage() {
  const { data: restaurants, error, isLoading } = api.restaurant.all.useQuery();
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
      <main className="font-serif flex h-screen flex-col items-center text-black bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
          <h1 className="text-5xl font-normal tracking-tight sm:text-[5rem]">
            Menus for UCLA
          </h1>
          <div className="flex w-full justify-around">
            {restaurants?.map((restaurant, index: number) => 
                (<DiningHall
                  key={index} 
                  title={restaurant.name} 
                  imageUrl="/images/KrustyKrab.webp" 
                  availability={restaurant.currentActivityLevel} 
                  id={restaurant.id}/>)
            )}
          </div>
        </div>
      </main>
  );
}