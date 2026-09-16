import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    body {
      margin: 0;
      background: #f3f3f3;
      font-family: Arial, sans-serif;
    }

    .container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .book {
      width: 260px;
      height: 360px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    h1 {
      font-size: 30px;
    }

    p {
      color: #555;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="book">
      <div>
        <h1>MekoReader</h1>
        <p>WebView Test</p>
      </div>
    </div>

    <p>React Native WebView is running</p>
  </div>
</body>
</html>
`;

function WebViewTestScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{html}}
        originWhitelist={['*']}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewTestScreen;