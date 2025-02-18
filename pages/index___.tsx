//import { reportWebVitals } from 'next/dist/build/templates/pages';
import dynamic from "next/dynamic";
import { useEffect } from "react";
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { Profiler } from "react";

const onRenderCallback = (id, phase, actualDuration) => {
  console.log(
    `Component: ${id}, Phase: ${phase}, Render Time: ${actualDuration}ms`
  );
};
// Chargement dynamique côté client uniquement
const WebGPUScene = dynamic(() => import("@/components/WebGPUTest"), {
  ssr: false,
});

// Fonction reportWebVitals

export default function Home() {
  useEffect(() => {
    // reportWebVitals(console.log);
  }, []);

  return (
    <Profiler id="MyComponent" onRender={onRenderCallback}>
      <main>
        <WebGPUScene />
      </main>
    </Profiler>
  );
}
