import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {FlipbookViewProps, parseFlipbookEvent} from './FlipbookView.types';

type BrowserWindow = {
  addEventListener: (type: string, listener: (event: {data: unknown}) => void) => void;
  removeEventListener: (type: string, listener: (event: {data: unknown}) => void) => void;
};

function FlipbookView({html, onEvent}: FlipbookViewProps) {
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

  const frame = React.createElement('iframe', {
    srcDoc: html,
    style: {border: 0, height: '100%', width: '100%'},
    title: 'MekoReader Flipbook',
  });

  return <View style={styles.container}>{frame}</View>;
}

const styles = StyleSheet.create({container: {backgroundColor: '#152237', flex: 1}});

export default FlipbookView;
