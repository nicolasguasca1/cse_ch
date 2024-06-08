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
exports.PolyanetService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
/**
 * Service for interacting with the Polyanet API.
 */
class PolyanetService {
    /**
     * Makes an API call to create a Polyanet.
     * @param drawRequest - The draw request object containing position and candidate information.
     */
    static makeApiCall(drawRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.retry(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.post(this.API_URL, drawRequest, {
                    headers: this.HEADERS
                });
                if (response.status === 200) {
                    console.log(`Successfully placed (${drawRequest.row}, ${drawRequest.column})`);
                }
                else {
                    console.error(`Failed to place character: ${response.status}`);
                }
            }));
        });
    }
    /**
     * Makes an API call to delete a Polyanet.
     * @param drawRequest - The draw request object containing position and candidate information.
     */
    static makeDeleteApiCall(drawRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.retry(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.delete(this.API_URL, {
                    data: drawRequest,
                    headers: this.HEADERS
                });
                if (response.status === 200) {
                    console.log(`Successfully deleted (${drawRequest.row}, ${drawRequest.column})`);
                }
                else {
                    console.error(`Failed to delete character: ${response.status}`);
                }
            }));
        });
    }
    /**
     * Retrieves the current grid from the API.
     * @returns A promise that resolves to a 2D array representing the current grid.
     */
    static getCurrentGrid() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.retry(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(this.MAP_URL);
                if (response.status === 200) {
                    return response.data.map.content;
                }
                else {
                    throw new Error(`Failed to get current grid: ${response.status}`);
                }
            }));
        });
    }
    /**
     * Retries a function in case of failure.
     * @param fn - The function to retry.
     * @param retries - The number of retries.
     * @param delay - The delay between retries in milliseconds.
     * @returns A promise that resolves to the result of the function.
     */
    static retry(fn_1) {
        return __awaiter(this, arguments, void 0, function* (fn, retries = 3, delay = 1000) {
            try {
                return yield fn();
            }
            catch (error) {
                if (retries > 0) {
                    console.warn(`Retrying... attempts left: ${retries - 1}`);
                    yield new Promise((res) => setTimeout(res, delay));
                    return this.retry(fn, retries - 1, delay);
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.PolyanetService = PolyanetService;
PolyanetService.API_URL = "https://challenge.crossmint.io/api/polyanets";
PolyanetService.MAP_URL = `https://challenge.crossmint.io/api/map/${config_1.CANDIDATE_ID}`;
PolyanetService.HEADERS = { "Content-Type": "application/json" };
