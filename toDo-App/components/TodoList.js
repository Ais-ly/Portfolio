import React, { useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from "react-native";
import { getTodos } from "../Api/todo";
import { TokenContext } from "../Context/Context";
import CustomAlert from "./UI/CustomAlert";
import { useFocusEffect } from "@react-navigation/native";

export default function TodoList({ todoList, navigation, onDeleteList }) {
  const [token] = useContext(TokenContext);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const completed = todos.filter(t => t.done).length;
  const progress = todos.length ? completed / todos.length : 0;

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTodos = async () => {
        try {
          setIsLoading(true);
          const data = await getTodos(todoList.id, token);
          setTodos(data || []);
        } catch (err) {
          showAlert("Erreur", "Impossible de charger les tâches");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTodos();
    }, [todoList.id, token])
  );

  const handlePress = () => {
    if (navigation) {
      navigation.navigate("TodoItems", {
        listeId: todoList.id,
        listeTitre: todoList.title || "Liste sans nom"
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>
              {todoList.title} ({completed} terminées)
            </Text>
            <Text style={styles.cardSubtitle}>
              {completed} / {todos.length} terminées
            </Text>
          </View>

          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); onDeleteList(todoList.id); }}
            style={styles.deleteButton}
          >
            <Image source={require("../assets/poubelle.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>

        {isLoading && <ActivityIndicator size="small" color="#6B4C3B" style={styles.headerLoader} />}
      </TouchableOpacity>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F0E6"
  },
  card: {
    backgroundColor: "#FFF8F0",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8
  },
  textContainer: {
    flex: 1
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B4C3B",
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#A18977"
  },
  progressBarBackground: {
    height: 10,
    width: "100%",
    backgroundColor: "#DDD2C1",
    borderRadius: 5,
    overflow: "hidden"
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6B4C3B"
  },
  deleteButton: {
    padding: 4
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#8B5E3C"
  },
  headerLoader: {
    marginTop: 8
  }
});
