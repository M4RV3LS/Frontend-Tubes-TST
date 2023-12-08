// components/MenuCard/MenuCard.tsx
import React from "react";
import Image from "next/image";

interface MenuCardProps {
  menuPictureSource: string;
  menuName: string;
  price: number;
  duration: number;
  calories: number;
  level: string;
  description: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menuPictureSource,
  menuName,
  price,
  duration,
  calories,
  level,
  description,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-32 w-full">
        <Image
          src="./assets/menu.jpg"
          layout="fill"
          objectFit="cover"
          alt={menuName}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{menuName}</h3>
        <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Duration: {duration} mins</p>
        <p className="text-sm text-gray-600">Calories: {calories}</p>
        <p
          className={`text-sm ${
            level === "Easy" ? "text-green-500" : "text-red-500"
          }`}
        >
          {level}
        </p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default MenuCard;
