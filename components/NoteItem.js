// src/components/NoteItem.js (updated for edit)
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button } from "react-native";
import { deleteNote } from "../services/note-service";

// Inline lightweight EditNoteModal to avoid unresolved import during development
const EditNoteModal = ({ visible, onClose, onNoteUpdated, note }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleSave = () => {
    const updated = { ...note, title, content, updatedAt: new Date().toISOString() };
    if (onNoteUpdated) onNoteUpdated(updated);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.heading}>Edit Note</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            style={modalStyles.input}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Content"
            style={[modalStyles.input, { height: 100 }]}
            multiline
          />
          <View style={modalStyles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const NoteItem = ({ note, onNoteDeleted, onNoteUpdated }) => {
  const [deleting, setDeleting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle delete confirmation and execution
  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const id = note.id || note._id;
            setDeleting(true);
            try {
              await deleteNote(id);
              if (onNoteDeleted) {
                onNoteDeleted(id);
              }
            } catch (error) {
              console.error("Failed to delete note:", error);
              Alert.alert("Error", "Failed to delete the note. Please try again.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Handle opening the edit modal
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  // Handle when a note is updated
  const handleNoteUpdated = (updatedNote) => {
    if (onNoteUpdated) {
      onNoteUpdated(updatedNote);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={handleEdit}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>
          Last updated: {formatDate(note.updatedAt)}
        </Text>
        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={deleting}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <EditNoteModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onNoteUpdated={handleNoteUpdated}
        note={note}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  editButton: {
    marginRight: 16,
  },
  editText: {
    color: "#2196F3",
    fontWeight: "500",
  },
  deleteButton: {},
  deleteText: {
    color: "red",
    fontWeight: "500",
  },
});

export default NoteItem;