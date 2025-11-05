// services/note-service.js
import { Databases, Query } from "appwrite";
import client from "./appwrite-config";
// eslint-disable-next-line import/no-unresolved
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "@env";

const databases = new Databases(client);

export const getNotes = async (userId) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.equal("user_id", userId)]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const addNote = async (text, userId) => {
  try {
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      "unique()",
      {
        text,
        user_id: userId,
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

export const updateNote = async (documentId, data) => {
  try {
    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      documentId,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const deleteNote = async (documentId) => {
  try {
    const response = await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      documentId
    );
    return response;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};