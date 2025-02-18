"use client";

import React, { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { getDistanceFromTop } from "@/utils/utils";
const gsap = dynamic(() => import("gsap"), { ssr: false });
const ScrollTrigger = dynamic(
  () => import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
  { ssr: false }
);
const ScrollToPlugin = dynamic(
  () => import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
  { ssr: false }
);

import { useGSAP } from '@gsap/react';

// gsap.registerPlugin(useGSAP);

class DomUtils {
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  static keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  static preventDefault(e: any) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  static preventDefaultForScrollKeys(e: any) {
    if (DomUtils.keys[e.keyCode]) {
      DomUtils.preventDefault(e);
      return false;
    }
  }

  static disableScroll() {
    document.addEventListener('wheel', DomUtils.preventDefault, {
      passive: false,
    }); // Disable scrolling in Chrome
    document.addEventListener('keydown', DomUtils.preventDefaultForScrollKeys, {
      passive: false,
    });
  }

  static enableScroll() {
    document.removeEventListener('wheel', DomUtils.preventDefault, {
      passive: false,
    }); // Enable scrolling in Chrome
    document.removeEventListener(
      'keydown',
      DomUtils.preventDefaultForScrollKeys,
      {
        passive: false,
      }
    ); // Enable scrolling in Chrome
  }
}



const RippleShader = dynamic(() => import("@/components/RippleShader"), {
  ssr: false,
});

interface Screen6Props {
  setAnimateCanvas1: (value: boolean) => void;
}

export const Screen6ClientsEtPartners = ({ setAnimateCanvas1 }: Screen6Props) => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapModules = useRef<any>({});
  const [animateCanvas2, setAnimateCanvas2] = useState(false);

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
    const element = document.querySelector("#screen6");
    const elementAfter = document.querySelector("#screen6");
    const elementBefore = document.querySelector("#screen5");
    // alert("screen6")
    // Trigger pour détruire Scene
    const triggerAnimateCanvas2 = ScrollTrigger.create({
      trigger: document.querySelector("#screen6"),
      start: "top 100%",
      end: "top 100%",
      // markers: true,
      onEnter: () => {
        setAnimateCanvas2(true);
        // alert("animateCanvas2")
      },
      onLeaveBack: () => {
        
        // alert("stop animateCanvas2 true")
      }
    });

    const triggerAnimateCanvas1 = ScrollTrigger.create({
      trigger: document.querySelector("#screen6"),
      start: "bottom 100%",
      end: "bottom 100%",
      // markers: true,
      onEnter: () => {
        setAnimateCanvas1(false);
        
      },
      onLeaveBack: () => {
        setAnimateCanvas1(true);
        setAnimateCanvas2(false);
        
      }
    });
    

    const mainTriggerDown = ScrollTrigger.create({
      trigger: element,
      start: "bottom 95%",
      end: "bottom 95%",
      onEnter: () => {
        //document.body.style.overflow = "hidden";
        DomUtils.disableScroll()
        gsap.to(window, {
          scrollTo: {
            y: getDistanceFromTop(elementAfter as HTMLElement),
            ease: "power2.inOut",
          },
          duration: 1,
          onComplete: () => {
            document.body.style.overflow = "";
            DomUtils.enableScroll()
          },
        });
      },
    });

    const mainTriggerUp = ScrollTrigger.create({
      trigger: element,
      start: "top 5%",
      end: "top 5%",
      onEnterBack: () => {
        //document.body.style.overflow = "hidden";
        DomUtils.disableScroll()
        gsap.to(window, {
          scrollTo: {
            y: getDistanceFromTop(elementBefore as HTMLElement),
            ease: "power2.inOut",
          },
          duration: 1,
          onComplete: () => {
            // document.body.style.overflow = "";
            DomUtils.enableScroll()
          },
        });
      },
    });

    return () => {
      mainTriggerDown.kill();
      mainTriggerUp.kill();
      triggerAnimateCanvas1.kill();
      triggerAnimateCanvas2.kill();
    };
  }, [isGsapReady]);

  //besoin d'une anim pour passer au dessus de la scene

  return (
    <div
      ref={containerRef}
      id="screen6"
      className="relative min-h-screen bg-[rgb(16,16,16)] text-white overflow-hidden z-0"
    >
      <RippleShader animate={animateCanvas2} />
      <div
        className="absolute px-48 top-1/3 mt-32 h-1/3 grid grid-cols-8 grid-rows-3 w-full mx-auto 
      inline-grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-y-2 sm:gap-y-5 md:gap-y-10 gap-x-5 xl:gap-x-8 2xl:gap-x-10
      place-items-center"
      >
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/airfrance.png"
            alt="Air France"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/renault.png"
            alt="Renault"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/total.png"
            alt="Total Energies"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/as24.png"
            alt="AS 24"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/lcl.png"
            alt="LCL"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/mastercard.png"
            alt="Mastercard"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/kesato.webp"
            alt="Kesato"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/imani.png"
            alt="IMANI"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/aldiwan.png"
            alt="Aldiwan"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/cafe.jpeg"
            alt="Cafe Organic"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/ts.svg"
            alt="touch et sell"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/celio.png"
            alt="celio"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/comptoir.jpeg"
            alt="Comptoir"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/yacht.png"
            alt="Yacht"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/dubai.png"
            alt="Dubai"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/bsi.png"
            alt="BSI"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/neonautica.webp"
            alt="Neonautica"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/HR.png"
            alt="HR"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/ericbompard.png"
            alt="Eric Bompard"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/princessetam.png"
            alt="Princess Etam"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/facebook.png"
            alt="Facebook"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/gsuite.png"
            alt="GSuite"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/googleana.png"
            alt="Google Analytics"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center h-full max-h-12 p-1">
          <img
            src="/miro.png"
            alt="Miro"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

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
