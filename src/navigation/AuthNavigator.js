// src/navigation/AuthNavigator.js
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";

// Import screens
import AuthScreen from "../Screens/AuthScreen";
import HomeScreen from "../Screens/HomeScreen";
import NotesScreen from "../Screens/NotesScreen";

const Stack = createNativeStackNavigator();

// Auth stack - screens for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Auth"
      component={AuthScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// App stack - screens for authenticated users
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Notes" component={NotesScreen} />
    {/* Note edit screen handled via modal in NotesScreen / components; removed unresolved import */}
  </Stack.Navigator>
);

// Main navigator component
const AuthNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AuthNavigator;