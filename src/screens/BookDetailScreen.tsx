import React from 'react';
import {Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'BookDetail'>;

function BookDetailScreen({navigation, route}: Props) {
  const {book} = route.params;
  const actionLabel = book.currentPage > 0 ? `Đọc tiếp từ trang ${book.currentPage}` : 'Bắt đầu đọc';
  const hasRemoteCover = /^https?:\/\//i.test(book.coverImage);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <Pressable accessibilityLabel="Quay lại thư viện" accessibilityRole="button" onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.topBarTitle}>Chi tiết sách</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.cover, {backgroundColor: book.coverColor}]}>
          {hasRemoteCover && <Image resizeMode="cover" source={{uri: book.coverImage}} style={styles.coverImage} />}
          <Text style={styles.documentType}>{book.documentType === 'pdf' ? 'PDF' : 'PAGE ASSETS'}</Text>
          <View>
            <Text style={styles.coverTitle}>{book.title}</Text>
            <Text style={styles.coverAuthor}>{book.author}</Text>
          </View>
          <Text style={styles.coverPages}>{book.totalPages} trang</Text>
        </View>

        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        <View style={styles.metadataRow}>
          <Metadata label="Thể loại" value={book.category} />
          <Metadata label="Ngôn ngữ" value={book.language} />
          <Metadata label="Định dạng" value={book.documentType.toUpperCase()} />
        </View>

        {book.currentPage > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeading}>
              <Text style={styles.progressTitle}>Tiến độ đọc</Text>
              <Text style={styles.progressPercent}>{book.completionPercent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {width: `${book.completionPercent}%`}]} />
            </View>
            <Text style={styles.progressCaption}>Trang {book.currentPage} trên {book.totalPages}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.description}>{book.description}</Text>

        <Text style={styles.sectionTitle}>Mục lục</Text>
        <View style={styles.tocCard}>
          {book.tableOfContents.map((entry, index) => (
            <View key={`${entry.title}-${entry.page}`} style={[styles.tocRow, index > 0 && styles.tocRowBorder]}>
              <Text style={styles.tocTitle}>{entry.title}</Text>
              <Text style={styles.tocPage}>Trang {entry.page}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('BookLoading', {book})} style={({pressed}) => [styles.readButton, pressed && styles.readButtonPressed]}>
          <Text style={styles.readButtonText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Metadata({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.metadataItem}>
      <Text style={styles.metadataLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.metadataValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {backgroundColor: '#F6F8FC', flex: 1},
  topBar: {alignItems: 'center', flexDirection: 'row', minHeight: 54, paddingHorizontal: 16},
  backButton: {alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE5EF', borderRadius: 12, borderWidth: 1, height: 40, justifyContent: 'center', width: 40},
  backButtonText: {color: '#214F8C', fontSize: 33, lineHeight: 34, marginTop: -2},
  topBarTitle: {color: '#172A45', flex: 1, fontSize: 17, fontWeight: '800', textAlign: 'center'},
  topBarSpacer: {width: 40},
  content: {alignItems: 'center', paddingBottom: 120, paddingHorizontal: 22, paddingTop: 12},
  cover: {borderRadius: 18, elevation: 7, height: 310, justifyContent: 'space-between', padding: 22, shadowColor: '#172A45', shadowOffset: {height: 8, width: 0}, shadowOpacity: 0.22, shadowRadius: 14, width: 210},
  coverImage: {borderRadius: 18, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0},
  documentType: {color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '800', letterSpacing: 1},
  coverTitle: {color: '#FFFFFF', fontSize: 26, fontWeight: '900', lineHeight: 31},
  coverAuthor: {color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 9},
  coverPages: {color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: '700'},
  title: {color: '#172A45', fontSize: 25, fontWeight: '900', letterSpacing: -0.4, lineHeight: 31, marginTop: 26, textAlign: 'center'},
  author: {color: '#65758B', fontSize: 15, marginTop: 6},
  metadataRow: {flexDirection: 'row', gap: 8, marginTop: 24, width: '100%'},
  metadataItem: {backgroundColor: '#FFFFFF', borderColor: '#E1E8F1', borderRadius: 12, borderWidth: 1, flex: 1, paddingHorizontal: 9, paddingVertical: 12},
  metadataLabel: {color: '#8A97A8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase'},
  metadataValue: {color: '#21344E', fontSize: 12, fontWeight: '800', marginTop: 5},
  progressCard: {backgroundColor: '#FFFFFF', borderColor: '#E1E8F1', borderRadius: 14, borderWidth: 1, marginTop: 18, padding: 16, width: '100%'},
  progressHeading: {flexDirection: 'row', justifyContent: 'space-between'},
  progressTitle: {color: '#21344E', fontSize: 14, fontWeight: '800'},
  progressPercent: {color: '#2E8C6C', fontSize: 14, fontWeight: '900'},
  progressTrack: {backgroundColor: '#E7ECF3', borderRadius: 99, height: 7, marginTop: 12, overflow: 'hidden'},
  progressFill: {backgroundColor: '#2E8C6C', borderRadius: 99, height: '100%'},
  progressCaption: {color: '#758398', fontSize: 11, marginTop: 8},
  sectionTitle: {alignSelf: 'flex-start', color: '#172A45', fontSize: 18, fontWeight: '900', marginTop: 26},
  description: {alignSelf: 'stretch', color: '#526276', fontSize: 15, lineHeight: 23, marginTop: 10},
  tocCard: {backgroundColor: '#FFFFFF', borderColor: '#E1E8F1', borderRadius: 14, borderWidth: 1, marginTop: 11, overflow: 'hidden', width: '100%'},
  tocRow: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 15},
  tocRowBorder: {borderColor: '#EDF1F6', borderTopWidth: 1},
  tocTitle: {color: '#2A3C54', flex: 1, fontSize: 14, fontWeight: '700'},
  tocPage: {color: '#6D7D91', fontSize: 12, marginLeft: 12},
  actionBar: {backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderTopWidth: 1, bottom: 0, left: 0, paddingBottom: 12, paddingHorizontal: 20, paddingTop: 12, position: 'absolute', right: 0},
  readButton: {alignItems: 'center', backgroundColor: '#214F8C', borderRadius: 13, minHeight: 50, justifyContent: 'center'},
  readButtonPressed: {backgroundColor: '#173C6D'},
  readButtonText: {color: '#FFFFFF', fontSize: 15, fontWeight: '900'},
});

export default BookDetailScreen;
