import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Pressable,
  Modal,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Headline, Title, Subheading} from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18next';

import * as userActions from '../../store/actions/user';
import {IMG_URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';

const ProfileDetails = ({navigation}) => {
  const dispatch = useDispatch();
  const {partner} = useSelector(state => state.user);
  const setError = useError();

  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.set_Profile());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const imgClickHandler = () => {
    setImg(true);
  };

  useEffect(() => {
    setImage({
      uri: partner.photo
        ? IMG_URL + partner.photo
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            partner.firstname,
          )}`,
    });
  }, [partner]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.screen}>
      <>
        <Pressable onPress={imgClickHandler}>
          <View style={styles.imgContainer}>
            <Image
              source={image}
              style={[styles.img, {borderRadius: 200}]}
              onError={() => {
                setImage({
                  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    partner.name,
                  )}`,
                });
              }}
            />
            {img && (
              <Modal
                visible={img}
                transparent={true}
                onRequestClose={() => setImg(false)}>
                <ImageViewer
                  imageUrls={[image]}
                  enableSwipeDown={true}
                  onSwipeDown={() => setImg(false)}
                />
              </Modal>
            )}
          </View>
        </Pressable>
        <View style={styles.content}>
          <Headline style={styles.company_name}>
            {partner.company_name}
          </Headline>
          <Text style={styles.address}>{partner.address}</Text>
          <Subheading style={styles.subheading}>
            {i18n.t('langChange:contUs')}:
          </Subheading>
          <Text
            style={
              styles.name
            }>{`${partner.firstname} ${partner.lastname}`}</Text>
          <Text style={styles.email}>{partner.email}</Text>

          <Text
            style={{
              paddingTop: RFValue(2),
            }}>{`${partner.phone_code} ${partner.mobile}`}</Text>
          <Subheading style={styles.subheading}>
            {i18n.t('langChange:abtUs')}:
          </Subheading>
          <Text style={styles.aboutUs}>{partner.business_name}</Text>
          <Text style={styles.aboutUs}>{partner.profession}</Text>
          <Subheading style={styles.subheading}>
            {i18n.t('langChange:ourExp')}:
          </Subheading>
          <Text style={styles.text}>{partner.experience_text}</Text>
        </View>
        {partner.twitter_link ||
        partner.facebook_link ||
        partner.instagram_link ? (
          <>
            <Title style={styles.content2}>
              {i18n.t('langChange:followUs')}:
            </Title>
            <View style={styles.content1}>
              {partner.twitter_link && (
                <Ionicons
                  name="logo-twitter"
                  size={26}
                  color={Colors.grey}
                  onPress={() => Linking.openURL(partner.twitter_link)}
                />
              )}
              {partner.facebook_link && (
                <Ionicons
                  name="logo-facebook"
                  size={26}
                  color={Colors.grey}
                  onPress={() => Linking.openURL(partner.facebook_link)}
                />
              )}
              {partner.instagram_link && (
                <Ionicons
                  name="logo-instagram"
                  size={26}
                  color={Colors.grey}
                  onPress={() => Linking.openURL(partner.instagram_link)}
                />
              )}
            </View>
          </>
        ) : null}
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 10,
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  content: {
    padding: RFValue(15),
  },
  content1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: RFValue(20),
  },
  subheading: {
    marginTop: RFValue(12),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  name: {
    textTransform: 'capitalize',
    fontSize: RFValue(14),
  },
  company_name: {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  address: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  email: {
    textTransform: 'lowercase',
    fontSize: RFValue(14),
  },
  aboutUs: {
    textTransform: 'capitalize',
    fontSize: RFValue(14),
  },
  text: {
    fontSize: RFValue(14),
  },
  content2: {
    paddingHorizontal: RFValue(15),
    textDecorationLine: 'underline',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileDetails;
