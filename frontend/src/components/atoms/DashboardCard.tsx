import React from "react";
import Button from "./Button";

interface CardProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, onClose }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 m-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {onClose && (
          <Button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Card;
