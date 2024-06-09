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
    // /**
    //  * Calculates positions to draw and delete in the grid.
    //  * @param currentGrid - The current grid state.
    //  * @param characterType - The type of character to draw.
    //  * @returns An object containing arrays of draw requests and delete requests.
    //  */
    // static calculateDrawAndDeletePositions(
    //   currentGrid: (string | null)[][],
    //   characterType: CharacterType
    // ): {
    //   drawPolyRequests: DrawPolyanetRequest[];
    //   deleteRequests: DrawPolyanetRequest[];
    // } {
    //   const drawPolyRequests: DrawPolyanetRequest[] = [];
    //   const deleteRequests: DrawPolyanetRequest[] = [];
    //   const start = 2;
    //   const end = 8;
    //   for (let i = 0; i < currentGrid.length; i++) {
    //     for (let j = 0; j < currentGrid[i].length; j++) {
    //       if (i >= start && i <= end && (i === j || j === end - (i - start))) {
    //         // These positions are part of the X pattern
    //         if (currentGrid[i][j] === null) {
    //           let drawPolyanetRequest = {
    //             _id: MAP_ID,
    //             row: i,
    //             column: j,
    //             candidateId: CANDIDATE_ID
    //           };
    //           drawPolyRequests.push(drawPolyanetRequest);
    //         }
    //       } else if (currentGrid[i][j] !== null) {
    //         // These positions should be empty
    //         let deleteRequest = {
    //           _id: MAP_ID,
    //           row: i,
    //           column: j,
    //           candidateId: CANDIDATE_ID
    //         };
    //         deleteRequests.push(deleteRequest);
    //       }
    //     }
    //   }
    //   return { drawPolyRequests, deleteRequests };
    // }
    // Static function to use the info from getGoalgrid and make api calls to draw and delete
    // the characters on the grid
    static processGoalData(goalGrid) {
        const drawPolyRequests = [];
        const drawSoloonRequests = [];
        const drawComethRequests = [];
        const deleteRequests = [];
        const start = 0;
        const end = 29;
        for (let i = 0; i < goalGrid.length; i++) {
            for (let j = 0; j < goalGrid[i].length; j++) {
                // if (i >= start && i <= end && (i === j || j === end - (i - start))) {
                // These positions are part of the X pattern
                if (goalGrid[i][j] === "POLYANET") {
                    let drawPolyanetRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawPolyRequests.push(drawPolyanetRequest);
                }
                else if (goalGrid[i][j] === "WHITE_SOLOON") {
                    let drawSoloonRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        color: "white",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawSoloonRequests.push(drawSoloonRequest);
                }
                else if (goalGrid[i][j] === "BLUE_SOLOON") {
                    let drawSoloonRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        color: "blue",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawSoloonRequests.push(drawSoloonRequest);
                }
                else if (goalGrid[i][j] === "PURPLE_SOLOON") {
                    let drawSoloonRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        color: "purple",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawSoloonRequests.push(drawSoloonRequest);
                }
                else if (goalGrid[i][j] === "RED_SOLOON") {
                    let drawSoloonRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        color: "red",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawSoloonRequests.push(drawSoloonRequest);
                }
                else if (goalGrid[i][j] === "UP_COMETH") {
                    let drawComethRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        direction: "up",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawComethRequests.push(drawComethRequest);
                }
                else if (goalGrid[i][j] === "DOWN_COMETH") {
                    let drawComethRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        direction: "down",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawComethRequests.push(drawComethRequest);
                }
                else if (goalGrid[i][j] === "LEFT_COMETH") {
                    let drawComethRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        direction: "left",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawComethRequests.push(drawComethRequest);
                }
                else if (goalGrid[i][j] === "RIGHT_COMETH") {
                    let drawComethRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        direction: "right",
                        candidateId: config_1.CANDIDATE_ID
                    };
                    drawComethRequests.push(drawComethRequest);
                }
                else if (goalGrid[i][j] === "SPACE") {
                    // These positions should be empty
                    let deleteRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        candidateId: config_1.CANDIDATE_ID
                    };
                    deleteRequests.push(deleteRequest);
                    // console.log("deleteRequests", deleteRequests);
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
            const characterType = "p";
            const { drawPolyRequests, drawSoloonRequests, drawComethRequests, deleteRequests } = GridManager.processGoalData(goalGrid);
            // const { drawPolyRequests, deleteRequests } =
            //   GridManager.calculateDrawAndDeletePositions(currentGrid, characterType);
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
            // for (const request of deleteRequests) {
            //   await MegaverseService.makeDeleteApiCall(request);
            //   await GridManager.delay(DELAY_MS);
            // }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
}
main().catch((error) => console.error(`Error: ${error.message}`));
