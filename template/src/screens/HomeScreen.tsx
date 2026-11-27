import React from 'react';
import { View } from 'react-native';

// Components
import Screen from '../components/Screen';
import { AppText, Button, Card } from '../components/ui';

// Hooks / state
import { useTheme } from '../hooks/ThemeContext';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearAuth, selectCurrentUser } from '../redux/slices/authSlice';

// Helpers / constants
import { navigateAndSimpleReset } from '../helper/navigation-service';
import { AppString } from '../../constants/AppString';

const HomeScreen = () => {
  const { toggleTheme, setPreference, mode, preference } = useTheme();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(clearAuth());
    navigateAndSimpleReset('LoginScreen');
  };

  return (
    <Screen className="justify-center">
      <AppText variant="title1">
        {AppString.hello}
        {user?.name ? `, ${user.name}` : ''}
      </AppText>
      <AppText variant="secondary" className="mt-2 text-body1">
        {AppString.homeIntro}
      </AppText>

      <Card className="mt-8 p-5">
        <AppText variant="overline">{AppString.currentTheme}</AppText>
        <AppText variant="headline" className="mt-1 capitalize">
          {mode} · {preference}
        </AppText>
      </Card>

      <View className="mt-6 gap-3">
        <Button label={AppString.toggleTheme} onPress={toggleTheme} />
        <Button
          label={AppString.followSystem}
          variant="outline"
          onPress={() => setPreference('system')}
          disabled={preference === 'system'}
        />
        <Button
          label={AppString.logout}
          variant="outline"
          labelClassName="text-error"
          onPress={onLogout}
        />
      </View>
    </Screen>
  );
};

export default HomeScreen;
