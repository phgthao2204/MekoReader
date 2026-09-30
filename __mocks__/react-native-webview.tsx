import React from 'react';
import {View} from 'react-native';

export const WebView = React.forwardRef<View>((props, ref) => <View ref={ref} {...props} />);
WebView.displayName = 'MockWebView';
