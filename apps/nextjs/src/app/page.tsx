import { Suspense } from "react";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

import Image from "next/image";
import Link from 'next/link';

interface DiningHallProps {
  title: string;
  imageUrl: string;
  availability: number;
}
const DiningHall: React.FC<DiningHallProps> = ({title, imageUrl, availability}) => {
  return(
    <Link href={{pathname: "/dining-hall", query: {title: title}}}>
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
  return (
    <main className="flex h-screen flex-col items-center text-black">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-normal tracking-tight sm:text-[5rem]">
          Menus for UCLA
        </h1>
        <AuthShowcase />

        <div className="flex w-full justify-around">
          <DiningHall title="Krusty Krab" imageUrl="/images/KrustyKrab.webp" availability={100}/>
          <DiningHall title="Krusty Krab 2" imageUrl="/images/KrustyKrab2.webp" availability={20}/>
          <DiningHall title="Chum Bucket" imageUrl="/images/ChumBucket.webp" availability={0}/>

        </div>
        {/* <CreatePostForm /> */}
        {/* <div className="h-[40vh] w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          ></Suspense>
        </div> */}
      </div>
    </main>
  );
}


