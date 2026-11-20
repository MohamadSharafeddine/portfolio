"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { LOGO_PATH } from "@/lib/logoPath";

export const TOTAL_STEPS = 480;
const BUILD_SECONDS = 7;
const HOLD_SECONDS = 4;
const RESET_SECONDS = 1.4;

const CHROME = new THREE.Color("#e9ebef");
const GLOW = new THREE.Color("#f3f6ff");
const STEEL = new THREE.Color("#b9bdc6");

function buildLogoGeometry() {
  const svg = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${LOGO_PATH}"/></svg>`);
  const shapes = svg.paths.flatMap((p) => p.toShapes());
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 70,
    bevelEnabled: true,
    bevelThickness: 6,
    bevelSize: 5,
    bevelSegments: 5,
    curveSegments: 18,
  });
  // SVG space is y-down. Flip y and z together: that is a rotation, so face winding stays correct
  // (flipping only y turns the mesh inside out). Scale 500 units to ~3.2 and stand it on y = 0.
  geo.scale(0.0075, -0.0075, -0.0075);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
  geo.computeBoundingBox();
  geo.computeVertexNormals();
  return geo;
}

export interface BuildHud {
  step: HTMLElement | null;
  percent: HTMLElement | null;
  bar: HTMLElement | null;
  status: HTMLElement | null;
}

export interface Framing {
  /** Where the logo's center sits, as a fraction of the frame (0 = left/top, 1 = right/bottom) */
  x: number;
  y: number;
  /** How much of the frame height the logo should span (capped so it never exceeds `maxW` of the width) */
  fill: number;
  maxW: number;
}

interface ChromeLogoProps {
  hud: React.RefObject<BuildHud>;
  /** Framing for landscape frames */
  wide: Framing;
  /** Framing for portrait (phone) frames */
  tall: Framing;
}

/**
 * The MS logo in polished chrome, built up slice by slice like a model generating its output.
 * Two world-space clipping planes split it at the current step: chrome below, a glowing
 * cross-section at the cut (back faces), and a wireframe ghost of what is still to come.
 */
