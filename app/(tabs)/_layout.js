import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import CitrusCounterScreen from '../screens/CitrusCounterScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const prepareApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      try {
        const userData = await AsyncStorage.getItem('userData');
        setInitialRoute(userData ? 'HomeScreen' : 'Login');
      } catch (e) {
        setInitialRoute('Login');
      }
    };
    prepareApp();
  }, []);

  if (!initialRoute) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CitrusCounter" component={CitrusCounterScreen} />
      <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
