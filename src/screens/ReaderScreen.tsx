import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import FlipbookView from '../components/FlipbookView';
import {FlipbookCommand, FlipbookEvent} from '../components/FlipbookView.types';
import {RootStackParamList} from '../navigation/AppNavigator';
import {createFlipbookHtml} from '../services/flipbook-html';

type Props = StackScreenProps<RootStackParamList, 'Reader'>;

function ReaderScreen({navigation, route}: Props) {
  const {book} = route.params;
  const initialPage = Math.max(1, book.currentPage || 1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [command, setCommand] = useState<FlipbookCommand>();
  const html = useMemo(() => createFlipbookHtml(book), [book]);

  const handleEvent = useCallback((event: FlipbookEvent) => {
    if (event.type === 'error') {
      setErrorMessage(event.message);
      setIsReady(false);
      return;
    }
    setCurrentPage(event.page);
    setIsReady(true);
    setErrorMessage('');
  }, []);

  const sendCommand = (action: FlipbookCommand['action']) => {
    setCommand(previous => ({action, sequence: (previous?.sequence ?? 0) + 1}));
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Đóng trình đọc" accessibilityRole="button" onPress={navigation.goBack} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text numberOfLines={1} style={styles.title}>{book.title}</Text>
          <Text style={styles.pageLabel}>Trang {currentPage} / {book.totalPages}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.readerArea}>
        <FlipbookView command={command} html={html} onEvent={handleEvent} />
        {!isReady && !errorMessage && (
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.overlayTitle}>Đang mở sách...</Text>
            <Text style={styles.overlayText}>Đang khởi tạo StPageFlip</Text>
          </View>
        )}
      </View>

      {errorMessage.length > 0 && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.controls}>
        <Pressable
          accessibilityLabel="Trang trước"
          accessibilityRole="button"
          disabled={!isReady || currentPage <= 1}
          onPress={() => sendCommand('previous')}
          style={({pressed}) => [styles.controlButton, (!isReady || currentPage <= 1) && styles.controlButtonDisabled, pressed && styles.controlButtonPressed]}>
          <Text style={styles.controlIcon}>‹</Text>
          <Text style={styles.controlText}>Trang trước</Text>
        </Pressable>
        <View style={styles.counter}>
          <Text style={styles.counterCurrent}>{currentPage}</Text>
          <Text style={styles.counterTotal}>/{book.totalPages}</Text>
        </View>
        <Pressable
          accessibilityLabel="Trang sau"
          accessibilityRole="button"
          disabled={!isReady || currentPage >= book.totalPages}
          onPress={() => sendCommand('next')}
          style={({pressed}) => [styles.controlButton, (!isReady || currentPage >= book.totalPages) && styles.controlButtonDisabled, pressed && styles.controlButtonPressed]}>
          <Text style={styles.controlText}>Trang sau</Text>
          <Text style={styles.controlIcon}>›</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>Kéo, vuốt hoặc chạm cạnh trang để lật sách</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {backgroundColor: '#101A2B', flex: 1},
  header: {alignItems: 'center', flexDirection: 'row', minHeight: 58, paddingHorizontal: 14},
  closeButton: {alignItems: 'center', backgroundColor: '#23344E', borderRadius: 12, height: 40, justifyContent: 'center', width: 40},
  closeButtonText: {color: '#FFFFFF', fontSize: 29, lineHeight: 31},
  headerText: {alignItems: 'center', flex: 1, paddingHorizontal: 10},
  title: {color: '#FFFFFF', fontSize: 15, fontWeight: '800', maxWidth: '100%'},
  pageLabel: {color: '#9EB0C7', fontSize: 11, marginTop: 4},
  headerSpacer: {width: 40},
  readerArea: {flex: 1, overflow: 'hidden'},
  overlay: {alignItems: 'center', backgroundColor: '#152237', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0},
  overlayTitle: {color: '#FFFFFF', fontSize: 17, fontWeight: '800'},
  overlayText: {color: '#91A4BD', fontSize: 12, marginTop: 7},
  errorText: {backgroundColor: '#532B35', color: '#FFD9DF', fontSize: 12, paddingHorizontal: 16, paddingVertical: 8, textAlign: 'center'},
  controls: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 12},
  controlButton: {alignItems: 'center', backgroundColor: '#23344E', borderRadius: 12, flexDirection: 'row', gap: 6, justifyContent: 'center', minHeight: 44, paddingHorizontal: 14},
  controlButtonDisabled: {opacity: 0.38},
  controlButtonPressed: {backgroundColor: '#304868'},
  controlIcon: {color: '#FFFFFF', fontSize: 26, lineHeight: 27},
  controlText: {color: '#FFFFFF', fontSize: 12, fontWeight: '800'},
  counter: {alignItems: 'baseline', flexDirection: 'row'},
  counterCurrent: {color: '#FFFFFF', fontSize: 19, fontWeight: '900'},
  counterTotal: {color: '#91A4BD', fontSize: 12, marginLeft: 3},
  hint: {color: '#768BA6', fontSize: 10, paddingBottom: 8, paddingTop: 8, textAlign: 'center'},
});

export default ReaderScreen;
