import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {loadBookCatalog} from '../services/catalog';
import {LibraryBook, ReadingStatus} from '../types/book';

type ViewMode = 'grid' | 'list';
type ScreenState = 'loading' | 'ready' | 'error';

const statusLabels: Record<ReadingStatus, string> = {
  notStarted: 'Chưa đọc',
  reading: 'Đang đọc',
  completed: 'Đã hoàn thành',
};

const statusStyles: Record<ReadingStatus, {backgroundColor: string; color: string}> = {
  notStarted: {backgroundColor: '#E8EEF8', color: '#315A92'},
  reading: {backgroundColor: '#FFF0CD', color: '#925900'},
  completed: {backgroundColor: '#DDF5E8', color: '#167443'},
};

function BookCover({book, compact = false}: {book: LibraryBook; compact?: boolean}) {
  return (
    <View style={[styles.cover, compact && styles.compactCover, {backgroundColor: book.coverColor}]}>
      <Text style={styles.documentType}>{book.documentType === 'pdf' ? 'PDF' : 'ẢNH'}</Text>
      <View>
        <Text numberOfLines={compact ? 3 : 4} style={[styles.coverTitle, compact && styles.compactCoverTitle]}>
          {book.title}
        </Text>
        <Text numberOfLines={1} style={styles.coverAuthor}>
          {book.author}
        </Text>
      </View>
      <Text style={styles.pageCount}>{book.totalPages} trang</Text>
    </View>
  );
}

function ReadingStatusBadge({status}: {status: ReadingStatus}) {
  const colors = statusStyles[status];
  return (
    <View style={[styles.statusBadge, {backgroundColor: colors.backgroundColor}]}>
      <Text style={[styles.statusText, {color: colors.color}]}>{statusLabels[status]}</Text>
    </View>
  );
}

