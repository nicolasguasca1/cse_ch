import dotenv from "dotenv";
dotenv.config();

export const CANDIDATE_ID = process.env.CANDIDATE_ID || "";
export const MAP_ID = process.env.MAP_ID || "";

if (!CANDIDATE_ID || !MAP_ID) {
  throw new Error(
    "Environment variables CANDIDATE_ID, and MAP_ID must be defined"
  );
}
