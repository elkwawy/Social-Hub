import React from "react";
import { Link } from "react-router-dom";
import LazyImage from "../../Utils/LazyImage";

const HeroSection = () => {
  return (
    <div className="relative overflow-y-hidden h-[calc(100vh-72px)] md:h-[calc(100vh-70px)] max-md:justify-between flex flex-col gap-6 pt-6 w-full bg-contain md:bg-cover bg-center  ">
      <div className="flex flex-col gap-5 items-center justify-center w-full">
        <div className="flex flex-col  md:w-3/4 lg:w-2/3 gap-6   relative">
          <h1 className="font-semibold text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl text-center">
            Widen your community with{" "}
            <p className="text-main-color">Social Hub.</p>
          </h1>
          <p className="text-gray-400 w-3/4 text-sm text-center mx-auto">
            Connect, share, and engage with friends and the world on{" "}
            <span className="text-sec-color">social hub</span>. Discover
            trending content, post updates, share videos, and interact with a
            vibrant community—all in one place. Stay connected like never
            before!
          </p>
          <Link
            to={"/signup"}
            type="button"
            className="text-white bg-main-color font-medium rounded-md  px-6 py-3 text-center text-sm hover:bg-sec-color trans w-fit mx-auto"
          >
            Get started
          </Link>
        </div>
      </div>
      <LazyImage
        style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        src="/src/assets/testHero.png"
        alt="heroIMG"
        className=" rounded-t-md w-3/4 sm:w-[60%] border-2    mx-auto  border-b-0 shadow-[0px_7px_29px_0px_rgba(0, 0, 0, 1)]"
        loader={
          <div className="w-3/4 sm:w-[60%] h-60 md:h-96 bg-gray-100 mx-auto rounded-md  animate-pulse" />
        }
      />
    </div>
  );
};

export default HeroSection;
