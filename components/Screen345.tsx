"use client";

import React, { useEffect, useRef, useState } from "react";

// import dynamic from "next/dynamic";
import dynamic from "next/dynamic";
const gsap = dynamic(() => import("gsap"), { ssr: false });
const ScrollTrigger = dynamic(
  () => import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
  { ssr: false }
);
const ScrollToPlugin = dynamic(
  () => import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
  { ssr: false }
);
import {
  createScreen3Triggers,
  createScreen4Triggers,
  createScreen5Triggers,
} from "@/components/ScrollTriggers/ScreenTriggers";

import { getDistanceFromTop } from "@/utils/utils";

import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(useGSAP);

export const Screen3 = React.memo(() => {
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const [val3, setVal3] = useState(0);
  const [val4, setVal4] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});

  useGSAP(() => {
    Promise.all([
      import("gsap").then((mod) => mod.default),
      import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
      import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
    ]).then(([gsap, ScrollTrigger, ScrollToPlugin]) => {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapModules.current = { gsap, ScrollTrigger, ScrollToPlugin };
      setIsGsapReady(true);
    });
  }, []);

  useEffect(() => {
    if (isVisible) {
      if (!isGsapReady) return;

      const { gsap, ScrollTrigger } = gsapModules.current;
      const element = document.querySelector("#screen3");
      // const element2 = document.querySelector("#screen5");

      if (!element) {
        console.warn("Required elements not found");
        return;
      }
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
  }, [val1, val2, val3, val4, isVisible, isGsapReady]);

  useGSAP(() => {
    if (!isGsapReady) return;

    const { gsap, ScrollTrigger } = gsapModules.current;
    const triggers = createScreen3Triggers({
      gsap,
      ScrollTrigger,
      setIsVisible,
    });

    return () => {
      triggers.scrollTrigger.kill();
      triggers.mainTriggerUp.kill();
    };
  }, [isGsapReady]);

  return (
    <div
      id="screen3"
      // className="w-full h-screen bg-orange  text-white flex items-center justify-center font-['Prompt'] z-20"
      className="relative w-full h-screen text-white flex justify-center z-0"
    >
      {/* <div className="flex flex-col w-1/4 flex items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          +{val1}
        </span>
        <span className="pt-2  text-base text-center xl:text-2xl">
          years experience
        </span>
      </div>
      <div className="flex flex-col w-1/4  flex items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          +{val2}
        </span>
        <span className="pt-2 text-base text-center xl:text-2xl">projects</span>
      </div>

      <div className="flex text-2xl xl:text-2xl w-1/4  flex flex-col items-center justify-center">
        <span className="text-4xl text-center font-bold xl:text-6xl">
          {val3}
        </span>
        <span className="pt-2 text-base text-center xl:text-2xl">
          continents
        </span>
      </div> */}
      <div className="flex w-1/3 sm:w-1/4">
        <div className="relative w-full h-full">
        <div className="absolute top-[40%] w-full flex items-center justify-center flex-col my-auto">      <span className="text-4xl text-center font-bold xl:text-6xl">
              +{val1}
            </span>
            <span className="pt-2  text-base text-center xl:text-2xl">
              years experience
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-1/3 sm:w-1/4">
        <div className="relative w-full h-full">
          <div className="absolute top-[40%] w-full flex items-center justify-center flex-col my-auto">
            <span className="text-4xl text-center font-bold xl:text-6xl">
              +{val2}
            </span>
            <span className="pt-2 text-base text-center xl:text-2xl">
              projects
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-1/3 sm:w-1/4">
        <div className="relative w-full h-full">
          <div className="absolute top-[40%] w-full flex items-center justify-center flex-col my-auto">
            <span className="text-4xl text-center font-bold xl:text-6xl">
              {val3}
            </span>
            <span className="pt-2 text-base text-center xl:text-2xl">
              continents
            </span>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex w-1/4">
        <div className="relative w-full h-full">
          <div className="absolute top-[40%] w-full flex items-center justify-center flex-col my-auto">
            <span className="text-4xl text-center font-bold xl:text-6xl">
              {val4} %
            </span>
            <span className="pt-2  text-base text-center xl:text-2xl">
              satisfied customers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export const Screen4 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});

  useGSAP(() => {
    Promise.all([
      import("gsap").then((mod) => mod.default),
      import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
      import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
    ]).then(([gsap, ScrollTrigger, ScrollToPlugin]) => {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapModules.current = { gsap, ScrollTrigger, ScrollToPlugin };
      setIsGsapReady(true);
    });
  }, []);

  useGSAP(() => {
    if (!isGsapReady) return;

    const { gsap, ScrollTrigger } = gsapModules.current;
    const triggers = createScreen4Triggers({
      gsap,
      ScrollTrigger,
    });

    return () => {
      triggers.mainTriggerDown.kill();
    };
  }, [isGsapReady]);

  return (
    <div
      id="screen4"
      className="relative w-full h-screen text-white items-center justify-end z-0"
    >
      <div className="text-md text-white text-center left-0 w-full px-8 lg:text-left lg:w-1/3 lg:text-xl absolute top-1/3 lg:left-30 text-black font-['Prompt'] pt-3 z-0">
        <span className="italic"> For over a decade </span>B one consulting has
        been a driving force in the business consulting leaving a lasting mark
        across <span>four continents.</span>
        From our roots in <span className="italic"> Paris </span> to our
        expansion to <span className="italic"> Dubai and Bali </span>
        our journey has been defined by a{" "}
        <span className="italic"> legacy of excellence </span>. We've
        orchestrated strategic transformations and delivered impactful solutions
        globally, combining a{" "}
        <span className="italic">
          worlwide perspective with local expertise.{" "}
        </span>
        With a footprint on four continents, we continue to lead businesses
        towards new heights of{" "}
        <span className="italic">innovation and growth.</span>
      </div>
    </div>
  );
};

export const Screen5 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});

  useGSAP(() => {
    Promise.all([
      import("gsap").then((mod) => mod.default),
      import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
      import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
    ]).then(([gsap, ScrollTrigger, ScrollToPlugin]) => {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapModules.current = { gsap, ScrollTrigger, ScrollToPlugin };
      setIsGsapReady(true);
    });
  }, []);

  useGSAP(() => {
    if (!isGsapReady) return;

    const { gsap, ScrollTrigger } = gsapModules.current;
    const triggers = createScreen5Triggers({
      gsap,
      ScrollTrigger,
    });

    return () => {
      triggers.mainTriggerDown.kill();
      triggers.mainTriggerUp.kill();
    };
  }, [isGsapReady]);

  return (
    <div
      id="screen5"
      className="relative w-full h-screen items-center justify-end text-white font-['Prompt']"
    >
      <div className="px-8 text-md absolute lg:text-right right-0 text-center w-full lg:w-1/3 top-1/3 lg:right-30 text-white font-['Prompt'] lg:text-xl pt-3">
        "At B One Consulting,{" "}
        <span className="italic">
          {" "}
          client-centricity is our guidind principle{" "}
        </span>
        . We prioritize{" "}
        <span className="italic">
          {" "}
          transparency, open communication, and close collaboration{" "}
        </span>
        , placing our clients at the center of every decision. Our commitment to
        proximity ensures that we're always where you need us, providing the{" "}
        <span className="italic"> support </span> and{" "}
        <span className="italic"> expertise </span> you can rely on." <br />
        Adnane Thari <br /> Founder
      </div>
    </div>
  );
};
