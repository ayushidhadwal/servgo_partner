import {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';

export const useError = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: String(error),
        onHide: () => setError(null),
      });
    }
  }, [error]);

  return setError;
};
