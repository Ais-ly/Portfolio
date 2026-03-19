import React, { useContext, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { TokenContext, UsernameContext } from "../Context/Context";
import { signIn } from "../Api/sign";

export default function SignInScreen() {
  const [username, setUsername] = useContext(UsernameContext);
  const [token, setToken] = useContext(TokenContext);

  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function connexion() {
    if (!loginInput || !passwordInput) {
      setErrorMessage("Veuillez saisir votre login et votre mot de passe.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const tokenJWT = await signIn(loginInput, passwordInput);
      setUsername(loginInput);
      setToken(tokenJWT);
    } catch (error) {
      console.error("Erreur de connexion :", error.message);

      if (error.message?.includes("Network request failed")) {
        setErrorMessage("Impossible de contacter le serveur. Vérifiez votre connexion Internet.");
      } else if (
        error.message?.includes("incorrect") ||
        error.message?.includes("Invalid")
      ) {
        setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        setErrorMessage("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenue</Text>
      <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={loginInput}
        onChangeText={setLoginInput}
        style={styles.input}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mot de passe"
          value={passwordInput}
          onChangeText={setPasswordInput}
          secureTextEntry={!isPasswordVisible} 
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={22}
            color="#6B5E4A"
          />
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={connexion}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#F5F0E6",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4B3B2A",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B5E4A",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFF9F0",
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#4B3B2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F0",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  errorText: {
    color: "#D9534F",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#8B5E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#C4A484",
  },
  buttonText: {
    color: "#FFF8F0",
    fontWeight: "600",
    fontSize: 18,
  },
});
