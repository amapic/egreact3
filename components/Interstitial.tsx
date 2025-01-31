"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Interstitial({ changeParam }: { changeParam: (param: number) => void }) {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});

  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (ref.current) {
      // changeParam(
      //   (window.scrollY - ref.current?.offsetTop) / (3 * window.innerHeight)
      // );
    }
  }, [isGsapReady]);

  return (
    <div
      id="interstitial"
      ref={ref}
      className="w-full h-full"
      style={{
        height: "300vh",
      }}
    ></div>
  );
}
