import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import NativeFlipTestScreen from '../screens/NativeFlipTestScreen';

export type RootStackParamList = {
  Home: undefined;
  NativeFlipTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NativeFlipTest">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'MekoReader'}}
        />

        <Stack.Screen
          name="NativeFlipTest"
          component={NativeFlipTestScreen}
          options={{title: 'Native Flip Test'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;