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
     * Process the goal grid data to generate requests for drawing objects.
     * @param goalGrid - The goal grid data.
     * @returns An object containing arrays of requests for each type of object.
     */
    static processGoalData(goalGrid) {
        const drawPolyRequests = [];
        const drawSoloonRequests = [];
        const drawComethRequests = [];
        const deleteRequests = [];
        for (let i = 0; i < goalGrid.length; i++) {
            for (let j = 0; j < goalGrid[i].length; j++) {
                const value = goalGrid[i][j];
                if (value === "POLYANET") {
                    drawPolyRequests.push({
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        candidateId: config_1.CANDIDATE_ID
                    });
                }
                else if ([
                    "WHITE_SOLOON",
                    "BLUE_SOLOON",
                    "PURPLE_SOLOON",
                    "RED_SOLOON"
                ].includes(value)) {
                    drawSoloonRequests.push({
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        color: value.split("_")[0].toLowerCase(),
                        candidateId: config_1.CANDIDATE_ID
                    });
                }
                else if (["UP_COMETH", "DOWN_COMETH", "LEFT_COMETH", "RIGHT_COMETH"].includes(value)) {
                    drawComethRequests.push({
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        direction: value.split("_")[0].toLowerCase(),
                        candidateId: config_1.CANDIDATE_ID
                    });
                }
                else if (value === "SPACE") {
                    deleteRequests.push({
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        candidateId: config_1.CANDIDATE_ID
                    });
                }
            }
        }
        return {
            drawPolyRequests,
            drawSoloonRequests,
            drawComethRequests,
            deleteRequests
        };
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
            const goalGrid = yield apiCaller_1.MegaverseService.getGoalGrid();
            const { drawPolyRequests, drawSoloonRequests, drawComethRequests, deleteRequests } = GridManager.processGoalData(goalGrid);
            for (const request of drawPolyRequests) {
                yield apiCaller_1.MegaverseService.makeApiCall(request);
                yield GridManager.delay(DELAY_MS);
            }
            for (const request of drawSoloonRequests) {
                yield apiCaller_1.MegaverseService.makeApiCall(request);
                yield GridManager.delay(DELAY_MS);
            }
            for (const request of drawComethRequests) {
                yield apiCaller_1.MegaverseService.makeApiCall(request);
                yield GridManager.delay(DELAY_MS);
            }
            console.log("Goal achieved!");
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
}
main().catch((error) => console.error(`Error: ${error.message}`));
