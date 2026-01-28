import Image, { StaticImageData } from "next/image";
import React from "react";
import { Star } from "lucide-react";

interface Props {
  item: {
    id: string | number;
    image: string | StaticImageData;
    review: string;
    username: string;
    userRole: string;
    rating?: number;
  };
}

const ReviewCard = ({ item }: Props) => {
  // Trim image URL to handle any whitespace
  const imageUrl =
    typeof item.image === "string" ? item.image.trim() : item.image;

  return (
    <div className="flex flex-col items-center w-full lg:w-[80%] mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 border border-gray-100 dark:border-gray-700">
      {/* Profile Image with Ring */}
      <div className="relative w-[100px] h-[100px]">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-30"></div>
        <Image
          className="relative object-cover rounded-full ring-4 ring-white dark:ring-gray-800"
          src={imageUrl}
          alt={item.review}
          width={100}
          height={100}
        />
      </div>

      {/* Star Rating */}
      {item.rating && (
        <div className="flex items-center gap-1 mt-6">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
      )}

      {/* Quote Icon */}
      <div className="mt-6 text-6xl text-purple-200 dark:text-purple-900/50 font-serif leading-none">
        "
      </div>

      {/* Main Review Text */}
      <h1 className="mt-2 text-xl md:text-2xl font-bold text-gray-800 dark:text-white text-center leading-relaxed">
        {item.review}
      </h1>

      {/* Divider */}
      <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-6"></div>

      {/* User Info */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {item.username}
        </h2>
        <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
          {item.userRole}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
