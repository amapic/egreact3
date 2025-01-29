'use client'

import React, { useEffect, useRef, useState } from 'react';

const SwipeSection = () => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  const gsapModules = useRef<any>({});
  const currentIndexRef = useRef(0);
  const allowScrollRef = useRef(true);
  const scrollTimeoutRef = useRef<any>(null);
  const intentObserverRef = useRef<any>(null);
  const swipePanelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    Promise.all([
      import('gsap'),
      import('gsap/dist/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);
      gsapModules.current = { gsap, ScrollTrigger };
      setIsGsapReady(true);
    });
  }, []);

  const gotoPanel = (index: number, isScrollingDown: boolean) => {
    const { gsap } = gsapModules.current;
    const swipePanels = swipePanelsRef.current;

    // return to normal scroll if we're at the end or back up to the start
    if ((index === swipePanels.length && isScrollingDown) || (index === -1 && !isScrollingDown)) {
      intentObserverRef.current?.disable(); // resume native scroll
      return;
    }

    allowScrollRef.current = false;
    scrollTimeoutRef.current.restart(true);

    const target = isScrollingDown ? swipePanels[currentIndexRef.current] : swipePanels[index];
    gsap.to(target, {
      yPercent: isScrollingDown ? -100 : 0,
      duration: 0.75
    });

    currentIndexRef.current = index;
  };

  useEffect(() => {
    if (!isGsapReady) return;

    const { gsap, ScrollTrigger } = gsapModules.current;

    // Initialize scroll timeout
    scrollTimeoutRef.current = gsap.delayedCall(1, () => allowScrollRef.current = true).pause();

    // Set z-index levels for the swipe panels
    gsap.set(swipePanelsRef.current, { 
      zIndex: (i: number) => swipePanelsRef.current.length - i 
    });

    // Create observer
    intentObserverRef.current = ScrollTrigger.observe({
      type: "wheel,touch",
      onUp: () => allowScrollRef.current && gotoPanel(currentIndexRef.current - 1, false),
      onDown: () => allowScrollRef.current && gotoPanel(currentIndexRef.current + 1, true),
      tolerance: 10,
      preventDefault: true,
      onEnable(self: any) {
        allowScrollRef.current = false;
        scrollTimeoutRef.current.restart(true);
        const savedScroll = self.scrollY();
        self._restoreScroll = () => self.scrollY(savedScroll);
        document.addEventListener("scroll", self._restoreScroll, {passive: false});
      },
      onDisable: (self: any) => document.removeEventListener("scroll", self._restoreScroll)
    });

    // Disable observer initially
    intentObserverRef.current.disable();

    // Create main ScrollTrigger
    const mainTrigger = ScrollTrigger.create({
      trigger: ".swipe-section",
      pin: true,
      start: "top top",
      end: "+=200",
      onEnter: (self: any) => {
        if (intentObserverRef.current.isEnabled) return;
        self.scroll(self.start + 1);
        intentObserverRef.current.enable();
      },
      onEnterBack: (self: any) => {
        if (intentObserverRef.current.isEnabled) return;
        self.scroll(self.end - 1);
        intentObserverRef.current.enable();
      }
    });

    return () => {
      mainTrigger.kill();
      intentObserverRef.current?.disable();
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, [isGsapReady]);

  return (
    <>
      <div className="description panel blue">
        <div>
          <h1>Mixed observer and scrolling...</h1>
          <div className="scroll-down">
            Scroll down
            <div className="arrow"></div>
          </div>
        </div>
      </div>

      <div className="swipe-section">
        <section 
          ref={el => el && (swipePanelsRef.current[0] = el)}
          className="panel red"
        >
          ScrollTrigger.observe() section
        </section>
        <section 
          ref={el => el && (swipePanelsRef.current[1] = el)}
          className="panel purple"
        >
          SWIPE SECTION 2
        </section>
        <section 
          ref={el => el && (swipePanelsRef.current[2] = el)}
          className="panel blue"
        >
          SWIPE SECTION 3
        </section>
        <section 
          ref={el => el && (swipePanelsRef.current[3] = el)}
          className="panel orange"
        >
          Last swipe section... continue scrolling
        </section>
      </div>

      <footer className="description panel blue">
        footer
      </footer>
    </>
  );
};

export default SwipeSection; 