import * as yup from 'yup';
import { AppString } from '../constants/AppString';
import type { LoginForm } from '../src/redux/types';

/**
 * Yup schemas for react-hook-form (`useForm({ resolver: yupResolver(schema) })`).
 * Each schema is typed against its form type in src/redux/types.d.ts, so the
 * two can't drift apart. Messages come from AppString, never inline strings.
 */
export const loginSchema: yup.ObjectSchema<LoginForm> = yup.object({
  email: yup.string().trim().email(AppString.invalidEmail).required(AppString.emailRequired),
  password: yup.string().min(6, AppString.passwordMin).required(AppString.passwordRequired),
});
