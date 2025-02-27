"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DomUtils } from "@/utils/utils";

gsap.registerPlugin(useGSAP);

export const Hero = React.memo(() => {
  const textRefMid1 = useRef(null);
  const textRefMid2 = useRef(null);
  const textRefgauche1 = useRef(null);
  const textRefgauche2 = useRef(null);
  const textRefgauche3 = useRef(null);
  const textRefgauche4 = useRef(null);
  // const isAnimationDone = useRef(false); // Pour tracker si l'animation a déjà été faite
  // console.log("Hero useEffect is triggered, isAnimationDone:", isAnimationDone.current);
  useGSAP(() => {
    // if (isAnimationDone.current) return;

    // Stocker les références des animations
    const anim1Mid1 = gsap.fromTo(
      textRefMid1.current,
      {
        x: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    const anim2Mid2 = gsap.fromTo(
      textRefMid2.current,
      {
        x: +300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    const anim3gauche1 = gsap.fromTo(
      textRefgauche1.current,
      {
        x: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    const anim3gauche2 = gsap.fromTo(
      textRefgauche2.current,
      {
        x: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    const anim3gauche3 = gsap.fromTo(
      textRefgauche3.current,
      {
        x: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    const anim3gauche4 = gsap.fromTo(
      textRefgauche4.current,
      {
        x: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    // isAnimationDone.current = true; // Marquer l'animation comme faite

    // Cleanup function
    return () => {
      anim1Mid1.kill();
      anim2Mid2.kill();
      anim3gauche1.kill();
      anim3gauche2.kill();
      anim3gauche3.kill();
      anim3gauche4.kill();
    };
  }, []); // Dépendances vides = exécution uniquement au montage

  return (
    <>
      <div
        id="hero"
        className="h-screen w-full"
      >
        <div
          id="hero"
          className="relative w-full h-screen flex items-center justify-center z-10"
        >
          <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-[4.4fr_5.6fr] md:grid-rows-2  pb-16 w-full px-4 md:px-8 text-black">
            <div
              ref={textRefgauche1}
              className="block md:hidden title2  sm:font-thin relative text-white text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left md:text-right whitespace-nowrap"
            >
              WE
            </div>
            <div
              ref={textRefgauche2}
              className="block md:hidden title2 sm:font-thin relative text-white h-titre text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left whitespace-nowrap"
            >
              CREATE
            </div>
            <div
              ref={textRefgauche3}
              className="block md:hidden title2 sm:font-thin relative text-white h-titre text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left whitespace-nowrap"
            >
              YOU
            </div>
            <div
              ref={textRefgauche4}
              className="block md:hidden title2 sm:font-thin relative text-white h-titre text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left whitespace-nowrap"
            >
              CONQUER!
            </div>

            <div
              ref={textRefMid1}
              className=" hidden md:block title2 sm:font-thin relative text-white text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-right "
            >
              WE CREATE
            </div>
            <div className=" hidden md:block title2 sm:font-thin relative text-white h-titre text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left"></div>
            <div className=" hidden md:block title2 sm:font-thin relative text-white h-titre text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left"></div>
            <div
              ref={textRefMid2}
              className=" hidden md:block title2 sm:font-thin relative text-white h-titre text-5xl lg:text-6xl xl:text-7xl font-['Prompt'] text-left"
            >
              YOU CONQUER!
            </div>
          </div>

          <div
            className="z-10 absolute top-[80%]  sm:bottom-8 left-8 text-white text-[16px] font-['Prompt']"
            onClick={() => {
              const element = document.querySelector("#screen2");
              element?.scrollIntoView({ behavior: "smooth" });
              // setTimeout(() => {
              // console.log("enableScroll 2");
              // DomUtils.enableScroll()
              // }, 2000)
            }}
          >
            Scroll for more{" "}
            <span className="text-white text-xl font-['Prompt']">↓</span>
          </div>
        </div>
      </div>
    </>
  );
});
