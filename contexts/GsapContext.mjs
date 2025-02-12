"use client";



import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Création du contexte
const GsapContext = createContext(undefined);

// Hook personnalisé pour utiliser le contexte
const useGsap = () => {
  const context = useContext(GsapContext);
  if (!context) {
    throw new Error('useGsap must be used within a GsapProvider');
  }
  return context;
};

// Provider component
const GsapProvider = ({ children }) => {
  const [isGsapReady, setIsGsapReady] = useState(false);
  
  const gsapModules = useRef({
    gsap,
    ScrollTrigger,
    ScrollToPlugin,
  });

  useEffect(() => {
    // Enregistrement des plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Configuration globale de GSAP
    gsap.defaults({
      ease: 'power2.out',
      duration: 1,
    });

    // Configuration de ScrollTrigger
    ScrollTrigger.defaults({
      markers: false,
      scrub: false,
    });

    // Marquer GSAP comme prêt
    setIsGsapReady(true);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf('*');
    };
  }, []);

  const value = {
    gsapModules,
    isGsapReady,
  };

  return (
    <GsapContext.Provider value={value}>
      {children}
    </GsapContext.Provider>
  );
};

// Export des modules pour un accès direct si nécessaire
const gsapModules = {
  current: {
    gsap,
    ScrollTrigger,
    ScrollToPlugin,
  },
};

module.exports = {
  GsapProvider,
  useGsap,
  gsapModules
}; 