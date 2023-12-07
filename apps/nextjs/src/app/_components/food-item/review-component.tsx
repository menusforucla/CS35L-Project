import Card from "@mui/material/Card/Card";
import { Box, Text } from "@radix-ui/themes";
import type { ReviewWithUser } from "~/app/dining-hall/page";
import * as Avatar from '@radix-ui/react-avatar';
import StarRating from "../star-rating";

export default function ReviewComponent({
  review,
}: {
  review: ReviewWithUser;
}) {
  return (
    <Card className="my-8 p-6 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <Avatar.Root className="bg-blackA1 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <Avatar.Image
          className="h-full w-full rounded-[inherit] object-cover"
          src={review.user.image!}
          alt='user'
        />
        <Avatar.Fallback
          className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
          delayMs={600}
        >
          {review.user.name?.[0] ?? 'A'}
        </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-col justify-center ml-2">
          <Text as="div" size="2" weight="bold" className="text-gray-800">
            {review.user.name}
          </Text>
          <StarRating initialRating={review.rating}/>
        </div>
      </div>
      <Box>
        <Text as="div" size="2">
          {review.review}
        </Text>
      </Box>
    </Card>
  );
}
