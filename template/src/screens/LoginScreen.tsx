import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Types
import { AppStackParams } from '../navigation/AppStackParams';
import type { LoginForm } from '../redux/types';

// Components
import Screen from '../components/Screen';
import { AppText, Button, TextField } from '../components/ui';

// State
import { useAppDispatch } from '../redux/store';
import { setCredentials } from '../redux/slices/authSlice';

// Helpers / constants
import { showSnackbar } from '../helper/common-functions';
import { isIOS } from '../helper/utility-functions';
import { AppString } from '../../constants/AppString';
import { loginSchema } from '../../utils/schema';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, 'LoginScreen'>;
  route: RouteProp<AppStackParams, 'LoginScreen'>;
};

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    // Demo only: stores dummy credentials. With a real backend, call the
    // mutation instead:
    //   const { mutate: login, isPending } = useLogin();
    //   login(data, {
    //     onSuccess: res => dispatch(setCredentials(res)),
    //     onError: err => showErrorSnackbar(getErrorMessage(err)),
    //   });
    dispatch(
      setCredentials({
        user: { id: '1', name: 'Demo User', email: data.email },
        accessToken: 'dummy-access-token-123',
      }),
    );
    showSnackbar(AppString.loginSuccess);
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : undefined}
        className="flex-1 justify-center">
        <AppText variant="title1" className="text-center">
          {AppString.welcomeBack}
        </AppText>
        <AppText variant="secondary" className="mb-8 mt-2 text-center">
          {AppString.signInToContinue}
        </AppText>

        <View className="gap-4">
          <TextField
            control={control}
            name="email"
            label={AppString.email}
            placeholder={AppString.enterEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            isRequired
          />
          <TextField
            control={control}
            name="password"
            label={AppString.password}
            placeholder={AppString.enterPassword}
            autoComplete="password"
            onSubmitEditing={handleSubmit(onSubmit)}
            isPassword
            isLast
            isRequired
          />
        </View>

        <Button label={AppString.login} onPress={handleSubmit(onSubmit)} className="mt-6" />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default LoginScreen;
