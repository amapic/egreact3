'use client'

import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// import ScrollToPlugin from "gsap/ScrollToPlugin";

// import dynamic from "next/dynamic";
import dynamic from "next/dynamic";
const gsap = dynamic(() => import('gsap'), { ssr: false });
const ScrollTrigger = dynamic(() => 
  import('gsap/dist/ScrollTrigger').then(mod => mod.ScrollTrigger), 
  { ssr: false }
);
const ScrollToPlugin = dynamic(() => 
  import('gsap/ScrollToPlugin').then(mod => mod.ScrollToPlugin), 
  { ssr: false }
);


export const Screen4 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});

  useEffect(() => {
    Promise.all([
      import('gsap').then(mod => mod.default),
      import('gsap/dist/ScrollTrigger').then(mod => mod.ScrollTrigger),
      import('gsap/ScrollToPlugin').then(mod => mod.ScrollToPlugin)
    ]).then(([gsap, ScrollTrigger, ScrollToPlugin]) => {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapModules.current = { gsap, ScrollTrigger, ScrollToPlugin };
      setIsGsapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isGsapReady) return;

    const { gsap, ScrollTrigger } = gsapModules.current;
    const element = document.querySelector("#screen4");

    if (!element) {
      console.warn("Required elements not found");
      return;
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to(window, {
          scrollTo: {
            y: element.offsetTop,
            offsetY: 0,
          },
          duration: 1,
        });
      },
    });

    return () => {
      scrollTrigger.kill();
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
}

export const Screen5 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});

  useEffect(() => {
    Promise.all([
      import('gsap').then(mod => mod.default),
      import('gsap/dist/ScrollTrigger').then(mod => mod.ScrollTrigger),
      import('gsap/ScrollToPlugin').then(mod => mod.ScrollToPlugin)
    ]).then(([gsap, ScrollTrigger, ScrollToPlugin]) => {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapModules.current = { gsap, ScrollTrigger, ScrollToPlugin };
      setIsGsapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isGsapReady) return;

    const { gsap, ScrollTrigger } = gsapModules.current;
    const element = document.querySelector("#screen5");

    if (!element) {
      console.warn("Required elements not found");
      return;
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to(window, {
          scrollTo: {
            y: element.offsetTop,
            offsetY: 0,
          },
          duration: 1,
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [isGsapReady]);

  return (
    <div
      id="screen5"
      className="relative w-full  h-screen  items-center justify-end text-white font-['Prompt']"
    >
      <div className="absolute w-1/3 top-1/3 right-30 text-white font-['Prompt'] text-xl pt-3">
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
}





