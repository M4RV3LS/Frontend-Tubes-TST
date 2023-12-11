"use client";
import React from "react";

const SuccessPage = () => {
  const directToHomePage = () => {
    window.location.href = "/user-dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src="/assets/success.png" alt="success" className=" mb-4" />
      <div className="flex flex-col items-center">
        <h1 className="text-5xl text-[#616161] my-4 font-bold">Wohoo!</h1>
        <h1 className="text-2xl text-[#616161] mb-4 ">Transaction Success</h1>
      </div>

      <div className="flex justify center">
        <button
          className="bg-[#03C3A6] text-white shadow-xl rounded-xl px-6 py-2 text-xl font-bold"
          onClick={() => directToHomePage()} // Navigate to the home page
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
