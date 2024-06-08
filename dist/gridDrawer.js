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
class GridManager {
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    static calculateDeletePositions(currentGrid) {
        const deleteRequests = [];
        const start = 2;
        const end = 8;
        for (let i = 0; i < currentGrid.length; i++) {
            for (let j = 0; j < currentGrid[i].length; j++) {
                if (i >= start && i <= end && (i === j || j === end - (i - start))) {
                    continue; // These positions are part of the X pattern
                }
                else if (currentGrid[i][j] !== null) {
                    let deleteRequest = {
                        _id: config_1.MAP_ID,
                        row: i,
                        column: j,
                        candidateId: config_1.CANDIDATE_ID
                    };
                    deleteRequests.push(deleteRequest);
                    console.log("Delete request:", deleteRequest);
                }
            }
        }
        return deleteRequests;
    }
    static calculateXPositions(characterType, currentGrid) {
        const drawRequests = [[], []];
        const start = 2;
        const end = 8;
        for (let i = start; i <= end; i++) {
            if (currentGrid[i][i] == null) {
                let drawRequest = {
                    _id: config_1.MAP_ID,
                    row: i,
                    column: i,
                    candidateId: config_1.CANDIDATE_ID
                };
                drawRequests[0].push(drawRequest);
            }
            if (currentGrid[i][end - (i - start)] == null) {
                let drawRequest = {
                    _id: config_1.MAP_ID,
                    row: i,
                    column: end - (i - start),
                    candidateId: config_1.CANDIDATE_ID
                };
                drawRequests[1].push(drawRequest);
            }
        }
        return drawRequests;
    }
}
GridManager.GRID_SIZE = GRID_SIZE;
GridManager.DELAY_MS = DELAY_MS;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentGrid = yield apiCaller_1.PolyanetService.getCurrentGrid();
            const characterType = "p";
            const deleteRequests = GridManager.calculateDeletePositions(currentGrid);
            for (const request of deleteRequests) {
                yield apiCaller_1.PolyanetService.makeDeleteApiCall(request);
                yield GridManager.delay(DELAY_MS);
            }
            const drawRequests = GridManager.calculateXPositions(characterType, currentGrid);
            for (const subarray of drawRequests) {
                for (const request of subarray) {
                    yield apiCaller_1.PolyanetService.makeApiCall(request);
                    yield GridManager.delay(DELAY_MS);
                }
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
}
main().catch((error) => console.error(`Error: ${error.message}`));
