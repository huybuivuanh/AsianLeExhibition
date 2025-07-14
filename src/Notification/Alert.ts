import Toast from 'react-native-toast-message';
import { AlertType } from '../types/enum';

export const showAlert = (alertType: AlertType, message: string) => {
  Toast.show({
    type: alertType,
    text1: message,
  });
};
