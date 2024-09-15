/** @type {import('vite').UserConfig} */

import { randomBytes } from "node:crypto";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  html: { cspNonce: randomBytes(32).toString("base64") },
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  build: { cssMinify: "lightningcss", target: "esnext" },
  plugins: [
    remix({
      basename: "/",
      buildDirectory: "build",
      manifest: true,
      ignoredRouteFiles: ["**/*.css"],
      future: {},
      serverBuildFile: "index.ts",
      routes: (definedRoutes) => definedRoutes((route) => route),
    }),
  ],
});
