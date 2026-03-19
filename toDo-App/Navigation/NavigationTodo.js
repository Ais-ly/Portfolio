import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoListsScreen from '../screen/TodoListsScreen';
import TodoItemsScreen from '../screen/TodoItemsScreen';

const Stack = createNativeStackNavigator();

export default function NavigationTodo() {
  return (
    <Stack.Navigator 
      initialRouteName='TodoLists'
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF9F0',
        },
        headerTintColor: '#4B3B2A',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: '#F5F0E6',
        }
      }}
    >
      <Stack.Screen 
        name='Mes Listes' 
        component={TodoListsScreen} 
        options={{ title: 'Mes Listes' }}
      />
      <Stack.Screen 
        name='TodoItems' 
        component={TodoItemsScreen} 
        options={({ route }) => ({ 
          title: route.params?.listeTitre || 'Détails de la liste' 
        })}
      />
    </Stack.Navigator>
  );
}