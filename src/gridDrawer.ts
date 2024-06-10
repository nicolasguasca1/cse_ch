import {
  MegaverseService,
  DrawPolyanetRequest,
  DrawSoloonRequest,
  DrawComethRequest,
  ValueType,
  ColorType,
  DirectionType,
  MapData
} from "./apiCaller";
import { CANDIDATE_ID, MAP_ID } from "./config";

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
  static processGoalData(
    goalGrid: ValueType[][],
    mapData: MapData | undefined
  ): {
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
        const typeGrid: number | undefined = mapData!.content[i][j]?.type;
        const directionGrid: string | undefined =
          mapData!.content[i][j]?.direction;
        const colorGrid: string | undefined = mapData!.content[i][j]?.color;
        const value = goalGrid[i][j];
        if (value === "POLYANET" && typeGrid !== 0) {
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
          ].includes(value) &&
          colorGrid !== value.split("_")[0].toLowerCase()
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
          ) &&
          directionGrid !== value.split("_")[0].toLowerCase()
        ) {
          drawComethRequests.push({
            _id: MAP_ID,
            row: i,
            column: j,
            direction: value.split("_")[0].toLowerCase() as DirectionType,
            candidateId: CANDIDATE_ID
          });
        } else if (value === "SPACE" && typeGrid !== undefined) {
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
    const mapData = await MegaverseService.getCurrentGrid();
    const goalGrid = await MegaverseService.getGoalGrid();
    const {
      drawPolyRequests,
      drawSoloonRequests,
      drawComethRequests,
      deleteRequests
    } = GridManager.processGoalData(goalGrid, mapData!);

    // Helper function to process requests sequentially
    const processRequestsSequentially = async (
      requests: any[],
      apiCallFn: (request: any, mapData?: any) => Promise<void>
    ) => {
      for (const request of requests) {
        await apiCallFn(request, mapData);
      }
    };

    // Execute deleteRequests
    await processRequestsSequentially(deleteRequests, (request) =>
      MegaverseService.makeDeleteApiCall(request, mapData)
    );

    // Execute drawPolyRequests
    await processRequestsSequentially(drawPolyRequests, (request) =>
      MegaverseService.makeApiCall(request, mapData)
    );

    // Execute drawSoloonRequests
    await processRequestsSequentially(drawSoloonRequests, (request) =>
      MegaverseService.makeApiCall(request, mapData)
    );

    // Execute drawComethRequests
    await processRequestsSequentially(drawComethRequests, (request) =>
      MegaverseService.makeApiCall(request, mapData)
    );

    console.log("Goal achieved!");
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main().catch((error) => console.error(`Error: ${(error as Error).message}`));
