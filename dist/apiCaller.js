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
exports.MegaverseService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
/**
 * Service for interacting with the Polyanet API.
 */
class MegaverseService {
    // // Type guard function to check if the parameter is of the type DrawSoloonRequest
    // static isDrawSoloon(
    //   request: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest
    // ): request is DrawPolyanetRequest {
    //   return (
    //     (request as DrawSoloonRequest).color !== undefined &&
    //     (request as DrawSoloonRequest).row !== undefined &&
    //     (request as DrawSoloonRequest).column !== undefined
    //   );
    // }
    // // Type guard function to check if the parameter is of the type DrawComethRequest
    // static isDrawCometh(
    //   request: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest
    // ): request is DrawPolyanetRequest {
    //   return (
    //     (request as DrawComethRequest).direction !== undefined &&
    //     (request as DrawComethRequest).row !== undefined &&
    //     (request as DrawComethRequest).column !== undefined
    //   );
    // }
    /**
     * Checks if a certain value already exists in the given position.
     * @param position - The position to check.
     * @returns A boolean indicating whether the position is already occupied.
     */
    static isOccupied(type, shapeReq, mapData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Implement the logic here to check if the position is occupied
            // This could involve making another API call or querying a database
            // For demonstration purposes, let's assume it always returns false
            // currentGrid = getCurrentGrid();
            const { row, column } = shapeReq;
            if (row === null ||
                column === null ||
                !mapData.content[row] ||
                !mapData.content[row][column]) {
                return false;
            }
            // const row = shapeReq.row;
            // const column = shapeReq.column;
            const typeGrid = (_a = mapData.content[row][column]) === null || _a === void 0 ? void 0 : _a.type;
            if (type === 0 && typeGrid === 0) {
                console.log(`Skipping...position already has a Polyanet: (${row}, ${column})`);
                return true;
            }
            else if (type === 1 && typeGrid === 1) {
                console.log(`Skipping...position already has a Soloon: (${row}, ${column})`);
                return true;
            }
            else if (type === 2 && typeGrid === 2) {
                console.log(`Skipping...position already has a Cometh: (${row}, ${column})`);
                return true;
            }
            else if (type === null && typeGrid === null) {
                console.log(`Skipping...position already has a Cometh: (${row}, ${column})`);
                return true;
            }
            else {
                return false;
            }
        });
    }
    static getCurrentGrid() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.MAP_URL);
                const mapData = response.data.map;
                return mapData !== undefined ? mapData : null;
            }
            catch (error) {
                console.error(`Failed to get current grid: ${error}`);
                return null;
            }
        });
    }
    /**
     * Makes an API call to create a Polyanet.
     * @param shapeReq - The draw request object containing position and candidate information.
     */
    static makeApiCall(shapeReq) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.retry(() => __awaiter(this, void 0, void 0, function* () {
                const mapData = yield this.getCurrentGrid();
                if (!mapData) {
                    throw new Error("Failed to retrieve the current map data.");
                }
                // Check if the position is already occupied
                let response;
                // let isOcupied = await this.isOccupied(0, shapeReq, mapData);
                // Make a different API call depending on the request type with a conditional
                if ("color" in shapeReq &&
                    !(yield this.isOccupied(1, shapeReq, mapData))) {
                    response = yield axios_1.default.post(this.SOLOONS_URL, shapeReq, {
                        headers: this.HEADERS
                    });
                    if (response.status === 200) {
                        console.log(`Successfully placed soloon (${shapeReq.row}, ${shapeReq.column})`);
                    }
                    else {
                        console.error(`Failed to place soloon: ${response.status}`);
                    }
                }
                else if ("direction" in shapeReq &&
                    !(yield this.isOccupied(2, shapeReq, mapData))) {
                    response = yield axios_1.default.post(this.COMETH_URL, shapeReq, {
                        headers: this.HEADERS
                    });
                    if (response.status === 200) {
                        console.log(`Successfully placed cometh (${shapeReq.row}, ${shapeReq.column})`);
                    }
                    else {
                        console.error(`Failed to place cometh: ${response.status}`);
                    }
                }
                else if (!(yield this.isOccupied(0, shapeReq, mapData))) {
                    response = yield axios_1.default.post(this.POLYANET_URL, shapeReq, {
                        headers: this.HEADERS
                    });
                    if (response.status === 200) {
                        console.log(`Successfully placed polyanet (${shapeReq.row}, ${shapeReq.column})`);
                    }
                    else {
                        console.error(`Failed to place polyanet: ${response.status}`);
                    }
                }
            }));
        });
    }
    /**
     * Makes an API call to delete a Polyanet.
     * @param drawPolyanetRequest - The draw request object containing position and candidate information.
     */
    static makeDeleteApiCall(drawPolyanetRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.retry(() => __awaiter(this, void 0, void 0, function* () {
                const { row, column } = drawPolyanetRequest;
                const mapData = yield this.getCurrentGrid();
                if (!mapData) {
                    throw new Error("Failed to retrieve the current map data.");
                }
                if (!(yield this.isOccupied(null, drawPolyanetRequest, mapData))) {
                    // skip if the position is already empty
                    console.log(`Skipping...position already has a SPACE: (${row}, ${column})`);
                    return;
                }
                const response = yield axios_1.default.delete(this.POLYANET_URL, {
                    data: drawPolyanetRequest,
                    headers: this.HEADERS
                });
                if (response.status === 200) {
                    console.log(`Successfully deleted (${drawPolyanetRequest.row}, ${drawPolyanetRequest.column})`);
                }
                else {
                    console.error(`Failed to delete character: ${response.status}`);
                }
            }));
        });
    }
    /**
     * Retrieves the goald grid from the API.
     * @returns A promise that resolves to a 2D array representing the goal grid.
     */
    static getGoalGrid() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.retry(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(this.GOAL_MAP_URL);
                if (response.status === 200) {
                    return response.data.goal;
                }
                else {
                    throw new Error(`Failed to get goal grid: ${response.status}`);
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
exports.MegaverseService = MegaverseService;
MegaverseService.POLYANET_URL = "https://challenge.crossmint.io/api/polyanets";
MegaverseService.SOLOONS_URL = "https://challenge.crossmint.io/api/soloons";
MegaverseService.COMETH_URL = "https://challenge.crossmint.io/api/comeths";
MegaverseService.MAP_URL = `https://challenge.crossmint.io/api/map/${config_1.CANDIDATE_ID}`;
MegaverseService.GOAL_MAP_URL = `https://challenge.crossmint.io/api/map/${config_1.CANDIDATE_ID}/goal`;
MegaverseService.HEADERS = { "Content-Type": "application/json" };
