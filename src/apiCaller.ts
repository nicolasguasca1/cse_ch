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
  private static readonly CROSS_URL = `https://challenge.crossmint.io/api`;
  private static readonly POLYANET_URL = `${this.CROSS_URL}/polyanets`;
  // "https://challenge.crossmint.io/api/polyanets";
  private static readonly SOLOONS_URL = `${this.CROSS_URL}/soloons`;
  // "https://challenge.crossmint.io/api/soloons";
  private static readonly COMETH_URL = `${this.CROSS_URL}/comeths`;
  // "https://challenge.crossmint.io/api/comeths";
  private static readonly MAP_URL = `${this.CROSS_URL}/map/${CANDIDATE_ID}`;
  // `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}`;
  private static readonly GOAL_MAP_URL = `${this.CROSS_URL}/map/${CANDIDATE_ID}/goal`;
  // `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}/goal`;
  private static readonly HEADERS = { "Content-Type": "application/json" };

  /**
   * Check if a specific position is occupied.
   * @param type - The type of object to check.
   * @param shapeReq - The request data containing row and column.
   * @param mapData - The current map data.
   * @returns A promise that resolves to a boolean indicating if the position is occupied.
   */
  static async isOccupied(
    type: number | null,
    shapeReq: DrawPolyanetRequest | DrawSoloonRequest | DrawComethRequest,
    mapData: MapData
  ): Promise<boolean> {
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
        `Skipping...position already has a Space: (${row}, ${column})`
      );
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get the current grid data from the API.
   * @returns A promise that resolves to the current grid data.
   */
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

      // Refactored into separate methods for clarity
      if (
        "color" in shapeReq &&
        !(await this.isOccupied(1, shapeReq, mapData))
      ) {
        await this.placeSoloon(shapeReq);
      } else if (
        "direction" in shapeReq &&
        !(await this.isOccupied(2, shapeReq, mapData))
      ) {
        await this.placeCometh(shapeReq);
      } else if (!(await this.isOccupied(0, shapeReq, mapData))) {
        await this.placePolyanet(shapeReq);
      }
    });
  }

  /**
   * Place a soloon on the grid.
   * @param request - The request data for the soloon.
   */
  private static async placeSoloon(request: DrawSoloonRequest) {
    const response = await axios.post(this.SOLOONS_URL, request, {
      headers: this.HEADERS
    });
    if (response.status === 200) {
      console.log(
        `Successfully placed soloon (${request.row}, ${request.column})`
      );
    } else {
      console.error(`Failed to place soloon: ${response.status}`);
    }
  }

  /**
   * Place a cometh on the grid.
   * @param request - The request data for the cometh.
   */
  private static async placeCometh(request: DrawComethRequest) {
    const response = await axios.post(this.COMETH_URL, request, {
      headers: this.HEADERS
    });
    if (response.status === 200) {
      console.log(
        `Successfully placed cometh (${request.row}, ${request.column})`
      );
    } else {
      console.error(`Failed to place cometh: ${response.status}`);
    }
  }

  /**
   * Place a polyanet on the grid.
   * @param request - The request data for the polyanet.
   */
  private static async placePolyanet(request: DrawPolyanetRequest) {
    const response = await axios.post(this.POLYANET_URL, request, {
      headers: this.HEADERS
    });
    if (response.status === 200) {
      console.log(
        `Successfully placed polyanet (${request.row}, ${request.column})`
      );
    } else {
      console.error(`Failed to place polyanet: ${response.status}`);
    }
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
