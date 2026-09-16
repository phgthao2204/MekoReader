import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ReanimatedFlipTestScreen from '../screens/ReanimatedFlipTestScreen';

export type RootStackParamList = {
  Home: undefined;
  ReanimatedFlipTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ReanimatedFlipTest">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'MekoReader'}}
        />

        <Stack.Screen
          name="ReanimatedFlipTest"
          component={ReanimatedFlipTestScreen}
          options={{title: 'Reanimated Flip Test'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;