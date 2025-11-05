/* eslint-disable import/no-unresolved */
// src/screens/NotesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getNotes } from "../services/note-service";
import NoteItem from "../components/NoteItem";
import AddNoteModal from "../components/AddNoteModal";

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from Appwrite
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a note to the list without refetching
  const handleNoteAdded = (newNote) => {
    setNotes((currentNotes) => [newNote, ...currentNotes]);
  };

  // 🗑️ Delete a note from state after it's deleted in Appwrite
  const handleNoteDeleted = (noteId) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.$id !== noteId)
    );
  };

  // Loading state
  if (loading && notes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Error state
  if (error && notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <NoteItem note={item} onNoteDeleted={handleNoteDeleted} />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchNotes}
      />

      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNoteAdded={handleNoteAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default NotesScreen;
