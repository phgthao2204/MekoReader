import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';

import {FlipbookViewProps, parseFlipbookEvent} from './FlipbookView.types';

type BrowserWindow = {
  addEventListener: (type: string, listener: (event: {data: unknown}) => void) => void;
  removeEventListener: (type: string, listener: (event: {data: unknown}) => void) => void;
};

type FrameHandle = {
  contentWindow?: {postMessage: (message: string, targetOrigin: string) => void};
};

function FlipbookView({command, html, onEvent}: FlipbookViewProps) {
  const frameRef = useRef<FrameHandle | null>(null);

  useEffect(() => {
    const browserWindow = globalThis as unknown as BrowserWindow;
    const handleMessage = (event: {data: unknown}) => {
      const raw = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
      const payload = parseFlipbookEvent(raw);
      if (payload) onEvent(payload);
    };
    browserWindow.addEventListener('message', handleMessage);
    return () => browserWindow.removeEventListener('message', handleMessage);
  }, [onEvent]);

  useEffect(() => {
    if (!command) return;
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({action: command.action}), '*');
  }, [command]);

  const frame = React.createElement('iframe', {
    ref: frameRef,
    srcDoc: html,
    style: {border: 0, height: '100%', width: '100%'},
    title: 'MekoReader Flipbook',
  });

  return <View style={styles.container}>{frame}</View>;
}

const styles = StyleSheet.create({container: {backgroundColor: '#152237', flex: 1}});

export default FlipbookView;
