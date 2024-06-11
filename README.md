Megaverse Grid Manager

This project is a tool for managing and interacting with a grid map. It allows users to draw, delete, and manage various objects on the grid to achieve a specified goal state.
Table of Contents

    Installation
    Configuration
    Usage
    Project Structure
    APIs

Installation

To get started, clone the repository and install the dependencies:

zsh

git clone https://github.com/your-username/megaverse-grid-manager.git
cd megaverse-grid-manager
yarn install

Configuration

Create a .env file in the root directory of the project and add your candidate ID and map ID:

env

CANDIDATE_ID=your_candidate_id
MAP_ID=your_map_id

Usage

To run the grid manager and achieve the goal state, use the following command:

zsh

-yarn install

-yarn tsc

-yarn start

Project Structure

The project is divided into three main files:

    apiCaller.ts: Contains the MegaverseService class, which handles all API interactions with the Polyanet service.
    gridDrawer.ts: Contains the GridManager class and the main function that processes the grid and makes the necessary API calls to draw or delete objects.
    config.ts: Handles environment variable configuration.

apiCaller.ts

This file defines the MegaverseService class, which includes methods for:

    Retrieving the current grid state.
    Retrieving the goal grid state.
    Drawing and deleting objects on the grid.
    Retrying failed API calls.

gridDrawer.ts

This file defines the GridManager class, which includes methods for:

    Processing the goal grid data.
    Generating requests to draw or delete objects based on the goal grid.
    Sequentially executing these requests.

This file sets up environment variables required for the project. It uses the dotenv package to load variables from a .env file.
APIs
