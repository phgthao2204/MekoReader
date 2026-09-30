import React from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Reader'>;

function ReaderScreen({navigation, route}: Props) {
  const {book} = route.params;
  const currentPage = Math.max(1, book.currentPage || 1);
  const chapter = [...book.tableOfContents]
    .reverse()
    .find(entry => entry.page <= currentPage);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Đóng trình đọc"
          accessibilityRole="button"
          onPress={navigation.goBack}
          style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text numberOfLines={1} style={styles.title}>{book.title}</Text>
          <Text style={styles.pageLabel}>Trang {currentPage} / {book.totalPages}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.readerArea}>
        <View style={styles.pageShadow}>
          <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageKicker}>{book.category}</Text>
            <Text style={styles.chapterTitle}>{chapter?.title ?? book.title}</Text>
            <Text style={styles.bodyText}>{book.description}</Text>
            <Text style={styles.bodyText}>
              Đây là nội dung hiển thị mẫu cho trang {currentPage}. Page Asset thực tế sẽ được thay thế
              bằng ảnh trang hoặc dữ liệu tài liệu từ Liferay ở bước tích hợp nguồn sách.
            </Text>
            <View style={styles.pageFooter}>
              <Text style={styles.footerBrand}>MEKOREADER</Text>
              <Text style={styles.footerPage}>{currentPage}</Text>
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>Đã mở sách thành công</Text>
      </View>
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
  readerArea: {alignItems: 'center', flex: 1, justifyContent: 'center', padding: 18},
  pageShadow: {backgroundColor: '#FFFFFF', borderRadius: 4, elevation: 8, height: '100%', maxWidth: 620, overflow: 'hidden', shadowColor: '#000000', shadowOffset: {height: 8, width: 0}, shadowOpacity: 0.28, shadowRadius: 14, width: '100%'},
  page: {backgroundColor: '#FFFDF7', flexGrow: 1, paddingHorizontal: 28, paddingVertical: 30},
  pageKicker: {color: '#7A8798', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase'},
  chapterTitle: {color: '#1E3048', fontSize: 28, fontWeight: '900', lineHeight: 34, marginTop: 20},
  bodyText: {color: '#3F4C5E', fontSize: 16, lineHeight: 27, marginTop: 22},
  pageFooter: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 36},
  footerBrand: {color: '#98A2AF', fontSize: 9, fontWeight: '800', letterSpacing: 1},
  footerPage: {color: '#758195', fontSize: 11, fontWeight: '700'},
  infoBar: {alignItems: 'center', paddingBottom: 10, paddingHorizontal: 18, paddingTop: 8},
  infoText: {color: '#DCE6F2', fontSize: 12, fontWeight: '800'},
});

export default ReaderScreen;
