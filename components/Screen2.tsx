"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Importation dynamique de GSAP
const gsap = dynamic(() => import("gsap"), { ssr: false });
const ScrollTrigger = dynamic(
  () => import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
  { ssr: false }
);
const ScrollToPlugin = dynamic(
  () => import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
  { ssr: false }
);

import { createScreen2Triggers } from "./ScrollTriggers/ScreenTriggers";

const Screen2 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLDivElement[]>([]);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const lastTriggerTime = useRef<number>(0);
  const TRIGGER_COOLDOWN = 1000; // 1 seconde en millisecondes

  const AnimationClipCreator = useRef(false);
  // const [isRippleActive, setIsRippleActive] = useState(false);

  const canTrigger = () => {
    const now = Date.now();
    if (now - lastTriggerTime.current >= TRIGGER_COOLDOWN) {
      lastTriggerTime.current = now;
      return true;
    }
    return false;
  };

  useEffect(() => {
    Promise.all([
      import("gsap"),
      import("gsap/dist/ScrollTrigger"),
      import("gsap/ScrollToPlugin"),
    ]).then(([gsapModule, scrollTriggerModule, scrollToModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      const ScrollToPlugin = scrollToModule.ScrollToPlugin;

      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapModules.current = { gsap, ScrollTrigger };
      setIsGsapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isGsapReady || !containerRef.current) return;

    const { gsap, ScrollTrigger } = gsapModules.current;
    const tl = gsap.timeline();

    const triggers = createScreen2Triggers({
      containerRef,
      gsap,
      ScrollTrigger,
      timeline: tl,
      numbersRef,
      bottomBarRef,
      AnimationClipCreator,
      // canTrigger,
    });

    return () => {
      triggers.mainTriggerAnimLocal.kill();
      triggers.mainTriggerUp.kill();
      triggers.mainTriggerDown.kill();
      triggers.mainTriggerOwnCenter.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isGsapReady]);

  return (
    <div
      ref={containerRef}
      id="screen2"
      className="relative min-h-screen w-full text-white overflow-hidden z-10"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[rgb(16,16,16)]">
        <h1 className="ml-8 text-3xl xl:text-5xl mt-16 sm:mt-40 sm:mb-24 mb-6 bg-gradient-to-b from-gray-600 to-white bg-clip-text text-transparent">
          360° SERVICES
        </h1>

        <div className="grid sm:grid-cols-4 grid-cols-2 grid-rows-2 gap-y-4 sm:gap-0 max-w-screen-lg mx-auto">
          {[
            "AUDIT & IT CONSULTING",
            "DIGITAL SOLUTION",
            "DATA SOLUTION",
            "MARKETING & BRANDING",
          ].map((service, index) => (
            <div
              key={index}
              ref={(el) => el && (sectionsRef.current[index] = el)}
              className="service-item border-l-3 border-white sm:pl-6 sm:pr-4"
            >
              <div
                ref={(el) => el && (numbersRef.current[index] = el)}
                className={`${
                  AnimationClipCreator.current ? "gradient-text-mask" : ""
                } text-center text-[5rem] sm:text-[3rem] md:text-[8rem] text-[12rem] sm:mb-8 mb-4`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div
                className={` ${
                  AnimationClipCreator.current ? "gradient-text-mask" : ""
                } text-center sm:text-left md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden`}
              >
                {service.split(" & ").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-16 pr-8 w-full px-[var(--margeBodySection)] sm:px-[var(--margeBodySectionsm)]">
          <div
            ref={bottomBarRef}
            className="bg-black border-6 mt-20 flex justify-between items-center border border-white rounded-full px-8 py-4"
          >
            <div className="md:text-md xl:text-xl">OUR SERVICES</div>
            <div className="md:text-md xl:text-xl">OPEN</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;
