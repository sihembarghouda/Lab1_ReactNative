import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <View style={styles.noteItem}>
      <Text style={styles.noteContent}>{note.content}</Text>
      <Text style={styles.noteDate}>
        {new Date(note.createdAt).toLocaleDateString('fr-FR')}
      </Text>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => onEdit(note)}>
          <Text style={styles.editButton}>✏️ Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(note.id)}>
          <Text style={styles.deleteButton}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noteContent: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  noteDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  editButton: {
    color: '#3498db',
    marginRight: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
  },
});