"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import Grid from "@mui/material/Unstable_Grid2";
import * as Dialog from "@radix-ui/react-dialog";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { api } from "~/utils/api";
import { CreateReviewForm, PostList } from "../../_components/reviews";
import { Tag } from "../../_components/tags";
import NutritionLabel from "../../../../../../node_modules/react-nutrition-label/src/components/NutritionLabel/index";
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

interface DialogBoxProps {
  title: string;
  children?: any[];
}
const DialogBox: React.FC<DialogBoxProps> = ({ title, children }) => {
  //console.log(children);
  return (
    <div>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <Dialog.Content
        className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-4 shadow-lg"
        style={{ width: "30rem" }}
      >
        <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
        <Dialog.Description className="text-sm">
          {children?.map((child, index) => (
            <p>
              <span key={index}>
                {child.name}
                {index < children.length - 1 ? ", " : ""}
              </span>
            </p>
          ))}
        </Dialog.Description>
      </Dialog.Content>
    </div>
  );
};

const DialogNutritions: React.FC<DialogBoxProps> = ({ title, children }) => {
  //console.log(children);
  return (
    <div>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <Dialog.Content
        className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-4 shadow-lg"
        style={{ width: "30rem"}}
      >
        <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
        <div className="flex justify-center">
          <NutritionLabel 
            servingSize="2" 
            saturatedFat={2} 
            sodium={2} 
            servingsPerContainer="1" 
            calories={2} 
            caloriesFromFat={2} 
            totalFat={2}
            transFat={2}
            cholesterol={1}
            totalCarbohydrate={1}
            dietaryFiber={1}
            sugars={1}
            protein={11}
            vitamins={["Meow"]}/>
          </div>
      </Dialog.Content>
    </div>
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
  const [images, setImages] = React.useState([]);
  const {
    data: foodItem,
    error,
    isLoading,
  } = api.menuItemRouter.byId.useQuery(Number(searchParams.id));
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };
  console.log(foodItem?.allergens);
  return (
    <div style={{ backgroundColor: "#f0e9e1" }}>
      <div
        className=" m-8 flex rounded-3xl bg-blue-100"
        style={{ alignItems: "stretch" }}
      >
        <div className="my-8 ml-52 mr-8 flex-grow">
          <Grid direction={"column"}>
            <Grid>
              <div>
                <img
                  className="rounded-3xl"
                  src="/images/KrustyKrab.webp"
                  alt="Picture of the author"
                  width="700"
                  style={{ float: "right" }}
                />
                <h1 className="text-align break-words text-8xl font-bold">
                  {searchParams.name}
                </h1>
              </div>
            </Grid>
            <Grid className="text-sm" container direction="row">
              <Grid>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <h3 className="mt-4"> Nutritions | </h3>
                    <DialogNutritions title="Nutritions"/>
                  </Dialog.Trigger>
                </Dialog.Root>
              </Grid>
              <Grid>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <h3 className="mt-4 whitespace-pre"> Ingredients | </h3>
                    <DialogBox title="Ingredients" children={[foodItem?.ingredients]} />
                  </Dialog.Trigger>
                </Dialog.Root>
              </Grid>
              <Grid>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <h3 className="mt-4 whitespace-pre">Allergens</h3>
                  </Dialog.Trigger>
                  <DialogBox title="Allergens" children={foodItem?.allergens} />
                </Dialog.Root>
              </Grid>
            </Grid>
            <Grid className="text-lg">
              <p>{foodItem?.description}</p>
            </Grid>
            <Grid container direction="row">
              {foodItem?.dietaryPreferences.map((dietaryPreference) => (
                <Grid key={dietaryPreference.id}>
                  <Tag name={dietaryPreference.name} />
                </Grid>
              ))}
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
      <div className="w-100 relative mx-52 mt-8 h-72 items-center justify-center">
        <h1 className="text-4xl font-bold">Wanna see more?</h1>
        <h2 className="text-xl font-semibold">
          Leave a review or upload an image!
        </h2>
        <ImageUploader images={images} onChange={onChange} maxImages={5} />
        <h2 className="text-xl font-bold">Reviews</h2>
        <CreateReviewForm></CreateReviewForm>
        <PostList restaurantId={1}></PostList>
      </div>
    </div>
  );
}
