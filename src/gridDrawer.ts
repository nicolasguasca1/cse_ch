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

  /**
   * Process the goal grid data to generate requests for drawing objects.
   * @param goalGrid - The goal grid data.
   * @returns An object containing arrays of requests for each type of object.
   */
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

    for (let i = 0; i < goalGrid.length; i++) {
      for (let j = 0; j < goalGrid[i].length; j++) {
        const value = goalGrid[i][j];
        if (value === "POLYANET") {
          drawPolyRequests.push({
            _id: MAP_ID,
            row: i,
            column: j,
            candidateId: CANDIDATE_ID
          });
        } else if (
          [
            "WHITE_SOLOON",
            "BLUE_SOLOON",
            "PURPLE_SOLOON",
            "RED_SOLOON"
          ].includes(value)
        ) {
          drawSoloonRequests.push({
            _id: MAP_ID,
            row: i,
            column: j,
            color: value.split("_")[0].toLowerCase() as ColorType,
            candidateId: CANDIDATE_ID
          });
        } else if (
          ["UP_COMETH", "DOWN_COMETH", "LEFT_COMETH", "RIGHT_COMETH"].includes(
            value
          )
        ) {
          drawComethRequests.push({
            _id: MAP_ID,
            row: i,
            column: j,
            direction: value.split("_")[0].toLowerCase() as DirectionType,
            candidateId: CANDIDATE_ID
          });
        } else if (value === "SPACE") {
          deleteRequests.push({
            _id: MAP_ID,
            row: i,
            column: j,
            candidateId: CANDIDATE_ID
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
async function main(): Promise<void> {
  try {
    const goalGrid = await MegaverseService.getGoalGrid();
    const {
      drawPolyRequests,
      drawSoloonRequests,
      drawComethRequests,
      deleteRequests
    } = GridManager.processGoalData(goalGrid);

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
    console.log("Goal achieved!");
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main().catch((error) => console.error(`Error: ${(error as Error).message}`));
