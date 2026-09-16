import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FlipPage, {FlipPagePage} from 'react-native-flip-page';

const pages = [
  {number: 1, title: 'Trang 1'},
  {number: 2, title: 'Trang 2'},
  {number: 3, title: 'Trang 3'},
  {number: 4, title: 'Trang 4'},
  {number: 5, title: 'Trang 5'},
];

function NativeFlipTestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hướng A - Native Flip Test</Text>

      <View style={styles.book}>
        <FlipPage
          orientation="horizontal"
          uncutPages
          responsive
        >
          {pages.map(page => (
            <FlipPagePage key={page.number}>
              <View style={styles.page}>
                <Text style={styles.pageNumber}>
                  {page.title}
                </Text>

                <Text style={styles.content}>
                  MekoReader Flipbook PoC
                </Text>
              </View>
            </FlipPagePage>
          ))}
        </FlipPage>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eeeeee',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  book: {
    flex: 1,
  },

  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  pageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  content: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default NativeFlipTestScreen;