'use client'
import { AuthShowcase } from "./_components/auth-showcase";

import { api } from "~/utils/api";
import Image from "next/image";
import Link from 'next/link';

interface DiningHallProps {
  title: string;
  imageUrl: string;
  availability: number;
  id: number;
}
const DiningHall: React.FC<DiningHallProps> = ({title, imageUrl, availability, id}) => {
  return(
    <Link href={{pathname: "/dining-hall", query: {title: title, id:id}}}>
      <div className="w-full h-full rounded overflow-hidden shadow-lg text-center bg-white p-10">
        <h1 className="text-5xl font-bold mb-2">{title}</h1>
        <div className="w-100 h-72 relative items-center justify-center mx-auto">
          <Image 
            className="m-auto object-cover rounded-t" 
            src={imageUrl} 
            alt={title}
            layout="fill"
          />
        </div>
        <h2 className="text-xl font-bold mt-2">Availability: {availability}%</h2>
      </div>
      </Link>
  );
};


export default function HomePage() {
  const { data: restaurants, error, isLoading } = api.restaurant.all.useQuery();
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="flex h-screen flex-col items-center text-black">
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