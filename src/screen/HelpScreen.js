import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, View, Text, Alert, Platform} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

import * as requestAction from '../store/actions/request';
import Colors from '../constant/Colors';
import {successMessage} from '../utils/success-message';
import {useError} from '../hooks/useError';

const HelpScreen = ({navigation}) => {
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const onclickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.help(comment, image));
      setLoading(false);
      successMessage('Help', 'Request sent successfully.');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [comment, dispatch, image, navigation, setError]);

  const _pickImageHandler = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _openImagePicker();
            break;
          case RESULTS.UNAVAILABLE:
            setError('This feature is not available on this device!');
            break;
          case RESULTS.DENIED:
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                _openImagePicker();
              }
            });
            break;
          case RESULTS.LIMITED:
            _openImagePicker();
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(settingsErr =>
              setError('Unable to open settings!'),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _openImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if ('assets' in result) {
        result.assets.forEach(asset => {
          setImage({
            name: asset.fileName,
            uri: asset.uri,
            type: asset.type,
          });
        });
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <Title style={styles.heading}>{i18n.t('langChange:helpScreen')}</Title>
      <TextInput
        mode="outlined"
        label={i18n.t('langChange:helpTextLabel')}
        style={styles.input}
        multiline
        numberOfLines={10}
        value={comment}
        onChangeText={text => setComment(text)}
      />
      <Button
        mode="outlined"
        icon="attachment"
        style={styles.attachment}
        labelStyle={{
          fontSize: RFValue(13),
          color: Colors.black,
        }}
        uppercase={false}
        onPress={_pickImageHandler}>
        {i18n.t('langChange:helpAttachBtn')}
      </Button>
      {image && (
        <View style={styles.rowStyle}>
          <Text style={styles.text}>{i18n.t('langChange:helpUploadText')}</Text>
          <Ionicons name="checkmark-done" size={24} color={Colors.primary} />
        </View>
      )}
      <Button
        mode="contained"
        style={styles.submit}
        onPress={onclickHandler}
        loading={loading}
        disabled={loading}>
        {i18n.t('langChange:submitBtn')}
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(15),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: RFValue(40),
  },
  heading: {
    marginBottom: RFValue(15),
    fontWeight: 'bold',
  },
  attachment: {
    alignSelf: 'center',
    marginVertical: RFValue(15),
    borderRadius: RFValue(100),
    width: '60%',
  },
  submit: {
    width: '90%',
    alignSelf: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: RFValue(10),
  },
  text: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default HelpScreen;
