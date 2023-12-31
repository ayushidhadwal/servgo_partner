import Toast from 'react-native-toast-message';

export const successMessage = (title, message) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });
};
