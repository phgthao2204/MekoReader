import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';

function PdfTestScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MekoReader - PDF PoC</Text>

        <Text style={styles.pageCounter}>
          Trang {currentPage} / {totalPages || '?'}
        </Text>
      </View>

      <Pdf
        source={{uri: 'bundle-assets://sample.pdf'}}
        style={styles.pdf}
        horizontal={true}
        enablePaging={true}
        enableDoubleTapZoom={true}
        onLoadComplete={numberOfPages => {
          console.log(`PDF loaded: ${numberOfPages} pages`);
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Page ${page}/${numberOfPages}`);
          setCurrentPage(page);
          setTotalPages(numberOfPages);
        }}
        renderActivityIndicator={() => <ActivityIndicator size="large" />}
        onError={error => {
          console.log('PDF ERROR:', error);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageCounter: {
    marginTop: 4,
    fontSize: 14,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});

export default PdfTestScreen;