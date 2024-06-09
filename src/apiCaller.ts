import axios from "axios";
import { CANDIDATE_ID, MAP_ID } from "./config";

interface MapContentItem {
  type: number;
  color?: string;
}

type MapContent = (MapContentItem | null)[][];

interface MapData {
  _id: string;
  content: MapContent;
  candidateId: string;
  phase: number;
  __v: number;
}

interface ApiResponse {
  map: MapData;
}

// Define the types and their possible values
type ValueType =
  | "SPACE"
  | "RIGHT_COMETH"
  | "POLYANET"
  | "UP_COMETH"
  | "WHITE_SOLOON"
  | "LEFT_COMETH"
  | "BLUE_SOLOON"
  | "PURPLE_SOLOON"
  | "DOWN_COMETH"
  | "RED_SOLOON";

type ColorType = "white" | "blue" | "purple" | "red";

type DirectionType = "up" | "down" | "left" | "right";

interface DrawPolyanetRequest {
  _id: string;
  row: number | null;
  column: number | null;
  candidateId: string;
}

interface DrawSoloonRequest {
  _id: string;
  row: number | null;
  column: number | null;
  color: ColorType;
  candidateId: string;
}

interface DrawComethRequest {
  _id: string;
  row: number | null;
  column: number | null;
  direction: string;
  candidateId: string;
}

/**
 * Service for interacting with the Polyanet API.
 */
class MegaverseService {
  private static readonly POLYANET_URL =
    "https://challenge.crossmint.io/api/polyanets";
  private static readonly SOLOONS_URL =
    "https://challenge.crossmint.io/api/soloons";
  private static readonly COMETH_URL =
    "https://challenge.crossmint.io/api/comeths";
  private static readonly MAP_URL = `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}`;
  private static readonly GOAL_MAP_URL = `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}/goal`;
  private static readonly HEADERS = { "Content-Type": "application/json" };

  // // Type guard function to check if the parameter is of the type DrawSoloonRequest
  // static isDrawSoloon(
  //   request: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest
  // ): request is DrawPolyanetRequest {
  //   return (
  //     (request as DrawSoloonRequest).color !== undefined &&
  //     (request as DrawSoloonRequest).row !== undefined &&
  //     (request as DrawSoloonRequest).column !== undefined
  //   );
  // }

  // // Type guard function to check if the parameter is of the type DrawComethRequest
  // static isDrawCometh(
  //   request: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest
  // ): request is DrawPolyanetRequest {
  //   return (
  //     (request as DrawComethRequest).direction !== undefined &&
  //     (request as DrawComethRequest).row !== undefined &&
  //     (request as DrawComethRequest).column !== undefined
  //   );
  // }

  /**
   * Checks if a certain value already exists in the given position.
   * @param position - The position to check.
   * @returns A boolean indicating whether the position is already occupied.
   */
  static async isOccupied(
    type: number | null,
    shapeReq: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest,
    mapData: MapData
  ): Promise<boolean> {
    // Implement the logic here to check if the position is occupied
    // This could involve making another API call or querying a database
    // For demonstration purposes, let's assume it always returns false
    // currentGrid = getCurrentGrid();
    const { row, column } = shapeReq;
    if (
      row === null ||
      column === null ||
      !mapData.content[row] ||
      !mapData.content[row][column]
    ) {
      return false;
    }
    // const row = shapeReq.row;
    // const column = shapeReq.column;
    const typeGrid = mapData.content[row][column]?.type;
    if (type === 0 && typeGrid === 0) {
      console.log(
        `Skipping...position already has a Polyanet: (${row}, ${column})`
      );
      return true;
    } else if (type === 1 && typeGrid === 1) {
      console.log(
        `Skipping...position already has a Soloon: (${row}, ${column})`
      );
      return true;
    } else if (type === 2 && typeGrid === 2) {
      console.log(
        `Skipping...position already has a Cometh: (${row}, ${column})`
      );
      return true;
    } else if (type === null && typeGrid === null) {
      console.log(
        `Skipping...position already has a Cometh: (${row}, ${column})`
      );
      return true;
    } else {
      return false;
    }
  }

