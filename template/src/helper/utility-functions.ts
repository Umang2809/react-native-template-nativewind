import { Alert, Keyboard, Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// For sizes, use dp values and NativeWind classes. For the window size, use
// `useWindowDimensions()` inside components (it updates on rotation).

export const hideKeyboard = () => {
  Keyboard.dismiss();
};

export const showAlert = (
  title: string,
  message: string,
  settingsText = 'Open Settings',
  rejectText = 'Reject',
  onSettingsPress: () => void,
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: settingsText,
        onPress: onSettingsPress,
        style: 'default',
      },
      {
        text: rejectText,
        style: 'destructive',
      },
    ],
    { cancelable: false },
  );
};
