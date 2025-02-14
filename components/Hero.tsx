"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const Hero = React.memo(() => {
  const textRef = useRef(null);
  const textRef2 = useRef(null);
  // const isAnimationDone = useRef(false); // Pour tracker si l'animation a déjà été faite
  // console.log("Hero useEffect is triggered, isAnimationDone:", isAnimationDone.current);
  useEffect(() => {
    
    // if (isAnimationDone.current) return;
    
    // Stocker les références des animations
    const anim1 = gsap.fromTo(
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

    const anim2 = gsap.fromTo(
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

    // isAnimationDone.current = true; // Marquer l'animation comme faite

    // Cleanup function
    return () => {
      anim1.kill();
      anim2.kill();
    };
  }, []); // Dépendances vides = exécution uniquement au montage

  return (
    <>
      <div
        id="hero"
        className="relative h-screen w-full flex items-center justify-center z-10"
      >
        <div className="grid grid-cols-2 grid-rows-2  pb-16">
          <div
            ref={textRef}
            className="title2 font-thin relative text-white h-titre text-7xl font-['Prompt'] text-right"
          >
            WE CREATE
          </div>
          <div></div>
          <div></div>
          <div
            ref={textRef2}
            className="title2 relative text-white h-titre text-7xl font-['Prompt'] text-left"
          >
            YOU CONQUER!
          </div>
        </div>
        <div className="z-10 absolute bottom-8 left-8 text-white text-[16px] font-['Prompt']">
          Scroll for more{" "}
          <span className="text-white text-xl font-['Prompt']">↓</span>
        </div>
      </div>
    </>
  );
});
