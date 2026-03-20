import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ 
  title = "Aucun élément", 
  message = "Commencez par créer votre premier élément" 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B5E4A',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#A18977',
    textAlign: 'center',
  },
});