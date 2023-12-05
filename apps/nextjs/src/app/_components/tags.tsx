"use client";

import React from "react";
import Chip from "@mui/material/Chip";

interface TagProps {
    name: string;
};

export const Tag: React.FC<TagProps> = ({ name })=>  {
  return (
    <Chip
      className="my-2 mr-2 text-sm text-white"
      label={name}
      style={{ backgroundColor: "#58a1d1", color: "white" }}
      sx={{ borderRadius: 2 }}
    />
  );
}