'use client'
import Image from "next/image";
import ReactStars from 'react-stars'
import React, { useState, FormEvent } from 'react';
export default function FoodItem({ searchParams }: {
    searchParams: {
        name: string;
    };
}) {
    const [review, setReview] = useState("");
    const [submittedReview, setSubmittedReview] = useState("");

    const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setSubmittedReview(review);
        setReview("");
    }
    return (
        <div>
            <h1 className="text-3xl font-bold">{searchParams.name}</h1>
            <div className="w-80 h-72 relative">
                <Image 
                className="m-auto object-cover rounded-t" 
                src={"/images/KrabbyPatty.webp"} 
                alt={"Krabby Patty"}
                layout="fill"
                />
            </div>  
            <p>Description: --TOP SECRET--</p>
            <div className="w-100 h-72 relative items-center justify-center mx-auto">
                <ReactStars />
                <h2 className="text-xl font-bold">Reviews</h2>
                <form onSubmit={handleSubmit}>
                    <textarea value={review} placeholder="Write your review!" onChange={handleReviewChange}/>
                    <button type="submit">Submit</button>
                </form>
                {submittedReview && <p>{submittedReview}</p>}
            </div>
        </div>
    );
}