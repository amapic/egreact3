'use client'

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GsapObserverDemo = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});
  const sectionsRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(-1);
  const animating = useRef(false);

  useEffect(() => {
    Promise.all([
      import('gsap'),
      import('gsap/dist/ScrollTrigger'),
      import('gsap/dist/Observer'),
    ]).then(([gsapModule, scrollTriggerModule, observerModule]) => {
      const gsap = gsapModule.default;
      const Observer = observerModule.Observer;
      
      gsap.registerPlugin(Observer);
      
      gsapModules.current = { gsap, Observer };
      setIsGsapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isGsapReady || !sectionsRef.current) return;

    const { gsap, Observer } = gsapModules.current;

    const sections = sectionsRef.current.querySelectorAll('.section');
    const images = sectionsRef.current.querySelectorAll('.bg');
    const headings = gsap.utils.toArray('.section-heading');
    const outerWrappers = gsap.utils.toArray('.outer');
    const innerWrappers = gsap.utils.toArray('.inner');

    gsap.set(sections, { autoAlpha: 0 });
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    const wrap = gsap.utils.wrap(0, sections.length);

    function gotoSection(index: number, direction: number) {
      index = wrap(index);
      animating.current = true;
      
      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => animating.current = false
      });

      if (currentIndex.current >= 0) {
        gsap.set(sections[currentIndex.current], { zIndex: 0 });
        tl.to(images[currentIndex.current], { yPercent: -15 * dFactor })
          .set(sections[currentIndex.current], { autoAlpha: 0 });
      }

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      
      tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: (i: number) => i ? -100 * dFactor : 100 * dFactor
      }, {
        yPercent: 0
      }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(headings[index], {
          autoAlpha: 0,
          yPercent: 150 * dFactor
        }, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2"
        }, 0.2);

      currentIndex.current = index;
    }

    const observer = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating.current && gotoSection(currentIndex.current - 1, -1),
      onUp: () => !animating.current && gotoSection(currentIndex.current + 1, 1),
      tolerance: 10,
      preventDefault: true
    });

    // gotoSection(0, 1);

    return () => {
      observer.kill();
    };
  }, [isGsapReady]);

  return (
    <div ref={sectionsRef} className="w-full h-screen overflow-hidden relative">
      <div className="section absolute w-full h-full bg-pink">
        <div className="outer absolute w-full h-full overflow-hidden">
          <div className="inner relative w-full h-full">
            <div className="bg bg-blue-200 absolute w-full h-full"></div>
            <h2 className="section-heading absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Section 1</h2>
          </div>
        </div>
      </div>

      <div className="section absolute w-full h-full bg-orange">
        <div className="outer absolute w-full h-full overflow-hidden">
          <div className="inner relative w-full h-full">
            <div className="bg bg-green-200 absolute w-full h-full"></div>
            <h2 className="section-heading absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Section 2</h2>
          </div>
        </div>
      </div>

      <div className="section absolute w-full h-full bg-pink">
        <div className="outer absolute w-full h-full overflow-hidden">
          <div className="inner relative w-full h-full">
            <div className="bg bg-red-200 absolute w-full h-full"></div>
            <h2 className="section-heading absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Section 3</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GsapObserverDemo;