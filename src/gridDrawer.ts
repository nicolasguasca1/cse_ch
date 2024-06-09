import {
  MegaverseService,
  DrawPolyanetRequest,
  DrawSoloonRequest,
  DrawComethRequest,
  ValueType,
  ColorType,
  DirectionType
} from "./apiCaller";
import { CANDIDATE_ID, MAP_ID } from "./config";

type CharacterType = "p" | "s" | "c";

const GRID_SIZE = 11;
const DELAY_MS = 1000;

/**
 * Manager for grid operations including drawing and deleting positions.
 */
class GridManager {
  private static readonly GRID_SIZE = GRID_SIZE;
  private static readonly DELAY_MS = DELAY_MS;

  /**
   * Delays execution for a specified number of milliseconds.
   * @param ms - The number of milliseconds to delay.
   * @returns A promise that resolves after the specified delay.
   */
  static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
  static processGoalData(goalGrid: ValueType[][]): {
    drawPolyRequests: DrawPolyanetRequest[];
    drawSoloonRequests: DrawSoloonRequest[];
    drawComethRequests: DrawComethRequest[];
    deleteRequests: DrawPolyanetRequest[];
  } {
    const drawPolyRequests: DrawPolyanetRequest[] = [];
    const drawSoloonRequests: DrawSoloonRequest[] = [];
    const drawComethRequests: DrawComethRequest[] = [];
    const deleteRequests: DrawPolyanetRequest[] = [];
    const start = 0;
    const end = 29;

    for (let i = 0; i < goalGrid.length; i++) {
      for (let j = 0; j < goalGrid[i].length; j++) {
        // if (i >= start && i <= end && (i === j || j === end - (i - start))) {
        // These positions are part of the X pattern
        if (goalGrid[i][j] === "POLYANET") {
          let drawPolyanetRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            candidateId: CANDIDATE_ID
          };
          drawPolyRequests.push(drawPolyanetRequest);
        } else if (goalGrid[i][j] === "WHITE_SOLOON") {
          let drawSoloonRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            color: "white" as ColorType,
            candidateId: CANDIDATE_ID
          };
          drawSoloonRequests.push(drawSoloonRequest);
        } else if (goalGrid[i][j] === "BLUE_SOLOON") {
          let drawSoloonRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            color: "blue" as ColorType,
            candidateId: CANDIDATE_ID
          };
          drawSoloonRequests.push(drawSoloonRequest);
        } else if (goalGrid[i][j] === "PURPLE_SOLOON") {
          let drawSoloonRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            color: "purple" as ColorType,
            candidateId: CANDIDATE_ID
          };
          drawSoloonRequests.push(drawSoloonRequest);
        } else if (goalGrid[i][j] === "RED_SOLOON") {
          let drawSoloonRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            color: "red" as ColorType,
            candidateId: CANDIDATE_ID
          };
          drawSoloonRequests.push(drawSoloonRequest);
        } else if (goalGrid[i][j] === "UP_COMETH") {
          let drawComethRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            direction: "up" as DirectionType,
            candidateId: CANDIDATE_ID
          };
          drawComethRequests.push(drawComethRequest);
        } else if (goalGrid[i][j] === "DOWN_COMETH") {
          let drawComethRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            direction: "down" as DirectionType,
            candidateId: CANDIDATE_ID
          };
          drawComethRequests.push(drawComethRequest);
        } else if (goalGrid[i][j] === "LEFT_COMETH") {
          let drawComethRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            direction: "left" as DirectionType,
            candidateId: CANDIDATE_ID
          };
          drawComethRequests.push(drawComethRequest);
        } else if (goalGrid[i][j] === "RIGHT_COMETH") {
          let drawComethRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            direction: "right" as DirectionType,
            candidateId: CANDIDATE_ID
          };
          drawComethRequests.push(drawComethRequest);
        } else if (goalGrid[i][j] === "SPACE") {
          // These positions should be empty
          let deleteRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            candidateId: CANDIDATE_ID
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

/**
 * Main function to manage the grid operations.
 */
async function main(): Promise<void> {
  try {
    const goalGrid = await MegaverseService.getGoalGrid();
    const characterType: CharacterType = "p";

    const {
      drawPolyRequests,
      drawSoloonRequests,
      drawComethRequests,
      deleteRequests
    } = GridManager.processGoalData(goalGrid);

    // const { drawPolyRequests, deleteRequests } =
    //   GridManager.calculateDrawAndDeletePositions(currentGrid, characterType);

    for (const request of drawPolyRequests) {
      await MegaverseService.makeApiCall(request);
      await GridManager.delay(DELAY_MS);
    }

    for (const request of drawSoloonRequests) {
      await MegaverseService.makeApiCall(request);
      await GridManager.delay(DELAY_MS);
    }

    for (const request of drawComethRequests) {
      await MegaverseService.makeApiCall(request);
      await GridManager.delay(DELAY_MS);
    }

    // for (const request of deleteRequests) {
    //   await MegaverseService.makeDeleteApiCall(request);
    //   await GridManager.delay(DELAY_MS);
    // }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main().catch((error) => console.error(`Error: ${(error as Error).message}`));
