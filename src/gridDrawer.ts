// import inquirer from "inquirer";
import { CANDIDATE_ID, MAP_ID } from "./config";
import {
  makeApiCall,
  getCurrentGrid,
  DrawRequest,
  makeDeleteApiCall
} from "./apiCaller";

const GRID_SIZE = 11;

type CharacterType = "p" | "s" | "c";

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
let drawRequestTemplate: DrawRequest = {
  _id: MAP_ID,
  row: null,
  column: null,
  candidateId: CANDIDATE_ID
  // character: 0
};

const characteriType: CharacterType = "p";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateDeletePositions(
  currentGrid: (string | null)[][]
): DrawRequest[] {
  const deleteRequests: DrawRequest[] = [];
  const start = 2;
  const end = 8;

  for (let i = 0; i < currentGrid.length; i++) {
    for (let j = 0; j < currentGrid[i].length; j++) {
      if (i >= start && i <= end && (i === j || j === end - (i - start))) {
        // These positions are part of the X pattern
        continue;
      } else if (currentGrid[i][j] !== null) {
        // These positions should be empty
        let deleteRequest = { ...drawRequestTemplate, row: i, column: j };
        deleteRequests.push(deleteRequest);
        console.log("Delete request:", deleteRequest);
      }
    }
  }

  return deleteRequests;
}

function calculateXPositions(
  characterType: CharacterType,
  currentGrid: (string | null)[][]
): DrawRequest[][] {
  const drawRequests: DrawRequest[][] = [[], []];
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
      let drawRequest = { ...drawRequestTemplate, row: i, column: i };
      drawRequests[0].push(drawRequest);
      // Primary diagonal
    }
    if (currentGrid[i][end - (i - start)] == null) {
      let drawRequest = {
        ...drawRequestTemplate,
        row: i,
        column: end - (i - start)
      };
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

async function main(): Promise<void> {
  try {
    const currentGrid = await getCurrentGrid();
    // const characterType = await getCharacterType();
    const characterType = characteriType;

    const deleteRequests = calculateDeletePositions(currentGrid);
    for (const request of deleteRequests) {
      await makeDeleteApiCall(request);
      await delay(1000);
    }

    const drawRequests = calculateXPositions(characterType, currentGrid);

    for (const subarray of drawRequests) {
      for (const request of subarray) {
        await makeApiCall(request);
        await delay(1000);
      }
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main().catch((error) => console.error(`Error: ${(error as Error).message}`));
