"use client";

import React, { useEffect, useRef, useState } from "react";

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

const RippleShader = dynamic(() => import("@/components/RippleShader"), { ssr: false });

export const Screen6ClientsEtPartners = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapModules = useRef<any>({});

  useEffect(() => {
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

  //besoin d'une anim pour passer au dessus de la scene

  return (
    <div
      ref={containerRef}
      id="screen6"
      className="relative min-h-screen bg-[rgb(16,16,16)] text-white overflow-hidden z-0"
    >
      <RippleShader />
      <div className="absolute px-48 top-1/3 mt-32 h-1/4 grid grid-cols-8 grid-rows-3 w-full mx-auto 
      inline-grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8  gap-y-2 sm:gap-y-5 md:gap-y-10 gap-x-5 xl:gap-x-8 2xl:gap-x-10
      ">
        <div className="flex items-center justify-center h-full">
          <img 
            src="/airfrance.png" 
            alt="Air France" 
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full"><img src="/renault.png" alt="Renault" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/total.png" alt="Total Energies" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/as24.png" alt="AS 24" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/lcl.png" alt="LCL" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/mastercard.png" alt="Mastercard" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/kesato.webp" alt="Kesato" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/imani.png" alt="IMANI" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/aldiwan.png" alt="Aldiwan" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/cafe.jpeg" alt="Cafe Organic" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/ts.svg" alt="touch et sell" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/celio.png" alt="celio" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/comptoir.jpeg" alt="Comptoir" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/yacht.png" alt="Yacht" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/dubai.png" alt="Dubai" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/bsi.png" alt="BSI" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/neonautica.webp" alt="Neonautica" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/HR.png" alt="HR" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/ericbompard.png" alt="Eric Bompard" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/princessetam.png" alt="Princess Etam" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/facebook.png" alt="Facebook" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/gsuite.png" alt="GSuite" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/googleana.png" alt="Google Analytics" className="h-full w-auto object-contain"/></div>
        <div className="flex items-center justify-center h-full"><img src="/miro.png" alt="Miro" className="h-full w-auto object-contain"/></div>
      </div>
      {/* <div>03</div> */}

      <h1 className="ml-8 text-3xl xl:text-5xl mt-32 mb-24 bg-gradient-to-b from-gray-900 to-white bg-clip-text text-transparent">
        CLIENTS & PARTNERS
      </h1>

      {/* <div className="absolute w-full h-50 mx-auto p-10">
        <div className="w-full h-full bg-white">AAA</div>
      </div>  */}
    </div>
  );
};

export default Screen6ClientsEtPartners;
