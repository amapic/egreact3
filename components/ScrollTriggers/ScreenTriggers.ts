import { MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { getDistanceFromTop } from '@/utils/utils';

// Shared trigger timing control
let lastTriggerTime = 0;
const TRIGGER_COOLDOWN = 1000; // 1 second cooldown

class DomUtils {
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  static keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  static preventDefault(e: any) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  static preventDefaultForScrollKeys(e: any) {
    if (DomUtils.keys[e.keyCode]) {
      DomUtils.preventDefault(e);
      return false;
    }
  }

  static disableScroll() {
    console.log("disableScroll");
    document.addEventListener('wheel', DomUtils.preventDefault, {
      passive: false,
    }); // Disable scrolling in Chrome
    document.addEventListener('keydown', DomUtils.preventDefaultForScrollKeys, {
      passive: false,
    });
  }

  static enableScroll() {
    console.log("enableScroll");
    document.removeEventListener('wheel', DomUtils.preventDefault, {
      passive: false,
    }); // Enable scrolling in Chrome
    document.removeEventListener(
      'keydown',
      DomUtils.preventDefaultForScrollKeys,
      {
        passive: false,
      }
    ); // Enable scrolling in Chrome
  }
}

const canTrigger = () => {
  const now = Date.now();
  if (now - lastTriggerTime >= TRIGGER_COOLDOWN) {
    lastTriggerTime = now;
    return true;
  }
  return false;
};

// Screen 2 Triggers
interface Screen2TriggersProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  gsap: any;
  ScrollTrigger: any;
  timeline: gsap.Timeline;
  numbersRef: MutableRefObject<HTMLDivElement[]>;
  bottomBarRef: MutableRefObject<HTMLDivElement | null>;
  AnimationClipCreator: MutableRefObject<boolean>;
}

export const createScreen2Triggers = ({
  containerRef,
  gsap,
  ScrollTrigger,
  timeline,
  numbersRef,
  bottomBarRef,
  AnimationClipCreator,
}: Screen2TriggersProps) => {
  const element = document.querySelector("#screen2");
  const elementAfter = document.querySelector("#screen3");

  const mainTriggerAnimLocal = ScrollTrigger.create({
    trigger: containerRef.current,
    start: "top center",
    end: "bottom center",
    ease: "power2.inOut",
    animation: timeline,
    onEnter: () => {
      if (!canTrigger()) return;
      const element = document.getElementById("screen2");
      if (!element) return;
      // document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      const tl2 = gsap.timeline();

      numbersRef.current.forEach((number) => {
        tl2.fromTo(
          number,
          {
            yPercent: -100,
            opacity: 0,
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
            setTimeout(() => {
              AnimationClipCreator.current = true;
            }, 1000);
          },
        },
        ">"
      );
    },
  });

  const mainTriggerUp = ScrollTrigger.create({
    trigger: element,
    start: "top 5%",
    end: "top 5%",
    onEnterBack: () => {
      if (!canTrigger()) return;
      // document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: 0,
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          // document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  const mainTriggerDown = ScrollTrigger.create({
    trigger: containerRef.current,
    start: "bottom 95%",
    end: "bottom 95%",
    onEnter: () => {
      if (!canTrigger()) return;
      
      // document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementAfter as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          // document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  const mainTriggerOwnCenter = ScrollTrigger.create({
    trigger: containerRef.current,
    start: "top 95%",
    end: "bottom 95%",
    onEnter: () => {
      if (!canTrigger()) return;
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(element as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          DomUtils.enableScroll()
        },
      });
    },
  });

  return {
    mainTriggerAnimLocal,
    mainTriggerUp,
    mainTriggerDown,
    mainTriggerOwnCenter,
  };
};

// Screen 3 Triggers
interface Screen3TriggersProps {
  gsap: any;
  ScrollTrigger: any;
  setIsVisible: (value: boolean) => void;
}

export const createScreen3Triggers = ({
  gsap,
  ScrollTrigger,
  setIsVisible,
}: Screen3TriggersProps) => {
  const element = document.querySelector("#screen3");
  const elementBefore = document.querySelector("#screen2");

  const scrollTrigger = ScrollTrigger.create({
    trigger: element,
    start: "top 95%",
    end: "bottom center",
    // markers: true,
    onEnter: () => {

      setTimeout(() => {
        
        setIsVisible(true);
      }, 1000);
    },
  });

  const mainTriggerUp = ScrollTrigger.create({
    trigger: element,
    start: "top 5%",
    end: "top 5%",
    onEnterBack: () => {
      if (!canTrigger()) return;
      // document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementBefore as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          // document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  return { scrollTrigger, mainTriggerUp };
};

// Screen 4 Triggers
interface Screen4TriggersProps {
  gsap: any;
  ScrollTrigger: any;
}

export const createScreen4Triggers = ({
  gsap,
  ScrollTrigger,
}: Screen4TriggersProps) => {
  const element = document.querySelector("#screen4");
  const elementAfter = document.querySelector("#screen5");

  const mainTriggerDown = ScrollTrigger.create({
    trigger: element,
    start: "bottom 95%",
    end: "bottom 95%",
    onEnter: () => {
      if (!canTrigger()) return;
      //document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementAfter as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  return { mainTriggerDown };
};

// Screen 5 Triggers
interface Screen5TriggersProps {
  gsap: any;
  ScrollTrigger: any;
}

export const createScreen5Triggers = ({
  gsap,
  ScrollTrigger,
}: Screen5TriggersProps) => {
  const element = document.querySelector("#screen5");
  const elementAfter = document.querySelector("#screen6");
  const elementBefore = document.querySelector("#screen4");

  const mainTriggerDown = ScrollTrigger.create({
    trigger: element,
    start: "bottom 95%",
    end: "bottom 95%",
    onEnter: () => {
      if (!canTrigger()) return;
      //document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementAfter as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  const mainTriggerUp = ScrollTrigger.create({
    trigger: element,
    start: "top 5%",
    end: "top 5%",
    onEnterBack: () => {
      if (!canTrigger()) return;
      //document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementBefore as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  return { mainTriggerDown, mainTriggerUp };
};

// Screen 6 Triggers
interface Screen6TriggersProps {
  gsap: any;
  ScrollTrigger: any;
}

export const createScreen6Triggers = ({
  gsap,
  ScrollTrigger,
}: Screen6TriggersProps) => {
  const element = document.querySelector("#screen6");
  const elementAfter = document.querySelector("#screen7");
  const elementBefore = document.querySelector("#screen5");

  const mainTriggerDown = ScrollTrigger.create({
    trigger: element,
    start: "bottom 95%",
    end: "bottom 95%",
    onEnter: () => {
      if (!canTrigger()) return;
      //document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementAfter as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  const mainTriggerUp = ScrollTrigger.create({
    trigger: element,
    start: "top 5%",
    end: "top 5%",
    onEnterBack: () => {
      if (!canTrigger()) return;
      //document.body.style.overflow = "hidden";
      DomUtils.disableScroll()
      gsap.to(window, {
        scrollTo: {
          y: getDistanceFromTop(elementBefore as HTMLElement),
          ease: "power2.inOut",
        },
        duration: 1,
        onComplete: () => {
          document.body.style.overflow = "";
          DomUtils.enableScroll()
        },
      });
    },
  });

  return { mainTriggerDown, mainTriggerUp };
};