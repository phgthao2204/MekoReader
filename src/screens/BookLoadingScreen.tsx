import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../navigation/AppNavigator';
import {prepareBookForReading} from '../services/reader';

type Props = StackScreenProps<RootStackParamList, 'BookLoading'>;
type LoadingState = 'loading' | 'error';

function BookLoadingScreen({navigation, route}: Props) {
  const {book} = route.params;
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  const prepareBook = useCallback(() => {
    setLoadingState('loading');
    setErrorMessage('');
    setAttempt(value => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    prepareBookForReading(book)
      .then(result => {
        if (!cancelled) {
          navigation.replace('Reader', {book: result.book});
        }
      })
      .catch(error => {
        if (cancelled) return;
        setErrorMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu sách.');
        setLoadingState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, book, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <Pressable accessibilityLabel="Hủy tải sách" accessibilityRole="button" onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>Chuẩn bị sách</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <View style={styles.content}>
        <View style={[styles.cover, {backgroundColor: book.coverColor}]}>
          <Text style={styles.documentType}>{book.documentType === 'pdf' ? 'PDF' : 'PAGE ASSETS'}</Text>
          <View>
            <Text numberOfLines={4} style={styles.coverTitle}>{book.title}</Text>
            <Text numberOfLines={1} style={styles.coverAuthor}>{book.author}</Text>
          </View>
          <Text style={styles.coverPages}>{book.totalPages} trang</Text>
        </View>

        {loadingState === 'loading' ? (
          <View style={styles.statusSection}>
            <ActivityIndicator color="#214F8C" size="large" />
            <Text style={styles.statusTitle}>Đang tải dữ liệu sách...</Text>
            <Text style={styles.statusDescription}>
              {book.documentType === 'pdf'
                ? 'Đang kiểm tra tài liệu PDF và chuẩn bị các trang để hiển thị.'
                : 'Đang chuẩn bị danh sách ảnh trang cho trình đọc.'}
            </Text>
          </View>
        ) : (
          <View style={styles.statusSection}>
            <Text style={styles.errorIcon}>!</Text>
            <Text style={styles.statusTitle}>Tải sách chưa thành công</Text>
            <Text style={styles.statusDescription}>{errorMessage}</Text>
            <Pressable accessibilityRole="button" onPress={prepareBook} style={({pressed}) => [styles.retryButton, pressed && styles.retryButtonPressed]}>
              <Text style={styles.retryButtonText}>Thử tải lại</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Text style={styles.note}>Trình đọc chỉ được mở sau khi dữ liệu đã sẵn sàng.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {backgroundColor: '#F6F8FC', flex: 1},
  topBar: {alignItems: 'center', flexDirection: 'row', minHeight: 54, paddingHorizontal: 16},
  backButton: {alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE5EF', borderRadius: 12, borderWidth: 1, height: 40, justifyContent: 'center', width: 40},
  backButtonText: {color: '#214F8C', fontSize: 33, lineHeight: 34, marginTop: -2},
  topBarTitle: {color: '#172A45', flex: 1, fontSize: 17, fontWeight: '800', textAlign: 'center'},
  topBarSpacer: {width: 40},
  content: {alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24},
  cover: {borderRadius: 16, elevation: 6, height: 238, justifyContent: 'space-between', padding: 18, shadowColor: '#172A45', shadowOffset: {height: 7, width: 0}, shadowOpacity: 0.2, shadowRadius: 12, width: 162},
  documentType: {color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '800', letterSpacing: 0.9},
  coverTitle: {color: '#FFFFFF', fontSize: 20, fontWeight: '900', lineHeight: 24},
  coverAuthor: {color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 7},
  coverPages: {color: 'rgba(255,255,255,0.76)', fontSize: 10, fontWeight: '700'},
  statusSection: {alignItems: 'center', marginTop: 34, maxWidth: 430, width: '100%'},
  statusTitle: {color: '#172A45', fontSize: 20, fontWeight: '900', marginTop: 17, textAlign: 'center'},
  statusDescription: {color: '#66768B', fontSize: 14, lineHeight: 21, marginTop: 9, textAlign: 'center'},
  errorIcon: {backgroundColor: '#FCE2E5', borderRadius: 99, color: '#AA3545', fontSize: 25, fontWeight: '900', height: 50, lineHeight: 50, textAlign: 'center', width: 50},
  retryButton: {backgroundColor: '#214F8C', borderRadius: 12, marginTop: 21, paddingHorizontal: 22, paddingVertical: 13},
  retryButtonPressed: {backgroundColor: '#173C6D'},
  retryButtonText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
  note: {color: '#8A97A8', fontSize: 11, paddingBottom: 14, paddingHorizontal: 20, textAlign: 'center'},
});

export default BookLoadingScreen;
