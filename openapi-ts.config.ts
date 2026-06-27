import { defineConfig } from "@hey-api/openapi-ts";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  input: process.env.BACKEND_URL + "/openapi.json",
  output: "src/client-services",
  plugins: ["@hey-api/client-axios"],
});