function BookCard({book, mode}: {book: LibraryBook; mode: ViewMode}) {
  const isList = mode === 'list';
  return (
    <View style={[styles.bookCard, isList ? styles.listCard : styles.gridCard]}>
      <BookCover book={book} compact={isList} />
      <View style={[styles.bookDetails, isList && styles.listBookDetails]}>
        <ReadingStatusBadge status={book.readingStatus} />
        <Text numberOfLines={2} style={styles.bookTitle}>{book.title}</Text>
        <Text numberOfLines={1} style={styles.bookAuthor}>{book.author}</Text>
        <Text numberOfLines={1} style={styles.category}>{book.category}</Text>
        {book.readingStatus !== 'notStarted' && (
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {width: `${book.completionPercent}%`}]}/>
            </View>
            <Text style={styles.progressText}>
              Trang {book.currentPage}/{book.totalPages} - {book.completionPercent}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function HomeScreen() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [catalogIssues, setCatalogIssues] = useState<string[]>([]);
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const refreshCatalog = useCallback(async () => {
    setScreenState('loading');
    try {
      const result = await loadBookCatalog();
      setBooks(result.books);
      setCatalogIssues(result.issues.map(issue => issue.message));
      setScreenState('ready');
    } catch {
      setScreenState('error');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadBookCatalog()
      .then(result => {
        if (cancelled) return;
        setBooks(result.books);
        setCatalogIssues(result.issues.map(issue => issue.message));
        setScreenState('ready');
      })
      .catch(() => {
        if (!cancelled) setScreenState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (screenState === 'loading') {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator color="#214F8C" size="large" />
        <Text style={styles.loadingText}>Đang nạp thư viện sách...</Text>
      </SafeAreaView>
    );
  }

  if (screenState === 'error') {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Không thể nạp thư viện</Text>
        <Text style={styles.errorDescription}>Vui lòng kiểm tra dữ liệu catalog rồi thử lại.</Text>
        <Pressable onPress={refreshCatalog} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MEKOBOOK READER</Text>
          <Text style={styles.heading}>Thư viện của bạn</Text>
          <Text style={styles.subheading}>{books.length} đầu sách sẵn sàng để đọc</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={refreshCatalog} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Nạp lại</Text>
        </Pressable>
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.toolbarLabel}>Hiển thị</Text>
        <View style={styles.viewSwitcher}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{selected: viewMode === 'grid'}}
            onPress={() => setViewMode('grid')}
            style={[styles.switchButton, viewMode === 'grid' && styles.switchButtonActive]}>
            <Text style={[styles.switchButtonText, viewMode === 'grid' && styles.switchButtonTextActive]}>Lưới</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{selected: viewMode === 'list'}}
            onPress={() => setViewMode('list')}
            style={[styles.switchButton, viewMode === 'list' && styles.switchButtonActive]}>
            <Text style={[styles.switchButtonText, viewMode === 'list' && styles.switchButtonTextActive]}>Danh sách</Text>
          </Pressable>
        </View>
      </View>

      {catalogIssues.length > 0 && (
        <View style={styles.issueBanner}>
          <Text style={styles.issueText}>
            Đã bỏ qua {catalogIssues.length} mục dữ liệu chưa hợp lệ. Chọn “Nạp lại” sau khi cập nhật catalog.
          </Text>
        </View>
      )}

      <FlatList
        key={viewMode}
        data={books}
        keyExtractor={book => book.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        renderItem={({item}) => <BookCard book={item} mode={viewMode}/>}
        contentContainerStyle={[styles.bookList, books.length === 0 && styles.emptyBookList]}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có sách hợp lệ trong thư viện.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F8FC'},
  loadingScreen: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F8FC', padding: 24},
  loadingText: {marginTop: 16, color: '#526276', fontSize: 15},
  errorTitle: {color: '#172A45', fontSize: 22, fontWeight: '700'},
  errorDescription: {color: '#526276', fontSize: 15, marginTop: 8, textAlign: 'center'},
  retryButton: {backgroundColor: '#214F8C', borderRadius: 10, marginTop: 20, paddingHorizontal: 18, paddingVertical: 12},
  retryButtonText: {color: '#FFFFFF', fontSize: 14, fontWeight: '700'},
  header: {alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 22},
  eyebrow: {color: '#416B9F', fontSize: 11, fontWeight: '800', letterSpacing: 1.2},
  heading: {color: '#172A45', fontSize: 28, fontWeight: '800', letterSpacing: -0.4, marginTop: 4},
  subheading: {color: '#6B7A90', fontSize: 14, marginTop: 4},
  refreshButton: {borderColor: '#C6D5E7', borderRadius: 9, borderWidth: 1, marginTop: 8, paddingHorizontal: 11, paddingVertical: 8},
  refreshButtonText: {color: '#214F8C', fontSize: 13, fontWeight: '700'},
  toolbar: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14},
  toolbarLabel: {color: '#526276', fontSize: 14, fontWeight: '600'},
  viewSwitcher: {backgroundColor: '#E9EEF5', borderRadius: 9, flexDirection: 'row', padding: 3},
  switchButton: {borderRadius: 7, paddingHorizontal: 12, paddingVertical: 7},
  switchButtonActive: {backgroundColor: '#FFFFFF', elevation: 1, shadowColor: '#172A45', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 2},
  switchButtonText: {color: '#6B7A90', fontSize: 13, fontWeight: '700'},
  switchButtonTextActive: {color: '#214F8C'},
  issueBanner: {backgroundColor: '#FFF3D8', borderRadius: 10, marginHorizontal: 20, marginBottom: 12, padding: 12},
  issueText: {color: '#7A5310', fontSize: 13, lineHeight: 18},
  bookList: {paddingHorizontal: 20, paddingBottom: 32},
  emptyBookList: {flexGrow: 1, justifyContent: 'center'},
  gridRow: {gap: 14, justifyContent: 'space-between'},
  bookCard: {backgroundColor: '#FFFFFF', borderColor: '#E6EBF2', borderRadius: 14, borderWidth: 1, marginBottom: 14, overflow: 'hidden'},
  gridCard: {flex: 1, maxWidth: '48%'},
  listCard: {flexDirection: 'row', minHeight: 154, padding: 10},
  cover: {aspectRatio: 0.68, justifyContent: 'space-between', minHeight: 190, padding: 14},
  compactCover: {alignSelf: 'stretch', minHeight: undefined, width: 88},
  documentType: {color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: '800', letterSpacing: 0.8},
  coverTitle: {color: '#FFFFFF', fontSize: 19, fontWeight: '800', letterSpacing: -0.3, lineHeight: 23},
  compactCoverTitle: {fontSize: 14, lineHeight: 17},
  coverAuthor: {color: 'rgba(255,255,255,0.82)', fontSize: 11, marginTop: 7},
  pageCount: {color: 'rgba(255,255,255,0.78)', fontSize: 10, fontWeight: '700'},
  bookDetails: {padding: 12},
  listBookDetails: {flex: 1, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 5},
  statusBadge: {alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4},
  statusText: {fontSize: 10, fontWeight: '800'},
  bookTitle: {color: '#1C2B3E', fontSize: 15, fontWeight: '800', lineHeight: 20, marginTop: 9},
  bookAuthor: {color: '#526276', fontSize: 13, marginTop: 3},
  category: {color: '#416B9F', fontSize: 12, fontWeight: '600', marginTop: 7},
  progressSection: {marginTop: 10},
  progressTrack: {backgroundColor: '#E7ECF3', borderRadius: 99, height: 5, overflow: 'hidden'},
  progressFill: {backgroundColor: '#2E8C6C', borderRadius: 99, height: '100%'},
  progressText: {color: '#6B7A90', fontSize: 10, marginTop: 5},
  emptyText: {color: '#6B7A90', fontSize: 15, textAlign: 'center'},
});

export default HomeScreen;
