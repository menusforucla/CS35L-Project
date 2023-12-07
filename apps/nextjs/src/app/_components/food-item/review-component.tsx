import Card from "@mui/material/Card/Card";
import { Avatar, Box, Flex, Text } from "@radix-ui/themes";

import type { ReviewWithUser } from "~/app/dining-hall/page";

export default function ReviewComponent({
  review,
}: {
  review: ReviewWithUser;
}) {
  return (
    <Card style={{ maxWidth: 240 }}>
      <Flex gap="3" align="center">
        <Avatar size="3" src={review.user.image!} radius="full" fallback="T" />
        <Box>
          <Text as="div" size="2" weight="bold">
            {review.user.name}
          </Text>
          {review.rating}
          <Text as="div" size="2" color="gray">
            {review.review}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}
