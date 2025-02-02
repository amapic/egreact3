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

import { getDistanceFromTop } from "@/utils/utils";

const Screen2 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLDivElement[]>([]);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  // Ajout d'une ref pour suivre le dernier déclenchement
  const lastTriggerTime = useRef<number>(0);

  const AnimationClipCreator = useRef(false);
  // const [isRippleActive, setIsRippleActive] = useState(false);

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

  function getDistanceFromTop(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return rect.top + scrollTop;
}

  useEffect(() => {
    if (!isGsapReady || !containerRef.current) return;

    const { gsap, ScrollTrigger } = gsapModules.current;

    // Timeline pour les transitions entre sections
    const tl = gsap.timeline();

    const element = document.querySelector("#screen2");
    const elementAfter = document.querySelector("#screen3");
    // const elementBefore = document.querySelector("#screen1");

    // Pin the entire section
    // const mainTrigger = ScrollTrigger.create({
    //   trigger: containerRef.current,
    //   pin: true,
    //   start: "top top",
    //   end: "+=50%",
    //   ease: "power2.inOut",
    //   scrub: 1,
    //   animation: tl
 
    // });

    const mainTriggerAnimLocal = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      ease: "power2.inOut",
      animation: tl,
      // markers: true,
      onEnter: () => {
        const element = document.getElementById("screen2");
        if (!element) return;

        const tl2 = gsap.timeline();

        

        numbersRef.current.forEach((number, index) => {
          tl2.fromTo(number,
            {
              yPercent: -100,
              opacity: 0
            },
            {
              yPercent: 0,
              opacity: 1,
              

            },
            "<"
          );
        });

        tl2.fromTo(
          bottomBarRef.current,
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            onComplete: () => {
              // alert("ok")
              document.body.style.overflow = "";
              setTimeout(() => {
                AnimationClipCreator.current=true
              }, 1000);
            }
            

          },
          ">",
        );

        

      },
  
    });

    const mainTriggerUp = ScrollTrigger.create({
      trigger: element,
      start: "top 5%",
      end: "top 5%",
      // markers: true,
      onEnterBack: () => {
        document.body.style.overflow = "hidden";
        gsap.to(window, {
          scrollTo: {
            y: 0,
            ease: "power2.inOut",
          },
          duration: 1,
          onComplete: () => {
            document.body.style.overflow = "";
          },
        });
      },
    });


    const mainTriggerDown = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "bottom 95%",
      end: "bottom 95%",
      // markers: true,
      onEnter: () => {
        // Vérifier si suffisamment de temps s'est écoulé depuis le dernier déclenchement
        document.body.style.overflow = "hidden";
        gsap.to(window, {
          scrollTo: {
            y: getDistanceFromTop(elementAfter as HTMLElement),
            ease: "power2.inOut",
          },
          duration: 1,
          onComplete: () => {
            document.body.style.overflow = "";
          },
        });
      }
    });

    const mainTriggerOwnCenter = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 95%",
      end: "bottom 95%",
      // markers: true,
      onEnter: () => {
        // Mettre à jour le timestamp du dernier déclenchement
        lastTriggerTime.current = Date.now();
        
        gsap.to(window, {
          scrollTo: {
            y: getDistanceFromTop(element as HTMLElement),
            ease: "power2.inOut",
          },
          duration: 1,
        });
      }
    });
       

    return () => {
      // mainTrigger.kill();
      mainTriggerAnimLocal.kill();
      mainTriggerDown.kill();
      mainTriggerUp.kill();
      mainTriggerOwnCenter.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isGsapReady]);

  return (
    <div
      ref={containerRef}
      id="screen2"
      className="relative min-h-screen  text-white overflow-hidden z-40"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[rgb(16,16,16)]">
      <h1 className="ml-8 text-3xl xl:text-5xl mt-32 mb-24 bg-gradient-to-b from-gray-900 to-white bg-clip-text text-transparent">
        360° SERVICES
      </h1>

      <div className="grid grid-cols-4 gap-0 max-w-screen-lg mx-auto">
        {[
          "AUDIT & IT CONSULTING",
          "DIGITAL SOLUTION",
          "DATA SOLUTION",
          "MARKETING & BRANDING",
        ].map((service, index) => (
          <div
            key={index}
            ref={(el) => el && (sectionsRef.current[index] = el)}
            className="service-item border-l-3 border-white pl-6 pr-4"
          >
            <div
              ref={(el) => el && (numbersRef.current[index] = el)}
              className={`${AnimationClipCreator.current ? "gradient-text-mask" : ""} text-[3rem] sm:text-[3rem] md:text-[8rem] text-[12rem] mb-8`}
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className={` ${AnimationClipCreator.current ? "gradient-text-mask" : ""} md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden`}>
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

      <div className="pr-8 mx-auto max-w-screen-lg">
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
