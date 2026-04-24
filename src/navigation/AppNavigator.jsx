import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabBar } from '../components/TabBar';
import LoginScreen           from '../screens/Login';
import HomeScreen            from '../screens/Home';
import OnboardingScreen      from '../screens/Onboarding';
import ExerciseScreen        from '../screens/Exercise';
import WordDetailScreen      from '../screens/WordDetail';
import SessionCompleteScreen from '../screens/SessionComplete';
import ProgressScreen        from '../screens/Progress';
import ProfileScreen         from '../screens/Profile';
import PaywallScreen         from '../screens/Paywall';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Exercise" component={ExerciseScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator({ isAuthenticated, isGuest, initialAuthRoute = 'Main' }) {
  const showApp = isAuthenticated || isGuest;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {showApp ? (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isAuthenticated ? initialAuthRoute : 'Main'}
          >
            <Stack.Screen name="Main"            component={MainTabs} />
            <Stack.Screen name="Onboarding"      component={OnboardingScreen} />
            <Stack.Screen name="WordDetail"      component={WordDetailScreen} />
            <Stack.Screen name="SessionComplete" component={SessionCompleteScreen} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="Paywall"
              component={PaywallScreen}
              options={{ presentation: 'modal' }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