export default function ChromeLogo({ hud, wide, tall }: ChromeLogoProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 1.1;

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

    // ---- Logo -----------------------------------------------------------------
    const geo = buildLogoGeometry();
    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const height = size.y;
    const part = new THREE.Group();
    scene.add(part);

    const clipBelow = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0); // keeps y <= h
    const clipAbove = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // keeps y >= h

    const chrome = new THREE.MeshPhysicalMaterial({
      color: CHROME,
      metalness: 1,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      clippingPlanes: [clipBelow],
    });
    // Fine machined grooves, one per generated slice, in world space
    chrome.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying float vSliceY;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSliceY = (modelMatrix * vec4(transformed, 1.0)).y;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vSliceY;")
        .replace(
          "#include <color_fragment>",
          "#include <color_fragment>\nfloat g = abs(fract(vSliceY * 52.0) - 0.5) * 2.0;\ndiffuseColor.rgb *= 0.9 + 0.1 * smoothstep(0.0, 0.3, g);"
        );
    };
    part.add(new THREE.Mesh(geo, chrome));

    // Back faces only show where the cut opens the solid: a bright cross-section
    part.add(
      new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: GLOW, side: THREE.BackSide, clippingPlanes: [clipBelow] }))
    );

    // Still to generate: wireframe ghost plus a whisper of surface
    part.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 30),
        new THREE.LineBasicMaterial({ color: STEEL, transparent: true, opacity: 0.42, clippingPlanes: [clipAbove] })
      )
    );
    part.add(
      new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          color: STEEL,
          transparent: true,
          opacity: 0.035,
          depthWrite: false,
          clippingPlanes: [clipAbove],
        })
      )
    );

    // ---- Scan plane at the current step -----------------------------------------
    const planeW = size.x + 0.5;
    const planeD = size.z + 1.2;
    const sheet = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW, planeD),
      new THREE.MeshBasicMaterial({
        color: GLOW,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    sheet.rotation.x = -Math.PI / 2;
    scene.add(sheet);
    const sheetFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(planeW, planeD)),
      new THREE.LineBasicMaterial({ color: GLOW, transparent: true, opacity: 0.35 })
    );
    sheetFrame.rotation.x = -Math.PI / 2;
    scene.add(sheetFrame);
    const scanLight = new THREE.PointLight(GLOW, 5, 4, 1.6);
    scene.add(scanLight);

    // ---- Lights ---------------------------------------------------------------------
    const key = new THREE.DirectionalLight("#ffffff", 2.2);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#cfd8ff", 3);
    rim.position.set(-4, 3, -4);
    scene.add(rim);

    // ---- Framing ----------------------------------------------------------------------
    let running = false;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      // Retina is capped at 1.5x and the drawing buffer at ~2.4 MP: chrome edges stay crisp,
      // and big screens don't pay for pixels nobody can see
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5, Math.sqrt(2.4e6 / (w * h))));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const f = camera.aspect >= 1 ? wide : tall;
      const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max(height / f.fill / (2 * halfTan), size.x / f.maxW / (2 * halfTan * camera.aspect), 4);
      const viewH = 2 * halfTan * dist;
      const viewW = viewH * camera.aspect;
      // Pan the camera so the logo's center lands at (f.x, f.y) of the frame
      const panX = (0.5 - f.x) * viewW;
      const panY = (f.y - 0.5) * viewH;
      const cy = height / 2;
      camera.position.set(panX, cy + panY + dist * 0.08, dist);
      camera.lookAt(panX, cy + panY, 0);
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- Interaction ------------------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // ---- Build loop ---------------------------------------------------------------------
    let lastStep = -1;
    let lastStatus = "";
    const setProgress = (p: number, status: string) => {
      const step = Math.max(0, Math.min(TOTAL_STEPS, Math.round(p * TOTAL_STEPS)));
      // quantize so the build visibly steps slice by slice
      const h = (Math.ceil(p * 96) / 96) * (height + 0.02);
      clipBelow.constant = h;
      clipAbove.constant = -h;
      sheet.position.y = sheetFrame.position.y = h;
      scanLight.position.set(0, h + 0.15, 0.9);
      const scanning = p > 0.001 && p < 0.999;
      sheet.visible = sheetFrame.visible = scanning;
      scanLight.intensity = scanning ? 5 : 0;

      const els = hud.current;
      if (els && (step !== lastStep || status !== lastStatus)) {
        if (els.step) els.step.textContent = String(step).padStart(3, "0");
        if (els.percent) els.percent.textContent = `${Math.round(p * 100)}%`;
        if (els.bar) els.bar.style.transform = `scaleX(${p})`;
        if (els.status) els.status.textContent = status;
        lastStep = step;
        lastStatus = status;
      }
    };

    let lastTime = 0;
    const cycle = BUILD_SECONDS + HOLD_SECONDS + RESET_SECONDS;
    let raf = 0;
    let elapsed = 0;

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;
      const t = elapsed % cycle;
      if (t < BUILD_SECONDS) setProgress(t / BUILD_SECONDS, "Generating");
      else if (t < BUILD_SECONDS + HOLD_SECONDS) setProgress(1, "Complete");
      else {
        const k = (t - BUILD_SECONDS - HOLD_SECONDS) / RESET_SECONDS;
        setProgress(1 - k * k * (3 - 2 * k), "New seed");
      }

      look.x += (pointer.x - look.x) * 0.05;
      look.y += (pointer.y - look.y) * 0.05;
      part.rotation.y = Math.sin(elapsed * 0.3) * 0.5 + look.x * 0.4;
      part.rotation.x = look.y * 0.05;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduceMotion) {
      setProgress(1, "Complete");
      part.rotation.y = -0.35;
    }

    // Only render while on screen and the tab is visible
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(mount);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((obj) => {
        const o = obj as THREE.Mesh;
        o.geometry?.dispose();
        const m = o.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [hud, wide, tall]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
