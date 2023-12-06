"use client";

import React from "react";
import Chip from "@mui/material/Chip";

interface TagProps {
    name: string;
};

export const AllergenTag: React.FC<TagProps> = ({ name })=>  {
  return (
    <Chip
      className="my-2 mr-2 text-xs text-white"
      label={name}
      style={{ backgroundColor: "#a83258", color: "white" }}
      size="small"
      sx={{ borderRadius: 2 }}
    />
  );
}

export const DietaryTag: React.FC<TagProps> = ({ name })=>  {
  return (
    <Chip
      className="my-2 mr-2 text-xs text-white"
      label={name}
      style={{ backgroundColor: "#32a86b", color: "white"}}
      size="small"
      sx={{ borderRadius: 2 }}
    />
  );
}