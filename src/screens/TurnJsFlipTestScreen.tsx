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

    #flipbook {
      width: 280px;
      height: 400px;
    }

    #flipbook .page {
      width: 280px;
      height: 400px;
      background: white;
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
      border: 1px solid #cccccc;
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

  <div id="flipbook">

    <div class="page">
      <div class="page-content">
        <div class="page-number">1</div>
        <div class="page-title">MekoReader</div>
        <div class="page-description">
          Turn.js WebView PoC
        </div>
      </div>
    </div>

    <div class="page">
      <div class="page-content">
        <div class="page-number">2</div>
        <div class="page-title">Turn.js</div>
        <div class="page-description">
          Drag the page edge
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
        <div class="page-title">Page Turn</div>
        <div class="page-description">
          Observe the page-turn animation
        </div>
      </div>
    </div>

    <div class="page">
      <div class="page-content">
        <div class="page-number">5</div>
        <div class="page-title">MekoReader</div>
        <div class="page-description">
          End of Turn.js PoC
        </div>
      </div>
    </div>

  </div>

  <div id="status">Page 1 / 5</div>

  <div id="instruction">
    Drag / Swipe / Tap page edge
  </div>

</div>

<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js"></script>

<script>
  try {

    $(document).ready(function() {

      $('#flipbook').turn({
        width: 280,
        height: 400,

        display: 'single',

        acceleration: true,
        gradients: true,
        elevation: 50,

        duration: 700,

        when: {
          turned: function(event, page) {
            $('#status').text(
              'Page ' + page + ' / 5'
            );
          }
        }
      });

    });

  } catch (error) {

    document.getElementById('status').innerText =
      'ERROR: ' + error.message;

  }
</script>

</body>
</html>
`;

function TurnJsFlipTestScreen() {
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
            'Turn.js WebView error:',
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

export default TurnJsFlipTestScreen;