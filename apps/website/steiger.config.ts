import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // shared/ is sliceless — public-api and insignificant-slice rules target slices, not segments
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
      "fsd/insignificant-slice": "off",
    },
  },
  {
    // app/ has no slices by FSD convention — suppresses false positive
    files: ["./src/app/**"],
    rules: {
      "fsd/no-segmentless-slices": "off",
    },
  },
  {
    // features/ and widgets/ use flat single-file slices (no segments) by design
    files: ["./src/features/**", "./src/widgets/**"],
    rules: {
      "fsd/no-segmentless-slices": "off",
    },
  },
  {
    // entities/ slices are referenced via explicit index.ts paths that steiger can't resolve
    files: ["./src/entities/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
