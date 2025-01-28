'use client'

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger);

 export default function Screen2()  {
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const [val3, setVal3] = useState(0);
  const [val4, setVal4] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      let timeInterval3: NodeJS.Timeout;

      const timeInterval = setInterval(() => {
        val1 < 10 && setVal1((prevCount) => prevCount + 1);
      }, 100);

      const timeInterval2 = setInterval(() => {
        val2 < 1000 && setVal2((prevCount) => prevCount + 100);
      }, 100);

      if (val3 == 0) {
        setVal3((prevCount) => prevCount + 1);
      } else {
        timeInterval3 = setInterval(() => {
          val3 < 4 && setVal3((prevCount) => prevCount + 1);
        }, 150);
      }

      const timeInterval4 = setInterval(() => {
        val4 < 100 && setVal4((prevCount) => prevCount + 10);
      }, 100);

      return () => {
        clearInterval(timeInterval);
        clearInterval(timeInterval2);
        clearInterval(timeInterval3);
        clearInterval(timeInterval4);
      };
    }
  }, [val1, val2, val3, val4, isVisible]);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Select elements
    const element = document.querySelector("#screen3");

    if (!element) {
      console.warn("Required elements not found");
      return;
    }

    // Create the scroll trigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      
      start: "top center",
      end: "bottom center",
      // markers:true,
      onEnter: () => {
        gsap.to(window, {
          scrollTo: {
            y: element.offsetTop,
            offsetY: 0,
          },
          duration: 1,
        });
        setTimeout(() => {
          setIsVisible(true);
        }, 1000);
      },
      onLeave: () => {
        // setIsVisible(true);
      },
    });

    // Cleanup function
    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div
      id="screen3"
      className="w-full h-screen flex items-center justify-center font-['Prompt'] z-10"
    >
      <div className="flex flex-col w-1/4 text-black flex items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          +{val1}
        </span>
        <span className="pt-2  text-base text-center xl:text-2xl">
          years experience
        </span>
      </div>
      <div className="flex flex-col w-1/4 text-black flex items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          +{val2}
        </span>
        <span className="pt-2 text-base text-center xl:text-2xl">projects</span>
      </div>

      <div className="flex text-2xl xl:text-2xl w-1/4 text-black flex flex-col items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          {val3}
        </span>
        <span className="pt-2 text-base text-center xl:text-2xl">
          continents
        </span>
      </div>
      <div className="flex flex-col w-1/4 text-black flex items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          {val4} %
        </span>
        <span className="pt-2  text-base text-center xl:text-2xl">
          satisfied customers
        </span>
      </div>
    </div>
  );
}





