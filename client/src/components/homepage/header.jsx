import React from "react";
import Ellipse from "/src/assets/icons/header/sm/ellipse-sm.png";
import Book from "/src/assets/icons/header/sm/book-sm.png";
import Vector from "/src/assets/icons/header/sm/bg-header-sm.png";
import Vector1 from "/src/assets/icons/header/xl/vector1.png";
import Vector2 from "/src/assets/icons/header/xl/vector2.png";
import Vector3 from "/src/assets/icons/header/xl/vector3.png";
import BookXl from "/src/assets/icons/header/xl/vector4.png";
import VectorXl from "/src/assets/images/xl/vector-xl.png";

function Header() {
  return (
    <section
      id="header"
      className="relative sm:w-full sm:h-[704px] bg-Blue-100 sm:flex sm:justify-center  xl:h-[700px]"
    >
      <img
        src={Ellipse}
        alt=""
        className="absolute top-0 left-0 sm:mt-[74px] md:mt-[164px]"
      />
      <img src={Vector1} alt="" className=" absolute sm:hidden md:hidden xl:block xl:top-44 xl:ml-52"/>
      <img src={Vector2} alt="" className=" absolute sm:hidden md:hidden xl:block xl:top-[520px] xl:mr-32 z-20"/>
      <img src={Vector3} alt="" className=" absolute sm:hidden md:hidden xl:block xl:top-[570px] xl:ml-[1100px] z-20"/>
      <div className="relative z-10 sm:w-[343px] sm:h-[270px] sm:mt-14 md:p-0 md:mt-[165px] md:w-[643px] md:h-[370px] xl:p-0 xl:mt-[165px] xl:w-[643px] xl:h-[370px]  xl:mr-[350px]">
        <h1 className="relative text-black z-30 sm:w-[343px] sm:text-4xl sm:font-medium md:text-[66px] md:font-Headline3 md:w-[643px] md:h-[166px] md:leading-tight xl:text-[66px] xl:font-Headline3 xl:w-[643px] xl:h-[166px] xl:leading-tight">
          Best Virtual Classroom Software
        </h1>
        <p className="relative sm:text-Gray-700 sm:text-base sm:font-normal sm:pt-4 sm:z-40 sm:w-[343px] sm:h-[72px] md:mt-6 xl:mt-6">
          Welcome to Schooler! The one-stop online class management system that
          caters to all your educational needs!
        </p>
        <button className="font-bold text-base text-white bg-Blue-500 sm:px-8 sm:py-[18px] sm:rounded-xl sm:mt-8 md:mt-[60px] md:font-bold md:text-base xl:mt-[60px]">
          Explore Courses
        </button>
        <img
          src={Book}
          alt=""
          className="absolute sm:w-[317px] sm:h-[314px] sm:z-20 sm:mt-[26px] sm:justify-center sm:right-3 md:top-24 md:left-12 md:ml-56 md:z-20 xl:hidden"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <img src={BookXl} alt="" className=" absolute sm:hidden md:hidden xl:block xl:top-0 xl:left-0 xl:ml-[650px]"/>
      </div>
      <div className="absolute sm:z-0 sm:top-0 sm:left-0 sm:w-full sm:h-3/4 sm:mt-44 md:hidden xl:hidden">
        <img src={Vector} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute z-0 flex md:justify-end md:top-0 md:left-0 md:w-full md:h-full xl:justify-end xl:top-0 xl:left-0 xl:w-full xl:h-full">
        <img src={VectorXl} alt="" className="sm:hidden md:block xl:block" />
      </div>
    </section>
  );
}

export default Header;
