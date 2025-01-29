import { Screen4, Screen5 } from "@/components/Screen45";
import Screen2 from "@/components/Screen2";
import Menu from "@/components/Menu";
import Hero from "@/components/Hero";
import { Scene } from "@/components/Scene";
import { Prompt } from "next/font/google";
import GsapObserverDemo from "@/components/GsapObserverDemo";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function App() {
  return (
    <div className={`content ${prompt.className}`}>
      {/* <Menu />
      <Hero /> */}
      {/* <div className="spacer"></div> */}
      {/* <Scene />
      <Screen2 />
      <Screen4 />
      <Screen5 /> */}
      <GsapObserverDemo />
    </div>
  );
}

export default App;
