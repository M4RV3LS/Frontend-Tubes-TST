// pages/user-dashboard.tsx
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import bg from "../../../public/jumbotron.jpg";
import HeroSection from "@/components/HeroSection/HeroSection";
import Navbar from "@/components/Navbar/Navbar";
import StudioCard from "@/components/StudioCard/StudioCard";
import Footer from "@/components/Footer/Footer";

const UserDashboard = () => {
  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    // Log the token to the console
    console.log("JWT Token:", token);
  }, []);

  return (
    <div>
      {/* Navbar Section */}
      <Navbar />

      {/* Main Container */}
      <main className="w-full">
        {/* Hero Section */}

        <section className="bg-center bg-no-repeat  bg-gray-700 bg-blend-multiply bg-[url('/assets/jumbotron_2.jpg')]">
          <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              We invest in the worlds potential talented musician
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
              Here at soundspace we focus on world where technology, innovation,
              and music can unlock long-term value and drive world growth.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
              <a
                href="/about"
                className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
              >
                About Us
              </a>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <div className="m-4">
          <HeroSection />
        </div>

        {/* Music Studio catalog */}

        <div className="py-8 px-4">
          <h2 className="text-3xl font-bold text-black ">
            Popular Music Studio For You
          </h2>
        </div>

        <StudioCard />
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
