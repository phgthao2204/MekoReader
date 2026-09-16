import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import WebViewTestScreen from '../screens/WebViewTestScreen';
import WebViewFlipTestScreen from '../screens/WebViewFlipTestScreen';
import TurnJsFlipTestScreen from '../screens/TurnJsFlipTestScreen';

export type RootStackParamList = {
  Home: undefined;
  WebViewTest: undefined;
  WebViewFlipTest: undefined;
  TurnJsFlipTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TurnJsFlipTest">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'MekoReader'}}
        />

        <Stack.Screen
          name="WebViewTest"
          component={WebViewTestScreen}
          options={{title: 'WebView Test'}}
        />
        <Stack.Screen
          name="WebViewFlipTest"
          component={WebViewFlipTestScreen}
          options={{title: 'StPageFlip Test'}}
        />
        <Stack.Screen
          name="TurnJsFlipTest"
          component={TurnJsFlipTestScreen}
          options={{title: 'Turn.js Test'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;