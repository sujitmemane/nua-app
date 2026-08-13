import Toast, { BaseToast, ErrorToast, InfoToast, type ToastConfig } from 'react-native-toast-message';

import { colors, fontFamily } from '@/constants/theme';

const text1Style = {
  fontFamily: fontFamily.semibold,
  fontSize: 15,
  color: colors.textPrimary,
};

const text2Style = {
  fontFamily: fontFamily.regular,
  fontSize: 13,
  color: colors.textSecondary,
};

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.success }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: colors.error }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: colors.primary }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
};

export { Toast };
