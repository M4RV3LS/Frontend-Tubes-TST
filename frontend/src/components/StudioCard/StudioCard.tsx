import React from "react";
import { FaRegClock, FaStar } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import studioData from "../../data/studioData.json"; // Adjust the path as needed

const StudioCard = () => {
  const navigateToStudioDetail = (id: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/studio-detail/${id}`;
    }
  };
  return (
    <div className="grid grid-cols-3 gap-4 px-4">
      {studioData.map((studio) => (
        <div
          key={studio.id}
          className="card card-compact bg-base-100 shadow-xl"
        >
          <figure>
            <img src={studio.imgSrc[0]} alt={studio.studioName} />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title">{studio.studioName}</h2>
              <h2 className="card-title">{studio.priceRange}</h2>
            </div>

            <p>{studio.address}</p>
            <div className="grid grid-cols-3 mt-6 mb-4">
              <div className="flex flex-col justify-center items-center gap-y-2 ">
                <FaRegClock className="w-6 h-6" />
                <p className="text-lg">{studio.availableHours}</p>
              </div>

              <div className="flex flex-col justify-center items-center gap-y-2 border-x-2 border-gray-200">
                <HiUserGroup className="w-6 h-6" />
                <p className="text-lg">{studio.maximumParticipant} People</p>
              </div>

              <div className="flex flex-col justify-center items-center gap-y-2 ">
                <FaStar className="w-6 h-6" />
                <p className="text-lg">{studio.rating} / 5.0</p>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="px-2 py-4 m-2 bg-[#FFBE00] w-full rounded-lg font-bold text-lg"
                onClick={() => navigateToStudioDetail(studio.id)}
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudioCard;
