import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

import {FlipbookViewProps, parseFlipbookEvent} from './FlipbookView.types';

function FlipbookView({command, html, onEvent}: FlipbookViewProps) {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (!command) return;
    webViewRef.current?.postMessage(JSON.stringify({action: command.action}));
  }, [command]);

  return (
    <WebView
      ref={webViewRef}
      allowsInlineMediaPlayback
      javaScriptEnabled
      onMessage={event => {
        const payload = parseFlipbookEvent(event.nativeEvent.data);
        if (payload) onEvent(payload);
      }}
      originWhitelist={['*']}
      source={{html}}
      style={styles.webView}
    />
  );
}

const styles = StyleSheet.create({webView: {backgroundColor: '#152237', flex: 1}});

export default FlipbookView;
