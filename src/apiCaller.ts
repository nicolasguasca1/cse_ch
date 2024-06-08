import axios from "axios";
import { CANDIDATE_ID, MAP_ID } from "./config";

interface DrawRequest {
  _id: string;
  row: number | null;
  column: number | null;
  candidateId: string;
  // character: number;
}

// interface ApiResponse {
//   map: {
//     _id: string;
//     content: Array<Array<{ type?: number } | null>>;
//     candidateId: string;
//   };
// }

async function makeApiCall(drawRequest: DrawRequest): Promise<void> {
  const postUrl = "https://challenge.crossmint.io/api/polyanets"; // Replace with the actual API endpoint
  const headers = {
    "Content-Type": "application/json"
  };
  let jsonRequest = JSON.stringify(drawRequest);
  try {
    const response = await axios.post(postUrl, jsonRequest, { headers });
    if (response.status === 200) {
      const data = response.data;
      console.log(
        `Successfully placed (${drawRequest.row}, ${drawRequest.column})`
      );
    } else {
      console.error(`Failed to place character: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error making API call: ${(error as Error).message}`);
  }
}

async function makeDeleteApiCall(drawRequest: DrawRequest): Promise<void> {
  const deleteUrl = "https://challenge.crossmint.io/api/polyanets";
  const headers = {
    "Content-Type": "application/json"
  };
  let jsonRequest = JSON.stringify(drawRequest);
  console.log("deleteRequest4", jsonRequest);
  try {
    const response = await axios.delete(deleteUrl, {
      data: jsonRequest,
      headers
    });
    if (response.status === 200) {
      const data = response.data;
      console.log(
        `Successfully deleted (${drawRequest.row}, ${drawRequest.column})`
      );
    } else {
      console.error(`Failed to delete character: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error making delete API call: ${(error as Error).message}`);
  }
}

const apiUrl = "https://challenge.crossmint.io/api/map";

async function getCurrentGrid(): Promise<(string | null)[][]> {
  // const url = `https://challenge.crossmint.io/api/map/${CANDIDATE_ID}`;

  try {
    // const response = await axios.get<ApiResponse>(`${apiUrl}/${CANDIDATE_ID}`);
    const response = await axios.get(`${apiUrl}/${CANDIDATE_ID}`);
    if (response.status === 200) {
      return response.data.map.content;
    } else {
      throw new Error(`Failed to get current grid: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error getting current grid: ${(error as Error).message}`);
    throw error;
  }
}

export { makeApiCall, getCurrentGrid, DrawRequest, makeDeleteApiCall };
