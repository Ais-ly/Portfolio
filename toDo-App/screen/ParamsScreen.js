import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UsernameContext, TokenContext } from '../Context/Context';
import { deleteUserAccount } from "../Api/sign";
import ModalConfirmation from "../components/UI/ModalConfirmation";

export default function ParamsScreen({ navigation }) {
  const [username] = useContext(UsernameContext);
  const [token,setToken] = useContext(TokenContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteUserAccount(token, username);
      
      console.log("Résultat suppression:", result);
      
      if (result.nodesDeleted > 0) {
        Alert.alert('Succès', 'Compte supprimé avec succès');
          setToken(null);
         navigation.reset({ index: 0, routes: [{ name: "Login" }] })
      } else {
        Alert.alert('Erreur', 'Aucun compte trouvé à supprimer');
      }
    } catch (err) {
      console.error("Erreur suppression compte :", err);
      Alert.alert('Erreur', 'Impossible de supprimer le compte: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <Text style={styles.info}>Connecté en tant que : {username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions dangereuses</Text>
        
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dangerButtonText}>Supprimer mon compte</Text>
        </TouchableOpacity>
        
        <Text style={styles.warningText}>
          Attention : Cette action supprimera définitivement votre compte et toutes vos données.
        </Text>
      </View>

      <ModalConfirmation
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Suppression de compte"
        message={`Êtes-vous sûr de vouloir supprimer définitivement votre compte "${username}" ? Toutes vos listes et tâches seront perdues.`}
        confirmText="Supprimer "
        type="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E6',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3B2A',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B3B2A',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#6B5E4A',
  },
  dangerButton: {
    backgroundColor: '#c0392b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 14,
    color: '#e74c3c',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});