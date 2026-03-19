import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { TokenContext } from '../Context/Context';

import NavigationTodo from './NavigationTodo';
import HomeScreen from '../screen/HomeScreen';
import SignInScreen from '../screen/SignInScreen';
import SignUpScreen from '../screen/SignUpScreen';
import SignOutScreen from '../screen/SignOutScreen';
import ParamsScreen from '../screen/ParamsScreen';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [token] = useContext(TokenContext);

  if (token == null) {
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={styles.guestTabOptions}>
          <Tab.Screen name="Connexion" component={SignInScreen} />
          <Tab.Screen name="Inscription" component={SignUpScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={styles.authTabOptions}>
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen 
          name="Mes Listes" 
          component={NavigationTodo}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Paramètres" component={ParamsScreen} />
        <Tab.Screen name="Déconnexion" component={SignOutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  guestTabOptions: {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#FFF9F0',
    },
    tabBarActiveTintColor: '#8B5E3C',
    tabBarInactiveTintColor: '#6B5E4A',
  },
  authTabOptions: {
    headerStyle: {
      backgroundColor: '#FFF9F0',
    },
    headerTintColor: '#4B3B2A',
    tabBarStyle: {
      backgroundColor: '#FFF9F0',
    },
    tabBarActiveTintColor: '#8B5E3C',
    tabBarInactiveTintColor: '#6B5E4A',
  },
};