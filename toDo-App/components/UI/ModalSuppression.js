import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ModalSuppression({ visible, onCancel, onConfirm }) {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalText}>
          Voulez-vous vraiment supprimer cette tâche ?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ccc" }]}
            onPress={onCancel}
          >
            <Text>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#e74c3c" }]}
            onPress={onConfirm}
          >
            <Text style={{ color: "#fff" }}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(75, 59, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#FFF9F0", 
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4B3B2A", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#4B3B2A", 
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#8B5E3C", 
  },
  cancelButton: {
    backgroundColor: "#C4A484", 
  },
  confirmButton: {
    backgroundColor: "#8B5E3C", 
  },
  buttonText: {
    color: "#FFF8F0", 
    fontWeight: "600",
    fontSize: 14,
  },
});

