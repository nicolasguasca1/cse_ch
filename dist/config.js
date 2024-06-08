"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAP_ID = exports.CANDIDATE_ID = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CANDIDATE_ID = process.env.CANDIDATE_ID || "";
exports.MAP_ID = process.env.MAP_ID || "";
if (!exports.CANDIDATE_ID || !exports.MAP_ID) {
    throw new Error("Environment variables CANDIDATE_ID, and MAP_ID must be defined");
}
