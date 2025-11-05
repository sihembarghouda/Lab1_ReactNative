// src/services/appwrite-config.js
import { Client } from "appwrite";
// eslint-disable-next-line import/no-unresolved
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@env";

// Initialize the Appwrite client
const client = new Client();

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export default client;