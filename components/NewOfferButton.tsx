// components/NewOfferButton.tsx
"use client";

import React from "react";
import { Button } from "./ui/button";

interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children }) => {
  return (
    <Button
      onClick={onClick}
      className="bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300"
    >
      {children}
    </Button>
  );
};

export default CustomButton;
