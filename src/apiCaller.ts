import axios from "axios";
import { CANDIDATE_ID, MAP_ID } from "./config";

interface DrawRequest {
  _id: string;
  row: number | null;
  column: number | null;
  candidateId: string;
}

/**
 * Service for interacting with the Polyanet API.
 */
class PolyanetService {
  private static readonly API_URL =
    "https://challenge.crossmint.io/api/polyanets";
  private static readonly MAP_URL = `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}`;
  private static readonly HEADERS = { "Content-Type": "application/json" };

  /**
   * Makes an API call to create a Polyanet.
   * @param drawRequest - The draw request object containing position and candidate information.
   */
  static async makeApiCall(drawRequest: DrawRequest): Promise<void> {
    await this.retry(async () => {
      const response = await axios.post(this.API_URL, drawRequest, {
        headers: this.HEADERS
      });
      if (response.status === 200) {
        console.log(
          `Successfully placed (${drawRequest.row}, ${drawRequest.column})`
        );
      } else {
        console.error(`Failed to place character: ${response.status}`);
      }
    });
  }

  /**
   * Makes an API call to delete a Polyanet.
   * @param drawRequest - The draw request object containing position and candidate information.
   */
  static async makeDeleteApiCall(drawRequest: DrawRequest): Promise<void> {
    await this.retry(async () => {
      const response = await axios.delete(this.API_URL, {
        data: drawRequest,
        headers: this.HEADERS
      });
      if (response.status === 200) {
        console.log(
          `Successfully deleted (${drawRequest.row}, ${drawRequest.column})`
        );
      } else {
        console.error(`Failed to delete character: ${response.status}`);
      }
    });
  }

  /**
   * Retrieves the current grid from the API.
   * @returns A promise that resolves to a 2D array representing the current grid.
   */
  static async getCurrentGrid(): Promise<(string | null)[][]> {
    return await this.retry(async () => {
      const response = await axios.get(this.MAP_URL);
      if (response.status === 200) {
        return response.data.map.content;
      } else {
        throw new Error(`Failed to get current grid: ${response.status}`);
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

export { PolyanetService, DrawRequest };
