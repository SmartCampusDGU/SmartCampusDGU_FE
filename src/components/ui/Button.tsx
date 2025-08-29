// Button.tsx
import React from "react";

interface ButtonProps {
  variant: "save" | "register" | "delete";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick }) => {
  const getText = () => {
    switch (variant) {
      case "save":
        return "저장하기";
      case "register":
        return "등록하기";
      case "delete":
        return "삭제하기";
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-[475px] h-[53px] bg-[#DA5B00] text-white font-bold rounded-md border border-[#ACACAC]"
    >
      {getText()}
    </button>
  );
};

export default Button;