  static async getCurrentGrid(): Promise<MapData | null> {
    try {
      const response = await axios.get(this.MAP_URL);
      const mapData = response.data.map as MapData;
      return mapData !== undefined ? mapData : null;
    } catch (error) {
      console.error(`Failed to get current grid: ${error}`);
      return null;
    }
  }

  /**
   * Makes an API call to create a Polyanet.
   * @param shapeReq - The draw request object containing position and candidate information.
   */
  static async makeApiCall(
    shapeReq: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest
  ): Promise<void> {
    await this.retry(async () => {
      const mapData = await this.getCurrentGrid();
      if (!mapData) {
        throw new Error("Failed to retrieve the current map data.");
      }
      // Check if the position is already occupied
      let response;
      // let isOcupied = await this.isOccupied(0, shapeReq, mapData);
      // Make a different API call depending on the request type with a conditional
      if (
        "color" in shapeReq &&
        !(await this.isOccupied(1, shapeReq, mapData))
      ) {
        response = await axios.post(this.SOLOONS_URL, shapeReq, {
          headers: this.HEADERS
        });
        if (response.status === 200) {
          console.log(
            `Successfully placed soloon (${shapeReq.row}, ${shapeReq.column})`
          );
        } else {
          console.error(`Failed to place soloon: ${response.status}`);
        }
      } else if (
        "direction" in shapeReq &&
        !(await this.isOccupied(2, shapeReq, mapData))
      ) {
        response = await axios.post(this.COMETH_URL, shapeReq, {
          headers: this.HEADERS
        });
        if (response.status === 200) {
          console.log(
            `Successfully placed cometh (${shapeReq.row}, ${shapeReq.column})`
          );
        } else {
          console.error(`Failed to place cometh: ${response.status}`);
        }
      } else if (!(await this.isOccupied(0, shapeReq, mapData))) {
        response = await axios.post(this.POLYANET_URL, shapeReq, {
          headers: this.HEADERS
        });
        if (response.status === 200) {
          console.log(
            `Successfully placed polyanet (${shapeReq.row}, ${shapeReq.column})`
          );
        } else {
          console.error(`Failed to place polyanet: ${response.status}`);
        }
      }
    });
  }

  /**
   * Makes an API call to delete a Polyanet.
   * @param drawPolyanetRequest - The draw request object containing position and candidate information.
   */
  static async makeDeleteApiCall(
    drawPolyanetRequest: DrawPolyanetRequest
  ): Promise<void> {
    await this.retry(async () => {
      const { row, column } = drawPolyanetRequest;
      const mapData = await this.getCurrentGrid();
      if (!mapData) {
        throw new Error("Failed to retrieve the current map data.");
      }
      if (!(await this.isOccupied(null, drawPolyanetRequest, mapData))) {
        // skip if the position is already empty
        console.log(
          `Skipping...position already has a SPACE: (${row}, ${column})`
        );
        return;
      }
      const response = await axios.delete(this.POLYANET_URL, {
        data: drawPolyanetRequest,
        headers: this.HEADERS
      });
      if (response.status === 200) {
        console.log(
          `Successfully deleted (${drawPolyanetRequest.row}, ${drawPolyanetRequest.column})`
        );
      } else {
        console.error(`Failed to delete character: ${response.status}`);
      }
    });
  }

  /**
   * Retrieves the goald grid from the API.
   * @returns A promise that resolves to a 2D array representing the goal grid.
   */
  static async getGoalGrid(): Promise<ValueType[][]> {
    return await this.retry(async () => {
      const response = await axios.get(this.GOAL_MAP_URL);
      if (response.status === 200) {
        return response.data.goal as ValueType[][];
      } else {
        throw new Error(`Failed to get goal grid: ${response.status}`);
      }
    });
  }

  /**
   * Retries a function in case of failure.
   * @param fn - The function to retry.
   * @param retries - The number of retries.
   * @param delay - The delay between retries in milliseconds.
   * @returns A promise that resolves to the result of the function.
   */
  private static async retry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying... attempts left: ${retries - 1}`);
        await new Promise((res) => setTimeout(res, delay));
        return this.retry(fn, retries - 1, delay);
      } else {
        throw error;
      }
    }
  }
}

export {
  MegaverseService,
  DrawPolyanetRequest,
  DrawSoloonRequest,
  DrawComethRequest,
  ValueType,
  ColorType,
  DirectionType
};
