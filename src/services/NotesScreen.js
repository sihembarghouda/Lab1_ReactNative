import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getNotes, addNote, deleteNote, updateNote } from "./note-service";
import NoteItem from "../components/NoteItem";
import AddNoteModal from "./AddNoteModal";
import { AuthContext } from "../contexts/AuthContext";

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await getNotes(user.$id);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchNotes();
  }, [user, fetchNotes]);

  const handleAddNote = async (text) => {
    try {
      const newNote = await addNote(text, user.$id);
      setNotes((currentNotes) => [newNote, ...currentNotes]);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to add note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.$id !== noteId)
      );
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleUpdateNote = async (noteId, newText) => {
    try {
      const updatedNote = await updateNote(noteId, newText);
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.$id === noteId ? updatedNote : note
        )
      );
    } catch (error) {
      console.error("Failed to update note:", error);
      setError("Failed to update note. Please try again.");
    }
  };

  // ✅ Better empty state
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>You have no notes yet.</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to create your first note!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Notes list */}
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onDelete={handleDeleteNote}
            onUpdate={handleUpdateNote}
          />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={notes.length === 0 ? { flex: 1 } : styles.listContent}
        ListEmptyComponent={!isLoading && renderEmptyComponent()}
        refreshing={isLoading && notes.length > 0}
        onRefresh={fetchNotes}
      />

      {/* Loading spinner */}
      {isLoading && notes.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Add note modal */}
      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddNote={handleAddNote}
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
  errorBanner: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
  },
  errorBannerText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 0.8)",
  },
});

export default NotesScreen;
