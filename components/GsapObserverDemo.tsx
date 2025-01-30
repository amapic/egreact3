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
      import('gsap/dist/ScrollToPlugin'),
    ]).then(([gsapModule, scrollTriggerModule, observerModule, scrollToModule]) => {
      const gsap = gsapModule.default;
      const Observer = observerModule.Observer;
      const ScrollToPlugin = scrollToModule.ScrollToPlugin;
      
      gsap.registerPlugin(Observer, ScrollToPlugin);
      
      gsapModules.current = { gsap, Observer, ScrollToPlugin };
      setIsGsapReady(true);
    });
  }, []);

  

  useEffect(() => {
    if (!isGsapReady || !sectionsRef.current) return;

    const { gsap, Observer, ScrollToPlugin } = gsapModules.current;
    let observer: any;

    const alignSectionToViewport = () => {
      if (!sectionsRef.current) return;
      
      const rect = sectionsRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      gsap.to(window, {
        duration: 0.5,
        scrollTo: scrollTop + rect.top,
        ease: "power2.inOut"
      });
    };



    // Fonction pour créer l'observer
    const createObserver = () => {
      alignSectionToViewport();
      observer = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => {

          // if (currentIndex.current <= 0){
          //   // destroyObserver();
          //   return;
          // }
          if (!animating.current) {
            gotoSection(currentIndex.current - 1, -1);
          }

             
        },
        onUp: () => {
          // if (currentIndex.current >= 2){
          //   // destroyObserver();
          //   return;
          // }
          if (!animating.current) {
            gotoSection(currentIndex.current + 1, 1);
          }
        },
        tolerance: 10,
        preventDefault: true
      });


    };

    // Fonction pour détruire l'observer
    const destroyObserver = () => {
      if (observer) {
        observer.kill();
        observer = null;
      }
    };

    // Gestionnaires d'événements pour l'entrée/sortie de la souris
    const handleMouseEnter = () => {
      console.log('handleMouseEnter');
      createObserver();
    };

    const handleMouseLeave = () => {
      console.log('handleMouseLeave');
      destroyObserver();
    };

    // Ajout des écouteurs d'événements
    sectionsRef.current.addEventListener('mouseenter', handleMouseEnter);
    sectionsRef.current.addEventListener('mouseleave', handleMouseLeave);

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

      // if (index < 0 && direction === -1){
      //   // index = 0;
      //   destroyObserver();
      // }
      // if (index > sections.length - 1 && direction === 1){
      //   // index = sections.length - 1;
      //   destroyObserver();
      // }
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

    gotoSection(0, 1);

    // Cleanup
    return () => {
      if (sectionsRef.current) {
        sectionsRef.current.removeEventListener('mouseenter', handleMouseEnter);
        sectionsRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      // destroyObserver();
      gsap.killTweensOf(sectionsRef.current);
    };
  }, [isGsapReady]);

  return (
    <>
    
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
    </>
  );
};

export default GsapObserverDemo;