import { Screen3, Screen4, Screen5 } from "@/components/Screen345";
import Screen2 from "@/components/Screen2";
import Menu from "@/components/Menu";
import { Hero } from "@/components/Hero";
import { Scene } from "@/components/Scene";
import { Prompt } from "next/font/google";
import Screen6 from "@/components/Screen6";
// import RippleShader from "@/components/RippleShader";
import Interstitial from "@/components/Interstitial";
// const MemoizedScreen3 = memo(Screen3);

import { useRef, useState, useEffect, memo, useMemo } from "react";
const AppHero = memo(Hero);
import { WaitingScreen } from "@/components/waitingScreen";
import { DomUtils } from "@/utils/utils";
const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function AppContent() {
  return (
    <>
    <Hero />
    <App />
    
    </>
  )
}

function App() {
  const paramScene = useRef<number>(0);
  const [sceneLoaded, setSceneLoaded] = useState(true);
  // const [showScene, setShowScene] = useState(true);
  const [animateCanvas1, setAnimateCanvas1] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    DomUtils.enableScroll();

  }, []);

  // DomUtils

  return (
    <div className={`content ${prompt.className}`}>
      {/* <WaitingScreen /> */}
      {/* {!sceneLoaded && <WaitingScreen />} */}
      <Scene param={paramScene} caca={setSceneLoaded} animateCanvas1={animateCanvas1} />

      <Menu />
      <Hero />
      <Screen2  />
      <Screen3 />
      <Interstitial />
      <Screen4 />
      <Screen5 />
      <Screen6 setAnimateCanvas1={setAnimateCanvas1} />
    </div>
  );
}

export default App;
