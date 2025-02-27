"use client";

import React, { useEffect, useRef, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // ou autre breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default function Interstitial() {
  const isMobile = useIsMobile();
  // const [isGsapReady, setIsGsapReady] = useState(false);
  // const gsapModules = useRef<any>({});

  // const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   Promise.all([
  //     import("gsap").then((mod) => mod.default),
  //     import("gsap/dist/ScrollTrigger").then((mod) => mod.ScrollTrigger),
  //     import("gsap/ScrollToPlugin").then((mod) => mod.ScrollToPlugin),
  //   ]).then(([gsap, ScrollTrigger, ScrollToPlugin]) => {
  //     gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  //     gsapModules.current = { gsap, ScrollTrigger, ScrollToPlugin };
  //     setIsGsapReady(true);
  //   });
  // }, []);

  return (
    <>
      {!isMobile ? (
        <div
          id="interstitial"
          // ref={ref}
          className="w-full h-full"
          style={{
            height: "300vh",
          }}
        ></div>
      ) : null}
    </>
  );
}
