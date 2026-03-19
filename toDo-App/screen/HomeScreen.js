import React from 'react';
import { useContext, useState } from "react";
import { StatusBar, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { UsernameContext, TokenContext } from '../Context/Context';
import { StyleSheet } from 'react-native';
import { getTodoLists } from "../Api/todoList";
import { getTodos } from "../Api/todo";
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [username] = useContext(UsernameContext);
  const [token] = useContext(TokenContext);
  const [stats, setStats] = useState({
    totalLists: 0,
    totalTasks: 0,
    completedTasks: 0
  });

const loadStats = async () => {
  try {
    const lists = await getTodoLists(username, token);

    let totalTasks = 0;
    let completedTasks = 0;

    for (const list of lists) {

      const todos = await getTodos(list.id, token);

      totalTasks += todos.length;
      completedTasks += todos.filter(t => t.done).length;
    }

    setStats({
      totalLists: lists.length,
      totalTasks,
      completedTasks
    });

  } catch (error) {
    console.error("Erreur chargement stats:", error);
  }
};

 
  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
    
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenue ! </Text>
        <Text style={styles.subtitle}>Connecté en tant que :</Text>
        <Text style={styles.username}>{username}</Text>


        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="list" size={24} color="#8B5E3C" />
            <Text style={styles.statNumber}>{stats.totalLists}</Text>
            <Text style={styles.statLabel}>Listes</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="checkbox" size={24} color="#8B5E3C" />
            <Text style={styles.statNumber}>{stats.totalTasks}</Text>
            <Text style={styles.statLabel}>Tâches totales</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="checkmark-done" size={24} color="#8B5E3C" />
            <Text style={styles.statNumber}>{stats.completedTasks}</Text>
            <Text style={styles.statLabel}>Terminées</Text>
          </View>
        </View>


        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate("Mes Listes")}
          >
            <Ionicons name="list" size={20} color="#FFF9F0" />
            <Text style={styles.actionButtonText}>Voir mes listes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate("Paramètres")}
          >
            <Ionicons name="settings" size={20} color="#8B5E3C" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Paramètres</Text>
          </TouchableOpacity>
        </View>

        {stats.totalLists > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Vos listes récentes</Text>
            <Text style={styles.sectionSubtitle}>
              Vous avez {stats.totalLists} liste{stats.totalLists > 1 ? 's' : ''} active{stats.totalLists > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E6',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF9F0',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B3B2A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B5E4A',
    marginBottom: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: '600',
    color: '#8B5E3C',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B3B2A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B5E4A',
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#8B5E3C',
    shadowColor: "#8B5E3C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8B5E3C',
  },
  actionButtonText: {
    color: '#FFF9F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#8B5E3C',
  },
  recentSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDD2C1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B3B2A',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B5E4A',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B5E4A',
    lineHeight: 20,
  },
});