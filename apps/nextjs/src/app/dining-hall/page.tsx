'use client'
import React, { useState, FormEvent } from 'react';
import { set } from 'zod';


export default function DiningHall({ searchParams}: {
    searchParams: {
        title: string;
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
        <h1 className="text-3xl font-bold">{searchParams.title}</h1>
        <h2 className="text-xl font-bold">Menu</h2>
        <ul>
            <li>Krabby Patty</li>
            <li>Krusty Krab Pizza</li>
            <li>Kelp Shake</li>
        </ul>
        <div className="w-100 h-72 relative items-center justify-center mx-auto">
            <h2 className="text-xl font-bold">Reviews</h2>
            <form onSubmit={handleSubmit}>
                <textarea value={review} placeholder="Write your review!" onChange={handleReviewChange}/>
                <button type="submit">Submit</button>
            </form>
            {submittedReview && <p>{submittedReview}</p>}
        </div>
    </div>
    );
};
  