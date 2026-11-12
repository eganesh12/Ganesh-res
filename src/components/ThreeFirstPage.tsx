import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { 
  RotateCw, Eye, Sliders, ChevronDown, ChevronUp, ArrowDown, 
  Sparkles, Check, Compass, Layers, ShieldCheck, Cpu, Volume2, VolumeX 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Pre-allocated reusable scratch math objects outside the render loop (Zero GC)
const _vec3 = new THREE.Vector3();
const _vec3Target = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _mat4 = new THREE.Matrix4();
const _color = new THREE.Color();

interface ThreeFirstPageProps {
  theme: "dark" | "light";
  onEnterPortfolio: () => void;
}

export type CoreFinish = "cyan" | "indigo" | "rose" | "gold";

export default function ThreeFirstPage({ theme, onEnterPortfolio }: ThreeFirstPageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { user, signInWithGoogle } = useAuth();

  // Control Dock states
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [explodedVal, setExplodedVal] = useState(0); // 0 = assembled, 1 = fully exploded
  const [finish, setFinish] = useState<CoreFinish>("cyan");
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<"front" | "iso" | "top" | "macro">("front");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [statsFps, setStatsFps] = useState(60);

  // Mutable refs for Three.js render loop to avoid closures tearing down canvas
  const explodedRef = useRef(0);
  explodedRef.current = explodedVal;
  const finishRef = useRef<CoreFinish>("cyan");
  finishRef.current = finish;
  const autoRotateRef = useRef(true);
  autoRotateRef.current = autoRotate;
  const cameraTargetPosRef = useRef<THREE.Vector3 | null>(null);

  // Set camera target positions with exponential damping
  const handleSelectCameraPreset = useCallback((preset: "front" | "iso" | "top" | "macro") => {
    setCameraPreset(preset);
    switch (preset) {
      case "front":
        cameraTargetPosRef.current = new THREE.Vector3(0, 1.2, 5.0);
        break;
      case "iso":
        cameraTargetPosRef.current = new THREE.Vector3(3.5, 3.2, 4.0);
        break;
      case "top":
        cameraTargetPosRef.current = new THREE.Vector3(0.01, 6.2, 0.5);
        break;
      case "macro":
        cameraTargetPosRef.current = new THREE.Vector3(0.8, 0.6, 2.2);
        break;
    }
  }, []);

  const handleGoogleQuickSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (_) {
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL from GPU string (SwiftShader / llvmpipe / WARP)
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Scene, Background and Horizon Fog matching active Theme
    const scene = new THREE.Scene();
    const isDark = theme === "dark";
    const bgHex = isDark ? 0x020617 : 0xf8fafc;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.04);

    // 3. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.0);

    // 4. Renderer with ACESFilmicToneMapping & PBR environment
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.15 : 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 5. Procedural RoomEnvironment reflections for high-fidelity metals & crystals
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnvTexture;
    pmremGenerator.dispose();

    // 6. Studio Lighting Rig: Warm key directional light + Cool Hemisphere fill
    const keyLight = new THREE.DirectionalLight(0xffeedd, isDark ? 2.8 : 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      const d = 3.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(
      isDark ? 0x38bdf8 : 0x0284c7, // sky cool cyan
      isDark ? 0x0f172a : 0xe2e8f0, // ground cool slate
      isDark ? 1.2 : 1.0
    );
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, isDark ? 1.6 : 0.8);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    // 7. Ground Contact Radial Shadow (zero floating effect)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext("2d")!;
    const radGradient = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    radGradient.addColorStop(0, isDark ? "rgba(6, 182, 212, 0.45)" : "rgba(15, 23, 42, 0.25)");
    radGradient.addColorStop(0.5, isDark ? "rgba(15, 23, 42, 0.3)" : "rgba(15, 23, 42, 0.08)");
    radGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    shadowCtx.fillStyle = radGradient;
    shadowCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: isDark ? 0.8 : 0.6,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.6;
    scene.add(shadowMesh);

    // 8. Composite 8-Part Procedural 3D Subject: AI Quantum Core & Neural Lattice (THREE.Group)
    const masterCoreGroup = new THREE.Group();
    masterCoreGroup.position.y = -0.1;
    scene.add(masterCoreGroup);

    // Color definitions for finishes
    const finishPalettes: Record<CoreFinish, { primary: number; accent: number; emissive: number }> = {
      cyan: { primary: 0x06b6d4, accent: 0x6366f1, emissive: 0x0891b2 },
      indigo: { primary: 0x6366f1, accent: 0xec4899, emissive: 0x4f46e5 },
      rose: { primary: 0xf43f5e, accent: 0xf59e0b, emissive: 0xe11d48 },
      gold: { primary: 0xf59e0b, accent: 0x10b981, emissive: 0xd97706 },
    };

    // Part 1: Central Polyhedral Quantum Nucleus (PBR Physical)
    const nucleusGeo = new THREE.IcosahedronGeometry(0.68, 1);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: finishPalettes.cyan.emissive,
      emissiveIntensity: 0.45,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusMesh.castShadow = !isSoftwareGl;
    masterCoreGroup.add(nucleusMesh);

    // Part 2: Outer Geodesic Crystalline Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(0.88, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.85,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    masterCoreGroup.add(cageMesh);

    // Part 3: Equatorial Gyroscopic Titanium Ring (Primary Ring)
    const ring1Geo = new THREE.TorusGeometry(1.25, 0.045, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      metalness: 0.95,
      roughness: 0.22,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.castShadow = !isSoftwareGl;
    masterCoreGroup.add(ring1Mesh);

    // Part 4: Inclined Gyroscopic Meridian Ring (Secondary Ring)
    const ring2Geo = new THREE.TorusGeometry(1.42, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.9,
      roughness: 0.28,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 3;
    ring2Mesh.castShadow = !isSoftwareGl;
    masterCoreGroup.add(ring2Mesh);

    // Part 5: Polar Precession Ring with Beveled Teeth (Tertiary Ring)
    const ring3Geo = new THREE.TorusGeometry(1.6, 0.035, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.88,
      roughness: 0.35,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.y = Math.PI / 4;
    ring3Mesh.rotation.z = Math.PI / 6;
    masterCoreGroup.add(ring3Mesh);

    // Part 6: Upper & Lower Neural Conduits (Pillars)
    const conduitGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 16);
    const conduitMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const conduitUpper = new THREE.Mesh(conduitGeo, conduitMat);
    conduitUpper.position.y = 0.95;
    const conduitLower = new THREE.Mesh(conduitGeo, conduitMat);
    conduitLower.position.y = -0.95;
    masterCoreGroup.add(conduitUpper);
    masterCoreGroup.add(conduitLower);

    // Part 7: Magnetic Levitating Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.12, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.4,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.45;
    baseMesh.receiveShadow = !isSoftwareGl;
    masterCoreGroup.add(baseMesh);

    // Part 8: Instanced Orbiting Data Nodes (32 floating neural satellites)
    const nodeCount = 32;
    const nodeSphereGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeSphereMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeSphereGeo, nodeSphereMat, nodeCount);
    instancedNodes.frustumCulled = false;
    masterCoreGroup.add(instancedNodes);

    // Initialize node positions along spherical spiral
    const nodeOffsets: { angle: number; radius: number; speed: number; y: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 4;
      const radius = 1.75 + (i % 3) * 0.25;
      const speed = 0.4 + (i % 5) * 0.15;
      const y = -0.8 + (i / nodeCount) * 1.6;
      nodeOffsets.push({ angle, radius, speed, y });

      _mat4.identity();
      _mat4.setPosition(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      instancedNodes.setMatrixAt(i, _mat4);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;

    // 9. Damped Controls (OrbitControls)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 10;
    controls.minDistance = 1.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // prevent dipping under ground plane
    controls.target.set(0, 0, 0);

    // Cancel scripted camera moves when user interacts
    controls.addEventListener("start", () => {
      cameraTargetPosRef.current = null;
    });

    // 10. Frame Loop with Software WebGL Guard & Clock
    const clock = new THREE.Clock();
    let frameId = 0;
    let framesCount = 0;
    let lastFpsStamp = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function animate() {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // FPS compute
      framesCount++;
      const now = performance.now();
      if (now - lastFpsStamp >= 1000) {
        setStatsFps(Math.round((framesCount * 1000) / (now - lastFpsStamp)));
        framesCount = 0;
        lastFpsStamp = now;
      }

      // Smooth camera interpolation towards target preset if active
      if (cameraTargetPosRef.current) {
        const factor = 1 - Math.exp(-6 * dt);
        camera.position.lerp(cameraTargetPosRef.current, factor);
        if (camera.position.distanceTo(cameraTargetPosRef.current) < 0.02) {
          camera.position.copy(cameraTargetPosRef.current);
          cameraTargetPosRef.current = null;
        }
      }

      // Dynamic Material Color Update based on Finish
      const curFinish = finishRef.current;
      const palette = finishPalettes[curFinish];
      nucleusMat.color.lerp(_color.setHex(palette.primary), 0.1);
      nucleusMat.emissive.lerp(_color.setHex(palette.emissive), 0.1);
      ring2Mat.color.lerp(_color.setHex(palette.primary), 0.1);
      ring3Mat.color.lerp(_color.setHex(palette.accent), 0.1);

      // Auto-rotation & gyroscopic kinematics
      if (autoRotateRef.current) {
        masterCoreGroup.rotation.y += 0.4 * dt;
        ring1Mesh.rotation.z += 0.8 * dt;
        ring2Mesh.rotation.x -= 0.6 * dt;
        ring3Mesh.rotation.y += 0.7 * dt;
        cageMesh.rotation.y -= 0.3 * dt;
        cageMesh.rotation.x += 0.2 * dt;
      }

      // Exploded View kinematics with exponential damping
      const targetSep = explodedRef.current;
      ring1Mesh.scale.lerp(_vec3.set(1 + targetSep * 0.6, 1 + targetSep * 0.6, 1 + targetSep * 0.6), 0.1);
      ring2Mesh.scale.lerp(_vec3.set(1 + targetSep * 0.8, 1 + targetSep * 0.8, 1 + targetSep * 0.8), 0.1);
      ring3Mesh.scale.lerp(_vec3.set(1 + targetSep * 1.0, 1 + targetSep * 1.0, 1 + targetSep * 1.0), 0.1);
      conduitUpper.position.y = THREE.MathUtils.lerp(conduitUpper.position.y, 0.95 + targetSep * 0.8, 0.1);
      conduitLower.position.y = THREE.MathUtils.lerp(conduitLower.position.y, -0.95 - targetSep * 0.8, 0.1);
      baseMesh.position.y = THREE.MathUtils.lerp(baseMesh.position.y, -1.45 - targetSep * 0.5, 0.1);

      // Update orbiting satellites
      for (let i = 0; i < nodeCount; i++) {
        const item = nodeOffsets[i];
        const curAngle = item.angle + elapsed * item.speed;
        const curRadius = item.radius * (1 + targetSep * 0.4);
        const curY = item.y * (1 + targetSep * 0.5) + Math.sin(curAngle * 2) * 0.08;

        _mat4.identity();
        _mat4.setPosition(Math.cos(curAngle) * curRadius, curY, Math.sin(curAngle) * curRadius);
        instancedNodes.setMatrixAt(i, _mat4);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    }

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Keyboard shortcut 'H' to toggle dock
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h" || e.key === "H") {
        setIsControlsVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 11. Proper Resource Disposal
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      controls.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      conduitGeo.dispose();
      conduitMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      nodeSphereGeo.dispose();
      nodeSphereMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      roomEnvTexture.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className="relative w-full h-screen overflow-hidden select-none font-sans">
      {/* 3D WebGL Canvas isolated mount container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" 
      />

      {/* TOP HEADER OVERLAY: Minimal Title & Architecture Specs (Clean static indicators) */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/40">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-mono text-xs sm:text-sm font-black tracking-widest uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                Ganesh Enyaram // Neural Core
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-400 font-bold uppercase">
                WebGL PBR
              </span>
            </div>
            <p className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Interactive 3D First Page &bull; 8-Part Procedural Architecture &bull; {statsFps} FPS
            </p>
          </div>
        </div>

        {/* Top Right Action: Instant Jump into Full Portfolio */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onEnterPortfolio}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-cyan-500/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Explore Portfolio</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE BOTTOM CONTROL DOCK (<= 15% viewport footprint, solid rgba surfaces, zero backdrop-filter over WebGL) */}
      <div 
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 w-[94vw] max-w-[860px] pointer-events-none flex flex-col items-center transition-transform duration-300 ease-out"
        style={{
          transform: isControlsVisible ? "translate(-50%, 0)" : "translate(-50%, calc(100% - 32px))"
        }}
      >
        {/* Dock Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsControlsVisible(!isControlsVisible)}
          className={`pointer-events-auto px-4 py-1.5 rounded-t-xl border-t border-x text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors ${
            isDark 
              ? "bg-[#0b1329] border-slate-800 text-cyan-400 hover:text-white" 
              : "bg-white border-slate-300 text-slate-800 hover:text-indigo-600"
          }`}
          title="Toggle Control Dock (Hotkey: H)"
        >
          {isControlsVisible ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls (H)</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show 3D Controls (H)</span>
            </>
          )}
        </button>

        {/* Main Horizontal Dock Body */}
        <div 
          className={`pointer-events-auto w-full p-4 rounded-2xl border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark 
              ? "bg-[#080d1e] border-slate-800 text-slate-200" 
              : "bg-[#ffffff] border-slate-300 text-slate-800"
          }`}
        >
          {/* Group 1: Exploded View Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col min-w-[120px] sm:min-w-[140px] flex-1">
              <div className="flex justify-between text-[10px] font-mono font-bold uppercase mb-1">
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>Exploded View</span>
                <span className="text-cyan-400">{Math.round(explodedVal * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedVal}
                onChange={(e) => setExplodedVal(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className={`hidden sm:block w-px h-8 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

          {/* Group 2: Material Finishes Swatches */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase font-bold mr-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Finish:
            </span>
            {(["cyan", "indigo", "rose", "gold"] as CoreFinish[]).map((f) => {
              const bgColors = {
                cyan: "bg-cyan-400",
                indigo: "bg-indigo-500",
                rose: "bg-rose-500",
                gold: "bg-amber-400",
              };
              return (
                <button
                  key={f}
                  onClick={() => setFinish(f)}
                  className={`w-6 h-6 rounded-full ${bgColors[f]} transition-all cursor-pointer flex items-center justify-center ${
                    finish === f ? "ring-2 ring-white scale-110 shadow-lg" : "opacity-60 hover:opacity-100"
                  }`}
                  title={`${f.toUpperCase()} Finish`}
                >
                  {finish === f && <Check className="w-3 h-3 text-slate-950 font-bold" />}
                </button>
              );
            })}
          </div>

          <div className={`hidden sm:block w-px h-8 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

          {/* Group 3: Camera Presets */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono uppercase font-bold mr-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Angles:
            </span>
            {(
              [
                { id: "front", label: "Front" },
                { id: "iso", label: "Iso" },
                { id: "top", label: "Top" },
                { id: "macro", label: "Core" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectCameraPreset(p.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                  cameraPreset === p.id
                    ? "bg-cyan-500 text-white shadow-sm"
                    : isDark
                    ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    : "bg-slate-100 border border-slate-300 text-slate-700 hover:text-black"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className={`hidden sm:block w-px h-8 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

          {/* Group 4: Rotation & Quick Auth Shortcut */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                autoRotate
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                  : isDark
                  ? "bg-slate-900 border-slate-800 text-slate-500"
                  : "bg-slate-100 border-slate-300 text-slate-500"
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin-slow" : ""}`} />
              <span className="hidden md:inline">{autoRotate ? "Spinning" : "Paused"}</span>
            </button>

            {/* Google Sign in or User Badge */}
            {user ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{user.displayName || "Verified"}</span>
              </div>
            ) : (
              <button
                onClick={handleGoogleQuickSignIn}
                disabled={googleLoading}
                className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white hover:border-cyan-400"
                    : "bg-white border-slate-300 text-slate-800 hover:border-slate-400 shadow-sm"
                }`}
                title="Sign in with Google"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{googleLoading ? "..." : "Google Sign-In"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
