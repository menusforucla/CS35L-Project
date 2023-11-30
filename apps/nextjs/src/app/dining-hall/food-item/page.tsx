"use client";

//import ReactStars from "react-stars";
import React, { FormEvent, ReactNode, useState } from "react";
import Image from "next/image";
import ImageUploading, { ImageListType } from "react-images-uploading";
import {CreateReviewForm } from "../../_components/reviews"

interface ImageUploaderProps {
  images: ImageListType;
  onChange: (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => void;
  maxImages: number;
}
const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages,
}) => {
  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxImages}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        <div>
          <div className="flex space-x-2">
            <button
              className="whitespace-nowrap rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button
              className="whitespace-nowrap rounded border border-red-500 bg-transparent px-4 py-2 font-semibold text-red-700 hover:border-transparent hover:bg-red-500 hover:text-white"
              onClick={onImageRemoveAll}
            >
              Remove All Images
            </button>
          </div>

          {imageList.map((image, index) => (
            <div key={index}>
              <Image
                className="rounded-t"
                src={image.data_url}
                alt={""}
                width="100"
                height="100"
              />
              <div className="flex space-x-2">
                <button
                  className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                  onClick={() => onImageUpdate(index)}
                >
                  Update
                </button>
                <button
                  className="rounded border border-red-500 bg-transparent px-4 py-2 font-semibold text-red-700 hover:border-transparent hover:bg-red-500 hover:text-white"
                  onClick={() => onImageRemove(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
};

export default function FoodItem({
  searchParams,
}: {
  searchParams: {
    name: string;
  };
}) {
  const [review, setReview] = useState("");
  const [submittedReview, setSubmittedReview] = useState("");
  const [images, setImages] = React.useState([]);
  const maxImages = 5;

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReview(event.target.value);
    
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedReview(review);
    setReview("");
  };
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold">{searchParams.name}</h1>
      <ImageUploader images={images} onChange={onChange} maxImages={maxImages}/>
      <p>Description: --TOP SECRET--</p>
      <div className="w-100 relative mx-auto h-72 items-center justify-center">
        <h2 className="text-xl font-bold">Reviews</h2>
        <CreateReviewForm></CreateReviewForm>
      </div>
    </div>
  );
}
