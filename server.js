// Description: This file is the entry point for the server. It creates a new instance of the App class and starts the server.
import App from "./App.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

const server = new App(port);

server.start();
