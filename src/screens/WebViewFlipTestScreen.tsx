import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
  />

  <style>
    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #eeeeee;
      font-family: Arial, sans-serif;
    }

    #app {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #book {
      margin: 0 auto;
    }

    .page {
      background: white;
      border: 1px solid #cccccc;
      overflow: hidden;
    }

    .page-content {
      width: 100%;
      height: 100%;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .page-number {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .page-description {
      font-size: 16px;
      line-height: 24px;
    }

    #status {
      margin-top: 24px;
      font-size: 16px;
      font-weight: bold;
    }

    #instruction {
      margin-top: 8px;
      font-size: 14px;
    }
  </style>
</head>

<body>

<div id="app">

  <div id="book">

    <div class="page">
      <div class="page-content">
        <div class="page-number">1</div>
        <div class="page-title">MekoReader</div>
        <div class="page-description">
          StPageFlip WebView PoC
        </div>
      </div>
    </div>

    <div class="page">
      <div class="page-content">
        <div class="page-number">2</div>
        <div class="page-title">Page Flip</div>
        <div class="page-description">
          Drag the edge of the page
        </div>
      </div>
    </div>

    <div class="page">
      <div class="page-content">
        <div class="page-number">3</div>
        <div class="page-title">Gesture</div>
        <div class="page-description">
          Swipe left or right
        </div>
      </div>
    </div>

    <div class="page">
      <div class="page-content">
        <div class="page-number">4</div>
        <div class="page-title">Page Curl</div>
        <div class="page-description">
          Observe the page-turn effect
        </div>
      </div>
    </div>

    <div class="page">
      <div class="page-content">
        <div class="page-number">5</div>
        <div class="page-title">MekoReader</div>
        <div class="page-description">
          End of WebView PoC
        </div>
      </div>
    </div>

  </div>

  <div id="status">Page 1 / 5</div>

  <div id="instruction">
    Drag / Swipe / Tap page edge
  </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>

<script>
  try {

    const pageFlip = new St.PageFlip(
      document.getElementById('book'),
      {
        width: 280,
        height: 400,

        size: 'stretch',

        minWidth: 260,
        maxWidth: 320,

        minHeight: 360,
        maxHeight: 460,

        showCover: true,
        mobileScrollSupport: false,

        maxShadowOpacity: 0.5,

        usePortrait: true,

        flippingTime: 700
      }
    );

    pageFlip.loadFromHTML(
      document.querySelectorAll('.page')
    );

    const status =
      document.getElementById('status');

    pageFlip.on('flip', (event) => {
      status.innerText =
        'Page ' + (event.data + 1) + ' / 5';
    });

  } catch (error) {

    document.getElementById('status').innerText =
      'ERROR: ' + error.message;

  }
</script>

</body>
</html>
`;

function WebViewFlipTestScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{html}}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        onError={event => {
          console.log(
            'WebView error:',
            event.nativeEvent,
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewFlipTestScreen;