import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { TokenContext, UsernameContext } from "../Context/Context";
import ModalConfirmation from "../components/UI/ModalConfirmation";

export default function SignOutScreen({ navigation }) {
  const [username, setUsername] = useContext(UsernameContext);
  const [token, setToken] = useContext(TokenContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignOut = () => {
    setUsername(null);
    setToken(null);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const confirmSignOut = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.card}>
        <Text style={styles.title}>Déconnexion</Text>
        <Text style={styles.username}>Connecté en tant que : {username}</Text>

        <TouchableOpacity style={styles.button} onPress={confirmSignOut}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <ModalConfirmation
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleSignOut}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
        type="default"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6", 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF9F0", 
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B3B2A", 
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: "#6B5E4A", 
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#8B5E3C", 
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#8B5E3C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF9F0", 
    fontSize: 16,
    fontWeight: "bold",
  },
});