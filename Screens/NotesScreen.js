import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import NoteItem from '../components/NoteItem';
import NoteInput from '../components/NoteInput';

// Données initiales
const initialNotes = [
  {
    id: '1',
    content: 'Apprendre React Native',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'Créer une application de notes',
    createdAt: new Date().toISOString(),
  },
];

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState(initialNotes);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Enregistrer une note (ajout ou modification)
  const saveNote = () => {
    if (noteText.trim() === '') return;

    if (editingNote) {
      // Modifier une note existante
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                content: noteText,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
      setEditingNote(null);
    } else {
      // Ajouter une nouvelle note
      const newNote = {
        id: Date.now().toString(),
        content: noteText,
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }

    setNoteText('');
    setModalVisible(false);
  };

  // Supprimer une note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Ouvrir le mode édition
  const editNote = (note) => {
    setEditingNote(note);
    setNoteText(note.content);
    setModalVisible(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setModalVisible(false);
    setNoteText('');
    setEditingNote(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3498db" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingNote(null);
            setNoteText('');
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des notes */}
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <NoteItem 
              note={item} 
              onEdit={editNote} 
              onDelete={deleteNote} 
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📝</Text>
          <Text style={styles.emptyTitle}>Aucune note</Text>
          <Text style={styles.emptySubtitle}>
            Appuyez sur le bouton + pour créer votre première note
          </Text>
        </View>
      )}

      {/* Modal pour ajouter/modifier */}
      <NoteInput
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveNote}
        noteText={noteText}
        setNoteText={setNoteText}
        isEditing={!!editingNote}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 100,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
    marginTop: -2,
  },
  notesList: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});