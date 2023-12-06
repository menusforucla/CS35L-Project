import { Review } from "@menus-for-ucla/db";
import Card from "@mui/material/Card/Card";

export function Review({
    review,
}: {
    review: Review;
}) {
    return (
        <Card asChild style={{ maxWidth: 350 }}>
        <a href="#">
            <Text as="div" size="2" weight="bold">
            Quick start
            </Text>
            <Text as="div" color="gray" size="2">
            Start building your next project in minutes
            </Text>
        </a>
        </Card>
    );
}