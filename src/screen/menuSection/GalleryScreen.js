import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {FAB} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import i18n from 'i18next';

import * as userActions from '../../store/actions/user';
import {URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';
import {Image} from '../../components/Image';

const GalleryScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {getGallery} = useSelector(state => state.user);

  const addImages = async files => {
    setUploading(true);
    setError(null);
    try {
      await dispatch(userActions.addImages(files));
      await dispatch(userActions.getGallery());
    } catch (e) {
      setError(e.message);
    }
    setUploading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(userActions.getGallery());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

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
        selectionLimit: 0,
      });
      await addImages(result.assets);
    } catch (e) {
      setError(e.message);
    }
  };

  const _deleteImg = async imageId => {
    Alert.alert(
      i18n.t('langChange:alertTitle'),
      i18n.t('langChange:alertGalleryMsg'),
      [
        {
          text: i18n.t('langChange:cancelBtn'),
        },
        {
          text: i18n.t('langChange:okBtn'),
          onPress: async () => {
            setError(null);
            try {
              await dispatch(userActions.deleteImage(imageId));
              await dispatch(userActions.getGallery());
            } catch (e) {
              setError(e.message);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (uploading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text
          style={{
            fontSize: 12,
            color: Colors.primary,
            textAlign: 'center',
          }}>
          uploading....
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {getGallery.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(17),
              color: Colors.primary,
              textAlign: 'center',
            }}>
            {
              'No Images Added Yet !!! \n Please add some using add button below.'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={getGallery}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          numColumns={3}
          renderItem={({item}) => {
            return (
              <View style={styles.container}>
                <Image
                  source={{
                    uri: URL + item.image_path,
                  }}
                  style={styles.img}
                />

                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={Colors.primary}
                  style={styles.delete}
                  onPress={() => _deleteImg(item.id)}
                />
              </View>
            );
          }}
        />
      )}
      <FAB style={styles.fab} icon="plus" onPress={_pickImageHandler} />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: RFValue(10),
  },
  container: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#ffff',
    marginBottom: 9,
    marginLeft: 12,
    padding: 8,
    width: 110,
    height: 110,
  },
  img: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default GalleryScreen;
