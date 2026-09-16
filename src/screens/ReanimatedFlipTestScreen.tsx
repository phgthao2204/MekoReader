import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const PAGE_WIDTH = SCREEN_WIDTH - 40;
const SWIPE_THRESHOLD = PAGE_WIDTH * 0.25;

const pages = [
  {number: 1, title: 'Trang 1', content: 'MekoReader Flipbook PoC'},
  {number: 2, title: 'Trang 2', content: 'React Native Reanimated'},
  {number: 3, title: 'Trang 3', content: 'Gesture Controlled Page Flip'},
  {number: 4, title: 'Trang 4', content: 'Perspective + RotateY'},
  {number: 5, title: 'Trang 5', content: 'End of Demo'},
];

function ReanimatedFlipTestScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  const dragX = useSharedValue(0);

  const changePage = (direction: number) => {
    setCurrentPage(previous => {
      if (direction === 1) {
        return Math.min(previous + 1, pages.length - 1);
      }

      return Math.max(previous - 1, 0);
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      dragX.value = event.translationX;
    })
    .onEnd(event => {
      if (
        event.translationX < -SWIPE_THRESHOLD &&
        currentPage < pages.length - 1
      ) {
        dragX.value = withSpring(-PAGE_WIDTH, {}, finished => {
          if (finished) {
            runOnJS(changePage)(1);
            dragX.value = 0;
          }
        });
      } else if (
        event.translationX > SWIPE_THRESHOLD &&
        currentPage > 0
      ) {
        dragX.value = withSpring(PAGE_WIDTH, {}, finished => {
          if (finished) {
            runOnJS(changePage)(-1);
            dragX.value = 0;
          }
        });
      } else {
        dragX.value = withSpring(0);
      }
    });

  const animatedPageStyle = useAnimatedStyle(() => {
    const progress = Math.max(
      -1,
      Math.min(1, dragX.value / PAGE_WIDTH),
    );

    const rotateY = progress * 75;

    return {
      transform: [
        {perspective: 1200},
        {translateX: dragX.value / 2},
        {rotateY: `${rotateY}deg`},
      ],
    };
  });

  const page = pages[currentPage];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Hướng A - Reanimated Flip Test
      </Text>

      <Text style={styles.counter}>
        {currentPage + 1} / {pages.length}
      </Text>

      <View style={styles.bookContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.page, animatedPageStyle]}>
            <Text style={styles.pageNumber}>
              {page.title}
            </Text>

            <Text style={styles.content}>
              {page.content}
            </Text>

            <Text style={styles.instruction}>
              Kéo sang trái / phải để chuyển trang
            </Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eeeeee',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  counter: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },

  bookContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  page: {
    width: PAGE_WIDTH,
    height: '75%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    elevation: 5,
  },

  pageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  content: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },

  instruction: {
    position: 'absolute',
    bottom: 30,
    fontSize: 14,
  },
});

export default ReanimatedFlipTestScreen;