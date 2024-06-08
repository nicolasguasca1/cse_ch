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
Object.defineProperty(exports, "__esModule", { value: true });
const apiCaller_1 = require("./apiCaller");
const config_1 = require("./config");
const GRID_SIZE = 11;
const DELAY_MS = 1000;
/**
 * Manager for grid operations including drawing and deleting positions.
 */
class GridManager {
    /**
     * Delays execution for a specified number of milliseconds.
     * @param ms - The number of milliseconds to delay.
     * @returns A promise that resolves after the specified delay.
     */
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    /**
     * Calculates positions to draw and delete in the grid.
     * @param currentGrid - The current grid state.
     * @param characterType - The type of character to draw.
     * @returns An object containing arrays of draw requests and delete requests.
     */
    static calculateDrawAndDeletePositions(currentGrid, characterType) {
        const drawRequests = [];
        const deleteRequests = [];
        const start = 2;
        const end = 8;
        for (let i = 0; i < currentGrid.length; i++) {
            for (let j = 0; j < currentGrid[i].length; j++) {
                if (i >= start && i <= end && (i === j || j === end - (i - start))) {
                    // These positions are part of the X pattern
                    if (currentGrid[i][j] === null) {
                        let drawRequest = {
                            _id: config_1.MAP_ID,
                            row: i,
                            column: j,
                            candidateId: config_1.CANDIDATE_ID
                        };
                        drawRequests.push(drawRequest);
                    }
                }
                else if (currentGrid[i][j] !== null) {
                    // These positions should be empty
                    let deleteRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        candidateId: config_1.CANDIDATE_ID
                    };
                    deleteRequests.push(deleteRequest);
                }
            }
        }
        return { drawRequests, deleteRequests };
    }
}
GridManager.GRID_SIZE = GRID_SIZE;
GridManager.DELAY_MS = DELAY_MS;
/**
 * Main function to manage the grid operations.
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentGrid = yield apiCaller_1.PolyanetService.getCurrentGrid();
            const characterType = "p";
            const { drawRequests, deleteRequests } = GridManager.calculateDrawAndDeletePositions(currentGrid, characterType);
            for (const request of deleteRequests) {
                yield apiCaller_1.PolyanetService.makeDeleteApiCall(request);
                yield GridManager.delay(DELAY_MS);
            }
            for (const request of drawRequests) {
                yield apiCaller_1.PolyanetService.makeApiCall(request);
                yield GridManager.delay(DELAY_MS);
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
}
main().catch((error) => console.error(`Error: ${error.message}`));
