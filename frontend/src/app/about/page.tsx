import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <Navbar />
      <main className="w-full grid grid-cols-5 mt-24">
        <div className="col-span-2">
          <Image
            src="/assets/soundspace logo.svg"
            alt="SoundSpace Logo"
            width={600}
            height={600}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-y-4 col-span-3">
          <h1 className="text-5xl font-bold">About SoundSpace</h1>
          <p className="text-xl font-normal">
            SoundSpace merupakan platform inovatif yang dirancang untuk
            meningkatkan pengalaman bermusik bagi musisi, seniman, dan pecinta
            musik. Platform ini menyediakan solusi terintegrasi untuk pemesanan
            dan pengelolaan studio, mempermudah interaksi antara musisi dan
            pemilik studio Indonesia untuk bertukar informasi terkait informasi
            penyediaan sewa ruangan musik studio.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default page;
