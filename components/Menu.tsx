"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getDistanceFromTop } from "@/utils/utils";

const MenuItem = ({ text, id }: { text: string, id: string }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  let element: HTMLElement | null = null;
  // Fonction pour vérifier si un élément est visible
  const isElementVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Exemple d'utilisation dans un useEffect
  useEffect(() => {
    element = document.getElementById(id);
    
    const checkVisibility = () => {
      if (element) {
        const isVisible = isElementVisible(element as HTMLElement);
        setIsVisible(isVisible);
      }
    };

    
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [id]);

  const scrollToSection = () => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div data-subMenu className="flex items-center cursor-pointer" onClick={scrollToSection}>
      <div
        ref={textRef}
        data-text
        className="hover:font-white text-[rgb(230,230,230)] text-md opacity-0 -translate-x-[10px] w-[200px] leading-4 text-right pr-4"
      >
        {text}
      </div>
      <div
        ref={lineRef}
        className={`hover:bg-white h-[3px] ${isVisible ? 'bg-white' : 'bg-[rgb(50,50,50)]'} w-[24px] z-10`}
      />
    </div>
  );
};

const Menu = () => {
  // Variable globale pour tracker l'animation en cours
  let isAnimating = false;
  const menuItems = [
    ["Introduction","hero"],
    ["Services","screen2"],
    ["About Us","screen3"],
    ["Clients & Partners","screen6"],
    ["Contact","screen6"],
  ];

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLButtonElement>(null);
  const bOneRef = useRef<HTMLDivElement>(null);
  const barreContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = menuContainerRef.current;
    const items = Array.from(container?.children || []);
    const barreContainer = barreContainerRef.current;

    const handleMouseEnter = () => {
      if (isAnimating) return;
      isAnimating = true;
      const stagger = 0.1;

      const timeline = gsap.timeline();

      const textElements = Array.from(
        container?.querySelectorAll("[data-text]") || []
      );

      const subMenuElements = Array.from(
        container?.querySelectorAll("[data-subMenu]") || []
      ).reverse();

      timeline.to(subMenuElements, {
        y: (index) => 50 - (index * 10), // 15px pour le premier, 20px pour le second, etc.
        duration: 0.3,
        // stagger: stagger,
        ease: "power2.out",
      });



      timeline.to(items, {
        marginBottom: 15,
        duration: 0.3,
        stagger: stagger,
        ease: "power2.out",
      },">");



      timeline.to(textElements, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: stagger,
        ease: "power2.out",


      },">");
    };

    const handleMouseLeave = () => {

      const timeline = gsap.timeline();

      const textElements = Array.from(
        container?.querySelectorAll("[data-text]") || []
      );

      const subMenuElements = Array.from(
        container?.querySelectorAll("[data-subMenu]") || []
      );

 


      timeline.to(subMenuElements, {
        y: (index) => 0, // 15px pour le premier, 20px pour le second, etc.
        duration: 0.3,
        // stagger: stagger,
        ease: "power2.out",
      },">");

      timeline.to(items, {
        marginBottom: 1,
        duration: 0.3,
        ease: "power2.out",
      },">");


      timeline.to(textElements, {
        opacity: 0,
        x: -10,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          isAnimating = false;
        },
      });
    };

    container?.addEventListener("mouseover", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mouseover", handleMouseEnter); 
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    gsap.fromTo(
      helloRef.current,
      {
        y: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        y: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      bOneRef.current,
      {
        y: -300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        y: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      menuContainerRef.current,
      {
        x: 300, // Position de départ (à gauche)
        opacity: 0,
      },
      {
        x: 0, // Position finale (position actuelle)
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      }
    );
  });

  return (
    <>
      <div className="fixed h-27 w-screen flex-row items-center justify-between text-white z-20">
        <div className="bg-[rgb(16,16,16)] h-1/2 w-full"></div>
        <div className="bg-gradient-to-b from-[rgb(16,16,16)] to-transparent h-1/2 w-full"></div>
      </div>
      {/* <div className="fixed top-27 h-2 w-screen bg-gradient-to-b from-[rgb(16,16,16)] to-transparent z-20"></div> */}

      <div className="flex justify-between items-center">
        <div
          ref={bOneRef}
          className="fixed text-white top-8 left-8 font-32 font-['Prompt'] z-20"
        >
          B one consulting
        </div>
        <button
          ref={helloRef}
          className="font-20 z-20 w-48 h-12 fixed top-9 right-8 border border-purple text-purple rounded-full"
        >
          SAY HELLO
        </button>
      </div>
      <div
        ref={menuContainerRef}
        className="fixed top-30 right-10 flex flex-col gap-0 pl-1 z-20 "
      >
        <div className="">
          {menuItems.map((item, index) => (
            <MenuItem key={index} text={item[0]} id={item[1]}  />
          ))}
        </div>
      </div>
    </>
  );
};

export default Menu;
