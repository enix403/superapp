import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Bounds,
  GizmoHelper,
  GizmoViewport,
  Grid
} from "@react-three/drei";
import { build3DModel } from "./build-geometry";
import { COLOR_SKY } from "./styles";

import { useMemo } from "react";
import clsx from "clsx";
import { usePlanComponents } from "../plan-state";
import { CELL_SIZE } from "@/lib/units";

/* =============================================== */

function World3DEditor() {
  const plan = usePlanComponents();

  const model = useMemo(() => build3DModel(plan), [plan]);

  return (
    // <Canvas camera={{ position: [-10, 40, 5], near: 0.1, far: 600 }}>
    <Canvas camera={{ position: [-2, 27, 5], near: 0.1, far: 600 }}>
      <color attach='background' args={[COLOR_SKY]} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[100, 150, 100]} intensity={0.8} />
      <directionalLight position={[100, -150, 100]} intensity={0.8} />
      <directionalLight position={[0, -150, 0]} intensity={0.8} />
      <directionalLight position={[0, 150, 0]} intensity={0.8} />

      <OrbitControls target={[0, 0, 0]} enableDamping={true} />

      <GizmoHelper
        alignment='top-right' // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewport axisHeadScale={1.2} />
      </GizmoHelper>

      <Bounds fit clip observe margin={1.2}>
        <primitive object={model} />
        <Grid
          infiniteGrid
          cellSize={(CELL_SIZE * 12) / 2}
          sectionSize={CELL_SIZE * 12}
          fadeDistance={10000}
          fadeStrength={4}
          position={[0, -1, 0]}
          side={THREE.DoubleSide}
          cellColor='#AAAAAA'
          sectionColor='#FAFAFA'
        />
      </Bounds>
    </Canvas>
  );
}

export function World3DPane() {
  /* const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2700);
    return () => clearTimeout(timer);
  }, []); */

  return (
    <div className='relative flex flex-1-fix flex-col bg-[#EEF1F3]'>
      {/*loading && (
        <div className='flex flex-1 flex-col items-center justify-center px-8'>
          <p className='mb-2 text-accent-foreground/60'>Rendering Model...</p>
          <div className='h-1.5 w-full max-w-lg overflow-hidden rounded-[18px] border bg-[#DCDFE1]'>
            <motion.div
              className='h-full bg-[#0ec57f]'
              initial={{ width: "0%" }}
              animate={{
                width: [
                  "0%",
                  "30%",
                  "30%",
                  "42%",
                  "42%",
                  "60%",
                  "60%",
                  "70%",
                  "70%",
                  "80%",
                  "80%",
                  "100%"
                ]
              }}
              transition={{
                duration: 2.5, // Total duration
                times: [
                  0, 0.2, 0.3, 0.35, 0.45, 0.55, 0.65, 0.75, 0.8, 0.85, 0.9, 1
                ], // Pause times
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      )*/}
      <>
        <div className='flex-1-fix'>
          <World3DEditor />
        </div>

        <div
          className={clsx(
            "pointer-events-none absolute top-0 right-0",
            "-translate-x-20 translate-y-20"
          )}
        >
          <div className='size-36 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#000000] opacity-5'></div>
        </div>
      </>
    </div>
  );
}
