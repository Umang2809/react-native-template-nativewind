import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppStackParams } from '../navigation/AppStackParams';
import { useAppSelector } from '../redux/store';
import { selectAccessToken } from '../redux/slices/authSlice';
import { useTheme } from '../hooks/ThemeContext';
import { AppText } from '../components/ui';
import { name as appName } from '../../app.json';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, 'SplashScreen', 'SplashScreen'>;
  route: RouteProp<AppStackParams, 'SplashScreen'>;
};

const SplashScreen = ({ navigation }: Props) => {
  const accessToken = useAppSelector(selectAccessToken);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: accessToken ? 'HomeScreen' : 'LoginScreen' }],
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [accessToken, navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <AppText variant="title1">{appName}</AppText>
      <ActivityIndicator className="mt-6" color={theme.primary} />
    </View>
  );
};

export default SplashScreen;
