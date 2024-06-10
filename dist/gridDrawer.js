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
// type CharacterType = "p" | "s" | "c";
// const GRID_SIZE = 11;
/**
 * Manager for grid operations including drawing and deleting positions.
 */
class GridManager {
    // private static readonly GRID_SIZE = GRID_SIZE;
    /**
     * Process the goal grid data to generate requests for drawing objects.
     * @param goalGrid - The goal grid data.
     * @returns An object containing arrays of requests for each type of object.
     */
    static processGoalData(goalGrid, mapData) {
        var _a;
        const drawPolyRequests = [];
        const drawSoloonRequests = [];
        const drawComethRequests = [];
        const deleteRequests = [];
        for (let i = 0; i < goalGrid.length; i++) {
            for (let j = 0; j < goalGrid[i].length; j++) {
                const typeGrid = (_a = mapData.content[i][j]) === null || _a === void 0 ? void 0 : _a.type;
                const value = goalGrid[i][j];
                if (value === "POLYANET" && typeGrid !== 0) {
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
                ].includes(value) &&
                    typeGrid !== 1) {
                    drawSoloonRequests.push({
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        color: value.split("_")[0].toLowerCase(),
                        candidateId: config_1.CANDIDATE_ID
                    });
                }
                else if (["UP_COMETH", "DOWN_COMETH", "LEFT_COMETH", "RIGHT_COMETH"].includes(value) &&
                    typeGrid !== 2) {
                    drawComethRequests.push({
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        direction: value.split("_")[0].toLowerCase(),
                        candidateId: config_1.CANDIDATE_ID
                    });
                }
                else if (value === "SPACE" && typeGrid !== undefined) {
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
/**
 * Main function to manage the grid operations.
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mapData = yield apiCaller_1.MegaverseService.getCurrentGrid();
            const goalGrid = yield apiCaller_1.MegaverseService.getGoalGrid();
            const { drawPolyRequests, drawSoloonRequests, drawComethRequests, deleteRequests } = GridManager.processGoalData(goalGrid, mapData);
            // console.log("drawPolyRequests:", drawPolyRequests);
            // console.log("drawSoloonRequests:", drawSoloonRequests);
            // console.log("drawComethRequests:", drawComethRequests);
            // console.log("deleteRequests:", deleteRequests);
            // return;
            // for (const requestDelete of deleteRequests) {
            //   await MegaverseService.makeDeleteApiCall(requestDelete);
            //   await GridManager.delay(DELAY_MS);
            // }
            // for (const requestPoly of drawPolyRequests) {
            //   await MegaverseService.makeApiCall(requestPoly, mapData);
            //   // await GridManager.delay(DELAY_MS);
            // }
            // for (const requestSoloon of drawSoloonRequests) {
            //   await MegaverseService.makeApiCall(requestSoloon, mapData);
            //   // await GridManager.delay(DELAY_MS);
            // }
            // for (const requestCometh of drawComethRequests) {
            //   await MegaverseService.makeApiCall(requestCometh, mapData);
            //   // await GridManager.delay(DELAY_MS);
            // }
            // Helper function to process requests sequentially
            const processRequestsSequentially = (requests, apiCallFn) => __awaiter(this, void 0, void 0, function* () {
                for (const request of requests) {
                    yield apiCallFn(request, mapData);
                }
            });
            // // Execute deleteRequests
            // await processRequestsSequentially(
            //   deleteRequests,
            //   MegaverseService.makeDeleteApiCall
            // );
            // Execute drawPolyRequests
            yield processRequestsSequentially(drawPolyRequests, (request) => apiCaller_1.MegaverseService.makeApiCall(request, mapData));
            // Execute drawSoloonRequests
            yield processRequestsSequentially(drawSoloonRequests, (request) => apiCaller_1.MegaverseService.makeApiCall(request, mapData));
            // Execute drawComethRequests
            yield processRequestsSequentially(drawComethRequests, (request) => apiCaller_1.MegaverseService.makeApiCall(request, mapData));
            console.log("Goal achieved!");
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
}
main().catch((error) => console.error(`Error: ${error.message}`));
