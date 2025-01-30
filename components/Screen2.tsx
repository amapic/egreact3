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

const Screen2 = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLDivElement[]>([]);
  const bottomBarRef = useRef<HTMLDivElement>(null);

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

    // Timeline pour les transitions entre sections
    const tl = gsap.timeline();

    // Pin the entire section
    const mainTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      start: "top top",
      end: "+=50%",
      ease: "power2.inOut",
      scrub: 1,
      animation: tl,
      // markers: true,
      // onEnter: () => {
      //   // const element = document.getElementById("screen2");
      //   // if (!element) return;
      //   // const elementHeight = element.offsetHeight;
      //   // gsap.to(window, {
      //   //   duration: 1,
      //   //   scrollTo: {
      //   //     y: element.offsetTop + (elementHeight * 2), // 400% = 4 * height
      //   //     ease: "power2.inOut"
      //   //   }
      //   // });
      // },
    });

    const mainTrigger2 = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      ease: "power2.inOut",
      animation: tl,

      onEnter: () => {
        const element = document.getElementById("screen2");
        if (!element) return;

        const tl2 = gsap.timeline();

        // Désactive le scroll
        document.body.style.overflow = "hidden";

        const elementHeight = element.offsetHeight;

        //animation fenetre
        tl2.to(window, {
          duration: 1,
          scrollTo: {
            y: element.offsetTop + elementHeight,
            ease: "power2.inOut",
          },
          onComplete: () => {
            // Réactive le scroll une fois l'animation terminée
            // document.body.style.overflow = "";
          },
        });

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
              document.body.style.overflow = "";
            }
            
          },
          ">"
        );

        
      },
      onLeave: () => {
        document.body.style.overflow = "hidden";
        const tl3 = gsap.timeline();
        const element = document.getElementById("screen3");
        if (!element) return;
        const elementHeight = element.offsetHeight;
        tl3.to(window, {
          duration: 1,
          scrollTo: {
            y: element.offsetTop,
            ease: "power2.inOut",
          },
          onComplete: () => {
            // Réactive le scroll une fois l'animation terminée
            document.body.style.overflow = "";
          },
        });
      },
      // markers: true,
    });

    // Animation des numéros
    

    // Animation de la barre du bas

    // Ajouter les animations à la timeline
    // sectionsRef.current.forEach((section, index) => {
    //   if (index < sectionsRef.current.length - 1) {
    //     tl.to(section, {
    //       yPercent: -100,
    //       ease: "none"
    //     }, index);
    //   }
    // });

    return () => {
      mainTrigger.kill();
      mainTrigger2.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isGsapReady]);

  return (
    <div
      ref={containerRef}
      id="screen2"
      className="min-h-screen bg-[rgb(16,16,16)] text-white overflow-hidden"
    >
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
              className="gradient-text-mask text-[3rem] sm:text-[3rem] md:text-[8rem] text-[12rem] mb-8"
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="gradient-text-mask md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden">
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
  );
};

export default Screen2;
