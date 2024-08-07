import React from "react";
import logo from "/src/assets/icons/logo.png";
import fb from "/src/assets/icons/footer/fb.png";
import ig from "/src/assets/icons/footer/ig.png";
import tw from "/src/assets/icons/footer/tw.png";

function GeneralFooter() {
  return (
    <footer className="sm:w-full sm:h-[272px] md:w-full md:px-10 md:h-[272px] pb-10 bg-blue-900 flex items-center justify-center">
      <div className="sm:w-[343px] sm:h-[208px] sm:mt-8 md:flex md:w-[1120px] md:h-[48px] md:flex-row md:items-center md:justify-between xl:flex xl:w-[1120px] xl:h-[48px] xl:flex-row xl:items-center xl:justify-between">
        <img src={logo} alt="" className="sm:pt-0 md:pt-7"/>

        <div className="sm:gap-4 sm:mt-8 md:flex md:flex-row md:items-center md:space-x-4 md:gap-16 xl:flex xl:flex-row xl:items-center xl:space-x-4 xl:gap-16">
          <p className="text-white sm:pt-4 md:pt-0 md:text-base xl:pt-0 xl:text-base cursor-pointer">
            All Courses
          </p>
          <p className="text-white sm:pt-2 md:pt-0 md:text-base xl:pt-0 xl:text-base cursor-pointer">
            Bundle Package
          </p>
        </div>

        <div className="sm:gap-4 md:flex md:items-center md:space-x-4 md:gap-[16px] xl:flex xl:items-center xl:space-x-4 xl:gap-[16px] sm:flex sm:pt-[32px]">
          <img src={fb} alt="" className="md:w-12 md:h-12 xl:w-12 xl:h-12 cursor-pointer" />
          <img src={ig} alt="" className="md:w-12 md:h-12 xl:w-12 xl:h-12 cursor-pointer" />
          <img src={tw} alt="" className="md:w-12 md:h-12 xl:w-12 xl:h-12 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}

export default GeneralFooter;
