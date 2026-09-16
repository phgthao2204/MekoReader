import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import PdfTestScreen from '../screens/PdfTestScreen';

export type RootStackParamList = {
  Home: undefined;
  PdfTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PdfTest">
        <Stack.Screen
          name="PdfTest"
          component={PdfTestScreen}
          options={{title: 'PDF Viewer PoC'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'MekoReader'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;