import { Screen3, Screen4, Screen5 } from "@/components/Screen345";
import Screen2 from "@/components/Screen2";
import Menu from "@/components/Menu";
import Hero from "@/components/Hero";
import { Scene } from "@/components/Scene";
import { Prompt } from "next/font/google";
import GsapObserverDemo from "@/components/GsapObserverDemo";
import Screen6 from "@/components/Screen6";
import RippleShader from "@/components/RippleShader";
const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function App() {
  return (
    <div className={`content ${prompt.className}`}>
      {/* <Menu /> */}
      {/* <Hero /> */}
      {/* <div className="spacer"></div> */}
      {/* <Scene /> */}
      {/* <Screen2 /> */}
      {/* <Screen3 /> */}
      {/* <Screen4 /> */}
      {/* <Screen5 /> */}
      {/* <Screen6 /> */}
      <RippleShader />
      {/* <div className="bg-black w-full h-screen overflow-y-auto">
      AAA
    </div> */}
      {/* <GsapObserverDemo /> */}
      {/* <div className="bg-black w-full h-screen overflow-y-auto">
      AAA
    </div> */}
    </div>
  );
}

export default App;
