'use client'

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Importation dynamique de GSAP
const gsap = dynamic(() => import('gsap'), { ssr: false });
const ScrollTrigger = dynamic(() => 
  import('gsap/dist/ScrollTrigger').then(mod => mod.ScrollTrigger), 
  { ssr: false }
);
const ScrollToPlugin = dynamic(() => 
  import('gsap/ScrollToPlugin').then(mod => mod.ScrollToPlugin), 
  { ssr: false }
);

// function disableScrolling(){
//   var x=window.scrollX;
//   var y=window.scrollY;
//   window.onscroll=function(){window.scrollTo(x, y);};
// }

// function enableScrolling(){
//   window.onscroll=function(){};
// }

const Screen2 = () => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const containerXX=useRef<HTMLDivElement | null>(null);
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});  // Pour stocker les modules GSAP
  
  useEffect(() => {
    // Charger GSAP et ses plugins
    Promise.all([
      import('gsap'),
      import('gsap/dist/ScrollTrigger'),
      import('gsap/ScrollToPlugin')
    ]).then(([gsapModule, scrollTriggerModule, scrollToModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      const ScrollToPlugin = scrollToModule.ScrollToPlugin;
      
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      
      // Stocker les modules pour une utilisation ultérieure
      gsapModules.current = {
        gsap,
        ScrollTrigger,
        ScrollToPlugin
      };
      
      setIsGsapReady(true);
    });
  }, []);

  // Animations des numéros et de la barre
  useEffect(() => {
    if (!isGsapReady) return;
    
    const { gsap, ScrollTrigger } = gsapModules.current;
    
    // Animation pour chaque numéro
    numberRefs.current.forEach((number, index) => {
      gsap.fromTo(number,
        {
          yPercent: -100,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.6,
          ease: "slow(0.7, 0.7, false)",
          scrollTrigger: {
            trigger: containerXX.current,
            start: "top center",
            end: "top center",
            toggleActions: "play none reset none",
            markers: true, // Pour le debug
            onEnter: () => console.log(index),
          },
        }
      );
      gsap.fromTo(number,
        {
          yPercent: -100,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.6,
          ease: "slow(0.7, 0.7, false)",
          scrollTrigger: {
            trigger: containerXX.current,
            start: "bottom center",
            end: "bottom center",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Animation de la barre du bas
    gsap.fromTo(bottomBarRef.current,
      {
        yPercent: 100,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.6,
        ease: "slow(0.7, 0.7, false)",
        scrollTrigger: {
          trigger: containerRefs.current[0],
          start: "top bottom",
          end: "top center",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isGsapReady]);

  //scroll automatique
  useEffect(() => {
    if (!isGsapReady) return;
    
    const { gsap, ScrollTrigger } = gsapModules.current;
    const element = document.querySelector("#screen2");

    if (!element) {
      console.warn("Required elements not found");
      return;
    }

    // Create the scroll trigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top center",
      end: "top center",
      onEnter: () => {
        // disableScrolling();
        gsap.to(window, {
          scrollTo: {
            y: element.offsetTop,
            offsetY: 0
          },
          duration: 1
        });

        // window.addEventListener("wheel", () => scrollTrigger.kill(), { once: true });
        // window.addEventListener("touchmove", () => scrollTrigger.kill(), { once: true });
      },
      onToggle: () => {
        // enableScrolling();
      }

    });

    const scrollTrigger2 = ScrollTrigger.create({
      trigger: element,
      start: "bottom center",
      end: "bottom center",
    //   markers:true,
      onEnterBack: () => {
        gsap.to(window, {
          scrollTo: {
            y: element.offsetTop,
            offsetY: 0
          },
          duration: 1
        });

        // window.addEventListener("wheel", () => scrollTrigger2.kill(), { once: true });
        // window.addEventListener("touchmove", () => scrollTrigger2.kill(), { once: true });
      },
      
    });

    // Cleanup function
    return () => {
      scrollTrigger.kill();
      scrollTrigger2.kill();
    };
  }, [isGsapReady]);

  return (
    <div id="screen2" ref={containerXX} className=" min-h-screen bg-[rgb(16,16,16)] text-white p-8">
    
      <h1 className="text-3xl xl:text-5xl mt-20 mb-24 bg-gradient-to-b from-gray-400 to-white bg-clip-text text-transparent">
        360° SERVICES
      </h1>

      {/* Services Grid */}
      <div className="grid grid-cols-4 gap-0 max-w-screen-lg mx-auto">
        {/* Service 1 */}
        <div 
          className="service-item border-l-2 border-white pl-6 pr-4"
          ref={(el) => { containerRefs.current[0] = el }}
        >
          <div 
            className="gradient-text-mask  text-[3rem] sm:text-[3rem] md:text-[8rem] text-[12rem] mb-8"
            ref={(el) => { numberRefs.current[0] = el }}
          >
            01
          </div>
          <div className="gradient-text-mask md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden">
            AUDIT & <br />
            IT CONSULTING
          </div>
        </div>

        {/* Service 2 */}
        <div 
          className="service-item border-l-2 border-white pl-6 pr-4"
          ref={(el) => { containerRefs.current[1] = el }}
        >
          <div 
            className="gradient-text-mask text-[3rem] sm:text-[3rem] md:text-[8rem] text-[12rem] mb-8"
            ref={(el) => { numberRefs.current[1] = el }}
          >
            02
          </div>
          <div className="gradient-text-mask md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden">
            DIGITAL <br />
            SOLUTION
          </div>
        </div>

        {/* Service 3 */}
        <div 
        id="targetSection"
          className="service-item border-l-2 border-white pl-6 pr-4"
          ref={(el) => { containerRefs.current[2] = el }}
        >
          <div 
            className="gradient-text-mask  text-[3rem] sm:text-[3rem] md:text-[8rem] text-[12rem] mb-8"
            ref={(el) => { numberRefs.current[2] = el }}
          >
            03
          </div>
          <div className="gradient-text-mask md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden">
            DATA <br />
            SOLUTION
          </div>
        </div>

        {/* Service 4 */}
        <div 
          className="service-item border-l-2 border-white pl-6 pr-4"
          ref={(el) => { containerRefs.current[3] = el }}
        >
          <div 
            className="gradient-text-mask  text-[3rem] sm:text-[3rem] md:text-[8rem] text-[12rem] mb-8"
            ref={(el) => { numberRefs.current[3] = el }}
          >
            04
          </div>
          <div className="gradient-text-mask md:text-lg lg:text-xl xl:text-3xl text-ellipsis overflow-hidden">
            MARKETING <br />
            & BRANDING
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pr-8  mx-auto max-w-screen-lg">
      <div ref={bottomBarRef} className="bg-black border-6 mt-20 flex justify-between items-center border border-white rounded-full px-8 py-4">
        
        <div className="md:text-md xl:text-xl">OUR SERVICES</div>
        <div className="md:text-md xl:text-xl">OPEN</div>
        
      </div>
      </div>
    </div>
  );
};

export default Screen2;