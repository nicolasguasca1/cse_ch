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
// import inquirer from "inquirer";
const config_1 = require("./config");
const apiCaller_1 = require("./apiCaller");
const GRID_SIZE = 11;
// async function getCharacterType(): Promise<CharacterType> {
//   const answers = await inquirer.prompt([
//     {
//       type: "list",
//       name: "characterType",
//       message: "Select the type of character to use:",
//       choices: ["POLYanets: p", "SOLoons: s", "comETHs: c"]
//     }
//   ]);
//   return answers.characterType as CharacterType;
// }
// interface DrawRequest {
//   id: string;
//   row: number;
//   column: number;
//   candidateId: string;
//   character: number;
// }
// Build a dummy dRAW request
let drawRequestTemplate = {
    _id: config_1.MAP_ID,
    row: null,
    column: null,
    candidateId: config_1.CANDIDATE_ID
    // character: 0
};
const characteriType = "p";
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function calculateDeletePositions(currentGrid) {
    const deleteRequests = [];
    const start = 2;
    const end = 8;
    for (let i = 0; i < currentGrid.length; i++) {
        for (let j = 0; j < currentGrid[i].length; j++) {
            if (i >= start && i <= end && (i === j || j === end - (i - start))) {
                // These positions are part of the X pattern
                continue;
            }
            else if (currentGrid[i][j] !== null) {
                // These positions should be empty
                let deleteRequest = Object.assign(Object.assign({}, drawRequestTemplate), { row: i, column: j });
                deleteRequests.push(deleteRequest);
                console.log("Delete request:", deleteRequest);
            }
        }
    }
    return deleteRequests;
}
function calculateXPositions(characterType, currentGrid) {
    const drawRequests = [[], []];
    console.log("currentGrid", currentGrid);
    // console current drawRequest
    const topLeft = 0;
    const bottomRight = 10;
    // Coordinates for the X shape, starting from C3 (2, 2) to I9 (8, 8)
    const start = 2; // This corresponds to 'C' in 0-indexed grid
    const end = 8; // This corresponds to 'I' in 0-indexed grid
    for (let i = start; i <= end; i++) {
        if (currentGrid[i][i] == null) {
            //Adjust drawRequest to match the current grid
            let drawRequest = Object.assign(Object.assign({}, drawRequestTemplate), { row: i, column: i });
            drawRequests[0].push(drawRequest);
            // Primary diagonal
        }
        if (currentGrid[i][end - (i - start)] == null) {
            let drawRequest = Object.assign(Object.assign({}, drawRequestTemplate), { row: i, column: end - (i - start) });
            //Push to drawRequests
            drawRequests[1].push(drawRequest);
            // // Secondary diagonal
            // drawRequests.push({
            //   x: i,
            //   y: end - (i - start),
            //   character: characterType
            // });
        }
    }
    return drawRequests;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentGrid = yield (0, apiCaller_1.getCurrentGrid)();
            // const characterType = await getCharacterType();
            const characterType = characteriType;
            const deleteRequests = calculateDeletePositions(currentGrid);
            for (const request of deleteRequests) {
                yield (0, apiCaller_1.makeDeleteApiCall)(request);
                yield delay(1000);
            }
            const drawRequests = calculateXPositions(characterType, currentGrid);
            for (const subarray of drawRequests) {
                for (const request of subarray) {
                    yield (0, apiCaller_1.makeApiCall)(request);
                    yield delay(1000);
                }
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
}
main().catch((error) => console.error(`Error: ${error.message}`));
