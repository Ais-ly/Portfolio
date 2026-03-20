import React, { useContext, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet,
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { TokenContext, UsernameContext } from "../Context/Context";
import { signUp } from "../Api/sign"; 
import CustomAlert from '../components/UI/CustomAlert';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useContext(UsernameContext);
  const [token, setToken] = useContext(TokenContext);

  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  async function createAccount() {
    if (!loginInput || !passwordInput || !confirmPasswordInput) {
      showAlert('Erreur', 'Tous les champs doivent être remplis');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      showAlert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      const tokenJWT = await signUp(loginInput, passwordInput);
      setUsername(loginInput);
      setToken(tokenJWT);
      navigation.navigate('Home'); 
    } catch (error) {
      if (error.message?.includes("Network request failed")) {
        showAlert("Erreur réseau", "Impossible de contacter le serveur.");
      } else if (error.message?.includes("username")) {
        showAlert("Erreur", "Nom d'utilisateur déjà utilisé.");
      } else {
        showAlert("Erreur", error.message || "Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez notre communauté
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#8B5E3C" style={styles.inputIcon} />
            <TextInput
              placeholder="Saisir votre login"
              placeholderTextColor="#A89B8C"
              value={loginInput}
              onChangeText={setLoginInput}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8B5E3C" style={styles.inputIcon} />
            <TextInput
              placeholder="Saisir votre mot de passe"
              placeholderTextColor="#A89B8C"
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry={!showPassword}
              style={styles.inputField}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#8B5E3C" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8B5E3C" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirmer votre mot de passe"
              placeholderTextColor="#A89B8C"
              value={confirmPasswordInput}
              onChangeText={setConfirmPasswordInput}
              secureTextEntry={!showConfirmPassword}
              style={styles.inputField}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#8B5E3C" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={createAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF8F0" size="small" />
            ) : (
              <Text style={styles.buttonText}>Créer un compte</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Connexion')}
          >
            <Text style={styles.loginText}>
              Déjà un compte ? <Text style={styles.loginLinkText}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4B3B2A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B5E4A",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F0",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#4B3B2A",
  },
  inputField: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#4B3B2A",
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#6B5E4A",
    fontSize: 14,
  },
  loginLinkText: {
    color: "#8B5E3C",
    fontWeight: "600",
  },
});