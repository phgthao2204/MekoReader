import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import FlipbookView from '../components/FlipbookView';
import {FlipbookEvent} from '../components/FlipbookView.types';
import {RootStackParamList} from '../navigation/AppNavigator';
import {createFlipbookHtml} from '../services/flipbook-html';

type Props = StackScreenProps<RootStackParamList, 'Reader'>;

function ReaderScreen({navigation, route}: Props) {
  const {book} = route.params;
  const initialPage = Math.max(1, book.currentPage || 1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
        <FlipbookView html={html} onEvent={handleEvent} />
        {!isReady && !errorMessage && (
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.overlayTitle}>Đang mở sách...</Text>
            <Text style={styles.overlayText}>Đang khởi tạo StPageFlip</Text>
          </View>
        )}
      </View>

      {errorMessage.length > 0 && <Text style={styles.errorText}>{errorMessage}</Text>}
      <Text style={styles.hint}>Kéo hoặc vuốt trực tiếp trên trang để xem hiệu ứng lật 3D</Text>
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
  hint: {color: '#768BA6', fontSize: 10, paddingHorizontal: 16, paddingVertical: 10, textAlign: 'center'},
});

export default ReaderScreen;
