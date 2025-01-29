'use client'

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Hero = () => {
  const textRef = useRef(null);
  const textRef2 = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
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

    gsap.fromTo(
      textRef2.current,
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
  }, []); // Le tableau vide signifie que l'animation ne s'exécute qu'une fois au montage

  return (
    <>
      <div className="relative h-screen w-full flex items-center justify-center">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 pb-16">
          <div
            ref={textRef}
            className="text-white text-7xl font-['Prompt'] text-right"
          >
            WE CREATE
          </div>
          <div></div>
          <div></div>
          <div
            ref={textRef2}
            className="text-white text-7xl font-['Prompt'] text-left"
          >
            YOU CONQUER!
          </div>
        </div>
        <div className="z-10 absolute bottom-8 left-8 text-white text-[16px] font-['Prompt']">
          Scroll for more <span className="text-white text-xl font-['Prompt']">↓</span>
        </div>
      </div>
      
    </>
  );
};

export default Hero;
