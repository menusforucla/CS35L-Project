"use client";

import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import * as Accordion from "@radix-ui/react-accordion";
import { UploadButton } from "@uploadthing/react";

import { api } from "~/utils/api";
import { CreateReviewForm, PostList } from "../../_components/reviews";
import { AllergenTag, DietaryTag } from "../../_components/tags";

// interface ImageUploaderProps {
//   images: ImageListType;
//   onChange: (
//     imageList: ImageListType,
//     addUpdateIndex: number[] | undefined,
//   ) => void;
//   maxImages: number;
// }
// const ImageUploader: React.FC<ImageUploaderProps> = ({
//   images,
//   onChange,
//   maxImages,
// }) => {
//   return (
//     <ImageUploading
//       multiple
//       value={images}
//       onChange={onChange}
//       maxNumber={maxImages}
//       dataURLKey="data_url"
//     >
//       {({
//         imageList,
//         onImageUpload,
//         onImageRemoveAll,
//         onImageUpdate,
//         onImageRemove,
//         isDragging,
//         dragProps,
//       }) => (
//         <div>
//           <div className="flex space-x-2">
//             <button
//               className="whitespace-nowrap rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
//               style={isDragging ? { color: "red" } : undefined}
//               onClick={onImageUpload}
//               {...dragProps}
//             >
//               Click or Drop here
//             </button>
//             &nbsp;
//             <button
//               className="whitespace-nowrap rounded border border-red-500 bg-transparent px-4 py-2 font-semibold text-red-700 hover:border-transparent hover:bg-red-500 hover:text-white"
//               onClick={onImageRemoveAll}
//             >
//               Remove All Images
//             </button>
//           </div>

//           {imageList.map((image, index) => (
//             <div key={index}>
//               <Image
//                 className="rounded-t"
//                 src={image.data_url}
//                 alt={""}
//                 width="100"
//                 height="100"
//               />
//               <div className="flex space-x-2">
//                 <button
//                   className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
//                   onClick={() => onImageUpdate(index)}
//                 >
//                   Update
//                 </button>
//                 <button
//                   className="rounded border border-red-500 bg-transparent px-4 py-2 font-semibold text-red-700 hover:border-transparent hover:bg-red-500 hover:text-white"
//                   onClick={() => onImageRemove(index)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </ImageUploading>
//   );
// };

export default function FoodItem({
  searchParams,
}: {
  searchParams: {
    name: string;
    id: number;
  };
}) {
  // const [review, setReview] = useState("");
  // const [submittedReview, setSubmittedReview] = useState("");
  // const [images, setImages] = React.useState([]);
  const {
    data: foodItem,
    error,
    isLoading,
  } = api.menuItemRouter.byId.useQuery(Number(searchParams.id));
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  // const handleReviewChange = (
  //   event: React.ChangeEvent<HTMLTextAreaElement>,
  // ) => {
  //   setReview(event.target.value);
  // };
  // const handleSubmit = (event: FormEvent) => {
  //   event.preventDefault();
  //   setSubmittedReview(review);
  //   setReview("");
  // };
  // const onChange = (
  //   imageList: ImageListType,
  //   addUpdateIndex: number[] | undefined,
  // ) => {
  //   console.log(imageList, addUpdateIndex);
  //   setImages(imageList as never[]);
  // };

  console.log(foodItem?.allergens);
  return (
    <main className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div
        className=" m-8 flex rounded-3xl bg-sky-500/20"
        style={{ alignItems: "stretch" }}
      >
        <div className="my-8 ml-52 mr-8 flex-grow">
          <Grid direction={"column"}>
            <Grid>
              <Grid>
                <img
                  className="ml-8 rounded-3xl"
                  src="/images/KrustyKrab.webp"
                  alt="Author"
                  width="700vw"
                  style={{ float: "right" }}
                />
              </Grid>
              <Grid>
                <h1 className="text-align break-words text-7xl font-bold">
                  {searchParams.name}
                </h1>
              </Grid>
            </Grid>
            <Grid className="text-lg">
              <p>{foodItem?.description}</p>
            </Grid>
            <Grid className="mt-4">
              <Accordion.Root
                className="flex rounded-lg bg-white p-4"
                type="multiple"
                style={{ flexDirection: "column" }}
              >
                <Accordion.Item value="value1">
                  <Accordion.AccordionTrigger>
                    Ingredients
                  </Accordion.AccordionTrigger>
                  <Accordion.AccordionContent>
                    <p>{foodItem?.ingredients}</p>
                  </Accordion.AccordionContent>
                </Accordion.Item>

                <Accordion.Item value="value2">
                  <Accordion.AccordionTrigger>
                    Allergens
                  </Accordion.AccordionTrigger>
                  <Accordion.AccordionContent>
                    {foodItem?.allergens.map((allergen) => (
                      <span key={allergen.id}>
                        <AllergenTag name={allergen.name} />
                      </span>
                    ))}
                  </Accordion.AccordionContent>
                </Accordion.Item>
                <Accordion.Item value="value3">
                  <Accordion.AccordionTrigger>
                    Dietary Preferences
                  </Accordion.AccordionTrigger>
                  <Accordion.AccordionContent>
                    {foodItem?.dietaryPreferences.map((dietaryPreference) => (
                      <span key={dietaryPreference.id}>
                        <DietaryTag name={dietaryPreference.name} />
                      </span>
                    ))}
                  </Accordion.AccordionContent>
                </Accordion.Item>
              </Accordion.Root>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="w-100 relative mx-52 mt-8 h-72 items-center justify-center">
        <h1 className="text-4xl font-bold">Wanna see more?</h1>
        <h2 className="text-xl font-semibold">
          Leave a review or upload an image!
        </h2>
        {/* <ImageUploader images={images} onChange={onChange} maxImages={5} /> */}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
        <h2 className="text-xl font-bold">Reviews</h2>
        <CreateReviewForm></CreateReviewForm>
        <PostList restaurantId={1}></PostList>
      </div>
    </main>
  );
}
