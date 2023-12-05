"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import Grid from "@mui/material/Unstable_Grid2";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { api } from "~/utils/api";
import { CreateReviewForm, PostList } from "../../_components/reviews";

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
    id: number;
  };
}) {
  const [review, setReview] = useState("");
  const [submittedReview, setSubmittedReview] = useState("");
  const [images, setImages] = React.useState([]);
  const maxImages = 5;
  const {
    data: foodItem,
    error,
    isLoading,
  } = api.menuItemRouter.byId.useQuery(Number(searchParams.id));
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
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
    <div style={{backgroundColor:"#f0e9e1"}}>
      <div className=" bg-blue-100 rounded-3xl m-8">
        <div className="ml-52 mt-8">
          <Grid container spacing={3} direction="row">
            <Grid direction="column">
              <h1 className="text-8xl font-bold">{searchParams.name}</h1>
              <Grid className="text-sm" container direction="row">
                <Grid><h3>Nutrition |</h3></Grid>
                <Grid><h3 className="whitespace-pre"> Allergens |</h3></Grid>
                <Grid><h3 className="whitespace-pre"> Ingredients</h3></Grid>
              </Grid>
              <Grid><p className="mt-8 text-lg">{foodItem?.description}</p></Grid>
            </Grid>
            <Grid className="mr-8"smOffset="auto">
              <img
                className="rounded-3xl"
                src="/images/KrustyKrab.webp"
                alt="Picture of the author"
                width="700"
              />
            </Grid>
          </Grid>
        </div>
      </div>
      {/*<p><b>INGREDIENTS: </b>{foodItem?.ingredients}</p>
      <p><b>ALLERGENS: </b>{foodItem?.allergens.map((allergen, index) => (
        <span key={allergen.id}>{allergen.name}{index < foodItem.allergens.length-1 ? ', ' : ''}</span>
      ))}</p>
      <p><b>DIETARY PREFERANCES: </b>{foodItem?.dietaryPreferences.map((dietaryPreference, index) => (
        <span key={dietaryPreference.id}>{dietaryPreference.name}{index < foodItem.dietaryPreferences.length-1 ? ', ' : ''}</span>
      ))}</p>*/}
      <div className="mx-52 w-100 relative mt-8 h-72 items-center justify-center">
        <h1 className="text-4xl font-bold">Wanna see more?</h1>
        <h2 className="text-xl font-semibold">Leave a review or upload an image!</h2>
        <ImageUploader images={images} onChange={onChange} maxImages={5} />
        <h2 className="text-xl font-bold">Reviews</h2>
        <CreateReviewForm></CreateReviewForm>
        <PostList restaurantId={1}></PostList>
      </div>
    </div>
  );
}
