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

interface DiningHallProps {
  title: string;
  imageUrl: string;
  availability: number;
  id: number;
}
const DiningHall: React.FC<DiningHallProps> = ({title, imageUrl, availability, id}) => {
  return( // https://flowbite.com/docs/components/card/
    <Link href={{pathname: "/dining-hall", query: {title: title, id:id}}}>
      <div className="max-w-sm overflow-hidden shadow-lg bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
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
      <main className="flex h-screen flex-col items-center text-black ">
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