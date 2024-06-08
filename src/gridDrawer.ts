import { PolyanetService, DrawRequest } from "./apiCaller";
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
   * Calculates positions to draw and delete in the grid.
   * @param currentGrid - The current grid state.
   * @param characterType - The type of character to draw.
   * @returns An object containing arrays of draw requests and delete requests.
   */
  static calculateDrawAndDeletePositions(
    currentGrid: (string | null)[][],
    characterType: CharacterType
  ): { drawRequests: DrawRequest[]; deleteRequests: DrawRequest[] } {
    const drawRequests: DrawRequest[] = [];
    const deleteRequests: DrawRequest[] = [];
    const start = 2;
    const end = 8;

    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[i].length; j++) {
        if (i >= start && i <= end && (i === j || j === end - (i - start))) {
          // These positions are part of the X pattern
          if (currentGrid[i][j] === null) {
            let drawRequest = {
              _id: MAP_ID,
              row: i,
              column: j,
              candidateId: CANDIDATE_ID
            };
            drawRequests.push(drawRequest);
          }
        } else if (currentGrid[i][j] !== null) {
          // These positions should be empty
          let deleteRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            candidateId: CANDIDATE_ID
          };
          deleteRequests.push(deleteRequest);
        }
      }
    }
    return { drawRequests, deleteRequests };
  }
}

/**
 * Main function to manage the grid operations.
 */
async function main(): Promise<void> {
  try {
    const currentGrid = await PolyanetService.getCurrentGrid();
    const characterType: CharacterType = "p";

    const { drawRequests, deleteRequests } =
      GridManager.calculateDrawAndDeletePositions(currentGrid, characterType);

    for (const request of deleteRequests) {
      await PolyanetService.makeDeleteApiCall(request);
      await GridManager.delay(DELAY_MS);
    }

    for (const request of drawRequests) {
      await PolyanetService.makeApiCall(request);
      await GridManager.delay(DELAY_MS);
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main().catch((error) => console.error(`Error: ${(error as Error).message}`));
