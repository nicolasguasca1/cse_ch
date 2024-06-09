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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaverseService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
/**
 * Service for interacting with the Polyanet API.
 */
class MegaverseService {
    /**
     * Check if a specific position is occupied.
     * @param type - The type of object to check.
     * @param shapeReq - The request data containing row and column.
     * @param mapData - The current map data.
     * @returns A promise that resolves to a boolean indicating if the position is occupied.
     */
    static isOccupied(type, shapeReq, mapData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _b;
            const { row, column } = shapeReq;
            if (row === null ||
                column === null ||
                !mapData.content[row] ||
                !mapData.content[row][column]) {
                return false;
            }
            // const row = shapeReq.row;
            // const column = shapeReq.column;
            const typeGrid = (_b = mapData.content[row][column]) === null || _b === void 0 ? void 0 : _b.type;
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
                console.log(`Skipping...position already has a Space: (${row}, ${column})`);
                return true;
            }
            else {
                return false;
            }
        });
    }
    /**
     * Get the current grid data from the API.
     * @returns A promise that resolves to the current grid data.
     */
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
                // Refactored into separate methods for clarity
                if ("color" in shapeReq &&
                    !(yield this.isOccupied(1, shapeReq, mapData))) {
                    yield this.placeSoloon(shapeReq);
                }
                else if ("direction" in shapeReq &&
                    !(yield this.isOccupied(2, shapeReq, mapData))) {
                    yield this.placeCometh(shapeReq);
                }
                else if (!(yield this.isOccupied(0, shapeReq, mapData))) {
                    yield this.placePolyanet(shapeReq);
                }
            }));
        });
    }
    /**
     * Place a soloon on the grid.
     * @param request - The request data for the soloon.
     */
    static placeSoloon(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(this.SOLOONS_URL, request, {
                headers: this.HEADERS
            });
            if (response.status === 200) {
                console.log(`Successfully placed soloon (${request.row}, ${request.column})`);
            }
            else {
                console.error(`Failed to place soloon: ${response.status}`);
            }
        });
    }
    /**
     * Place a cometh on the grid.
     * @param request - The request data for the cometh.
     */
    static placeCometh(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(this.COMETH_URL, request, {
                headers: this.HEADERS
            });
            if (response.status === 200) {
                console.log(`Successfully placed cometh (${request.row}, ${request.column})`);
            }
            else {
                console.error(`Failed to place cometh: ${response.status}`);
            }
        });
    }
    /**
     * Place a polyanet on the grid.
     * @param request - The request data for the polyanet.
     */
    static placePolyanet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(this.POLYANET_URL, request, {
                headers: this.HEADERS
            });
            if (response.status === 200) {
                console.log(`Successfully placed polyanet (${request.row}, ${request.column})`);
            }
            else {
                console.error(`Failed to place polyanet: ${response.status}`);
            }
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
_a = MegaverseService;
MegaverseService.CROSS_URL = `https://challenge.crossmint.io/api`;
MegaverseService.POLYANET_URL = `${_a.CROSS_URL}/polyanets`;
// "https://challenge.crossmint.io/api/polyanets";
MegaverseService.SOLOONS_URL = `${_a.CROSS_URL}/soloons`;
// "https://challenge.crossmint.io/api/soloons";
MegaverseService.COMETH_URL = `${_a.CROSS_URL}/comeths`;
// "https://challenge.crossmint.io/api/comeths";
MegaverseService.MAP_URL = `${_a.CROSS_URL}/map/${config_1.CANDIDATE_ID}`;
// `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}`;
MegaverseService.GOAL_MAP_URL = `${_a.CROSS_URL}/map/${config_1.CANDIDATE_ID}/goal`;
// `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}/goal`;
MegaverseService.HEADERS = { "Content-Type": "application/json" };
