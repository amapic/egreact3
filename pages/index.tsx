import { Screen3, Screen4, Screen5 } from "@/components/Screen345";
import Screen2 from "@/components/Screen2";
import Menu from "@/components/Menu";
import Hero from "@/components/Hero";
import { Scene } from "@/components/Scene";
import { Prompt } from "next/font/google";
import Screen6 from "@/components/Screen6";
// import RippleShader from "@/components/RippleShader";
import Interstitial from "@/components/Interstitial";

import {useRef, useState} from "react"
import { WaitingScreen } from "@/components/waitingScreen";
const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function App() {
   const paramScene = useRef<number>(0);     
  const [sceneLoaded, setSceneLoaded] = useState(false);

  

  return (
    <div className={`content ${prompt.className}`}>
      {/* <WaitingScreen/> */}
      {!sceneLoaded && <WaitingScreen/>}
      <Scene param={paramScene} caca={setSceneLoaded} />
      {sceneLoaded && (
        <>
          <Menu />
          <Hero />
          <Screen2 /> 
          <Screen3 />   
           <Interstitial />
           <Screen4 />
           <Screen5 /> 
           <Screen6 /> 
         
        </>
      )}
    </div>
  );
}

export default App;
