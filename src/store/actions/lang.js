import AsyncStorage from '@react-native-async-storage/async-storage';
export const LANG_TOKEN = '@ServGo:languageId';

export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setAppLanguage = lang => {
  return async dispatch => {
    await AsyncStorage.setItem(LANG_TOKEN, lang);
    dispatch({
      type: SET_LANGUAGE,
      lang: lang,
    });
  };
};
