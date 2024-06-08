import { PolyanetService, DrawRequest } from "./apiCaller";
import { CANDIDATE_ID, MAP_ID } from "./config";

type CharacterType = "p" | "s" | "c";

const GRID_SIZE = 11;
const DELAY_MS = 1000;

class GridManager {
  private static readonly GRID_SIZE = GRID_SIZE;
  private static readonly DELAY_MS = DELAY_MS;

  static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static calculateDeletePositions(
    currentGrid: (string | null)[][]
  ): DrawRequest[] {
    const deleteRequests: DrawRequest[] = [];
    const start = 2;
    const end = 8;

    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[i].length; j++) {
        if (i >= start && i <= end && (i === j || j === end - (i - start))) {
          continue; // These positions are part of the X pattern
        } else if (currentGrid[i][j] !== null) {
          let deleteRequest = {
            _id: MAP_ID,
            row: i,
            column: j,
            candidateId: CANDIDATE_ID
          };
          deleteRequests.push(deleteRequest);
          console.log("Delete request:", deleteRequest);
        }
      }
    }
    return deleteRequests;
  }

  static calculateXPositions(
    characterType: CharacterType,
    currentGrid: (string | null)[][]
  ): DrawRequest[][] {
    const drawRequests: DrawRequest[][] = [[], []];
    const start = 2;
    const end = 8;

    for (let i = start; i <= end; i++) {
      if (currentGrid[i][i] == null) {
        let drawRequest = {
          _id: MAP_ID,
          row: i,
          column: i,
          candidateId: CANDIDATE_ID
        };
        drawRequests[0].push(drawRequest);
      }
      if (currentGrid[i][end - (i - start)] == null) {
        let drawRequest = {
          _id: MAP_ID,
          row: i,
          column: end - (i - start),
          candidateId: CANDIDATE_ID
        };
        drawRequests[1].push(drawRequest);
      }
    }
    return drawRequests;
  }
}

async function main(): Promise<void> {
  try {
    const currentGrid = await PolyanetService.getCurrentGrid();
    const characterType: CharacterType = "p";

    const deleteRequests = GridManager.calculateDeletePositions(currentGrid);
    for (const request of deleteRequests) {
      await PolyanetService.makeDeleteApiCall(request);
      await GridManager.delay(DELAY_MS);
    }

    const drawRequests = GridManager.calculateXPositions(
      characterType,
      currentGrid
    );
    for (const subarray of drawRequests) {
      for (const request of subarray) {
        await PolyanetService.makeApiCall(request);
        await GridManager.delay(DELAY_MS);
      }
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main().catch((error) => console.error(`Error: ${(error as Error).message}`));
