"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteApiCall = exports.getCurrentGrid = exports.makeApiCall = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
// interface ApiResponse {
//   map: {
//     _id: string;
//     content: Array<Array<{ type?: number } | null>>;
//     candidateId: string;
//   };
// }
function makeApiCall(drawRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        const postUrl = "https://challenge.crossmint.io/api/polyanets"; // Replace with the actual API endpoint
        const headers = {
            "Content-Type": "application/json"
        };
        let jsonRequest = JSON.stringify(drawRequest);
        try {
            const response = yield axios_1.default.post(postUrl, jsonRequest, { headers });
            if (response.status === 200) {
                const data = response.data;
                console.log(`Successfully placed (${drawRequest.row}, ${drawRequest.column})`);
            }
            else {
                console.error(`Failed to place character: ${response.status}`);
            }
        }
        catch (error) {
            console.error(`Error making API call: ${error.message}`);
        }
    });
}
exports.makeApiCall = makeApiCall;
function makeDeleteApiCall(drawRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteUrl = "https://challenge.crossmint.io/api/polyanets";
        const headers = {
            "Content-Type": "application/json"
        };
        let jsonRequest = JSON.stringify(drawRequest);
        console.log("deleteRequest4", jsonRequest);
        try {
            const response = yield axios_1.default.delete(deleteUrl, {
                data: jsonRequest,
                headers
            });
            if (response.status === 200) {
                const data = response.data;
                console.log(`Successfully deleted (${drawRequest.row}, ${drawRequest.column})`);
            }
            else {
                console.error(`Failed to delete character: ${response.status}`);
            }
        }
        catch (error) {
            console.error(`Error making delete API call: ${error.message}`);
        }
    });
}
exports.makeDeleteApiCall = makeDeleteApiCall;
const apiUrl = "https://challenge.crossmint.io/api/map";
function getCurrentGrid() {
    return __awaiter(this, void 0, void 0, function* () {
        // const url = `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}`;
        try {
            // const response = await axios.get<ApiResponse>(`${apiUrl}/${CANDIDATE_ID}`);
            const response = yield axios_1.default.get(`${apiUrl}/${config_1.CANDIDATE_ID}`);
            if (response.status === 200) {
                return response.data.map.content;
            }
            else {
                throw new Error(`Failed to get current grid: ${response.status}`);
            }
        }
        catch (error) {
            console.error(`Error getting current grid: ${error.message}`);
            throw error;
        }
    });
}
exports.getCurrentGrid = getCurrentGrid;
