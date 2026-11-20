import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function config(phase: string): NextConfig {
  return {
    // `next dev` and `next build` get separate output folders. Sharing `.next` lets a build
    // delete files a running dev server is using, which then answers every request with a 500.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    images: {
      // The hero portrait uses 90; everything else uses the default 75
      qualities: [75, 90],
    },
  };
}
