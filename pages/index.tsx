import { Screen4, Screen5 } from "@/components/Screen3";
import Screen2 from "@/components/Screen2";
import Menu from "@/components/Menu";
import Hero from "@/components/Hero";
import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function App() {
  return (
    <div className={`content ${prompt.className}`}>
      <Menu />
      <Hero />
      <div className="spacer"></div>
      
      <Screen2 />
	  {/* <Screen4 /> */}
	  {/* <Screen5 /> */}
     
    </div>
  );
}

export default App;
