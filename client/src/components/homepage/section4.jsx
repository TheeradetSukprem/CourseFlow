import React from "react";
import vector1 from "/src/assets/images/sm/section4/vector1.png";
import vector2 from "/src/assets/images/sm/section4/vector2.png";
import Ellipse1 from "/src/assets/icons/section4/xl/Ellipse1.png";
import Ellipse2 from "/src/assets/icons/section4/xl/Ellipse2.png";
import { useNavigate } from "react-router-dom";

function Section4() {
  const gradientStyle = {
    background: "linear-gradient(270.94deg, #5697FF 7.78%, #2558DD 73.86%)",
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/courselist");
    window.scrollTo(0, 0); 
  };

  return (
    <section>
      <div
        className="sm:w-full sm:h-[500px] sm:flex sm:justify-center md:w-full md:h-[500px] xl:w-full xl:h-[500px]"
        style={gradientStyle}
      >
        <div className="sm:w-[343px] sm:h-[375px] sm:flex sm:justify-center md:w-full md:h-[500px] md:justify-start xl:w-full xl:h-[500px] xl:justify-start">
          <img
            src={Ellipse1}
            alt=""
            className="absolute sm:hidden md:block md:ml-[450px] md:mt-[403px] xl:block xl:ml-[567px] xl:mt-[403px]"
          />
          <img
            src={Ellipse2}
            alt=""
            className="absolute sm:hidden md:block md:right-0 md:mr-[51px] md:mt-[158px] xl:block xl:right-0 xl:mr-[51px] xl:mt-[158px]"
          />
          <div className="sm:mt-16 sm:w-[343px] sm:h-[114px] sm:flex sm:flex-col sm:text-center sm:mx-[16px] md:pl-[161px] md:pt-[125px] md:w-[453px] md:h-[149px] xl:pl-[161px] xl:pt-[125px] xl:w-[453px] xl:h-[149px]">
            <h1 className="sm:text-white sm:font-medium sm:text-2xl md:font-medium md:text-4xl md:w-[453px] xl:font-medium xl:text-4xl xl:w-[453px]">
              Want to start learning?
            </h1>
            <button
              onClick={handleNavigate}
              className="cursor-pointer sm:mt-[24px] sm:text-orange-500 sm:bg-white sm:mx-[51px] sm:py-[18px] sm:rounded-xl sm:border-orange-500 sm:border-[1px] sm:font-bold sm:text-4 md:w-[241px] md:h-[60px] xl:w-[241px] xl:h-[60px]"
            >
              <span className="mt-6">Check out our courses</span>
            </button>
          </div>
        </div>
        <img
          src={vector1}
          alt=""
          className="absolute sm:pt-[190px] md:hidden xl:hidden"
        />
        <img
          src={vector2}
          alt=""
          className="sm:hidden md:block md:w-[500px] md:h-[350px] md:mr-[159px] md:mt-[153px] xl:block xl:w-[592px] xl:h-[448.59px] xl:mr-[159px] xl:mt-[53px]"
        />
      </div>
    </section>
  );
}

export default Section4;
