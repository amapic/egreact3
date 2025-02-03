import { Prompt } from "next/font/google";
import { useEffect, useState } from "react";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const WaitingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 secondes

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      if (newProgress < 100) {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-30">
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className={`${prompt.className} text-white text-xl font-bold`}>Loading...</h1>
        
        {/* Jauge de progression */}
        <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )}