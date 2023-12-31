import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Linking,
  Platform,
  StatusBar,
  Alert,
  Share,
  I18nManager,
  View,
} from 'react-native';
import i18n from 'i18next';
import RNRestart from 'react-native-restart';
import { Button, Card, Divider } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Colors from '../../constant/Colors';
import * as authActions from '../../store/actions/auth';
import { LANG_TOKEN, setAppLanguage } from '../../store/actions/lang';
import { useError } from '../../hooks/useError';

const MenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { lang } = useSelector(state => state.lang);
  const setError = useError();

  const logoutHandler = async () => {
    setError(null);
    try {
      await dispatch(authActions.logout());
    } catch (e) {
      setError(e.message);
    }
  };

  const _onShare = useCallback(async () => {
    try {
      await Share.share({
        message:
          Platform.OS === 'ios'
            ? 'itms-apps://apps.apple.com/in/app/servgo/id1579091212'
            : 'https://play.google.com/store/apps/details?id=com.servgo.app',
      });
    } catch (e) {
      setError(e.message);
    }
  }, [setError]);

  return (
    <View style={styles.screen} edges={['bottom']}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{i18n.t('langChange:jobs')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('job')}>
            <MaterialIcons
              name="work-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:statusScreenTitle')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Wallet')}>
            <MaterialIcons
              name="account-balance-wallet"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:menuBal')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('withdrawal')}>
            <MaterialCommunityIcons
              name="bank-transfer-out"
              size={27}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuWithdraw')}
            </Text>
          </Pressable>
        </Card>
        <Text style={styles.heading}>{i18n.t('langChange:acc')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Plans')}>
            <Ionicons
              name="bookmarks"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:menuPrem')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Branch')}>
            <Entypo
              name="flow-tree"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:myBranch')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('profile_details')}>
            <Ionicons
              name="person"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuProfile')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('updateProfile')}>
            <FontAwesome5
              name="user-edit"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:updateProfile')}
            </Text>
          </Pressable>
          <Divider />

          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('UpdateMobile')}>
            <FontAwesome5
              name="mobile-alt"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:updateMobile')}</Text>
          </Pressable>

          <Divider />

          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('UpdateEmail')}>
            <MaterialCommunityIcons
              name="email-edit-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:updateEmail')}</Text>
          </Pressable>
          <Divider />

          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('categories')}>
            <Ionicons
              name="md-list-sharp"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuService')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('services')}>
            <MaterialIcons
              name="add-task"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuEditService')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('ProductsList')}>
            <Fontisto
              name="shopping-bag-1"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:products')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('OrderTopTab')}>
            <FontAwesome5
              name="clipboard-list"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:orders')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Delivery')}>
            <MaterialCommunityIcons
              name="truck-fast-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:delivery')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('DeliveryCharges')}>
            <MaterialIcons
              name="payment"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:deliveryCharges')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Calender')}>
            <Ionicons
              name="md-calendar-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:menuCal')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() =>
              navigation.navigate('gallery', {
                name: 'gallery',
              })
            }>
            <Ionicons
              name="images"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuGallery')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('myReview')}>
            <MaterialIcons
              name="rate-review"
              size={24}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuReview')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Complaint')}>
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuComplaint')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('updatepassword')}>
            <Ionicons
              name="lock-closed"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuSecurity')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => {
              Alert.alert(
                i18n.t('langChange:changeLanguage'),
                i18n.t('langChange:restartAppWarn'),
                [
                  {
                    text: i18n.t('langChange:english'),
                    onPress: async () => {
                      if (lang === 'en') {
                        return null;
                      }
                      dispatch(setAppLanguage('en'));
                      await i18n.changeLanguage('en');
                      await AsyncStorage.setItem(LANG_TOKEN, 'en');
                      I18nManager.forceRTL(false);
                      RNRestart.Restart();
                    },
                  },
                  {
                    text: i18n.t('langChange:arabic'),
                    onPress: async () => {
                      if (lang === 'ar') {
                        return null;
                      }
                      dispatch(setAppLanguage('ar'));
                      await i18n.changeLanguage('ar');
                      await AsyncStorage.setItem(LANG_TOKEN, 'ar');
                      I18nManager.forceRTL(true);
                      RNRestart.Restart();
                    },
                  },
                ],
                { cancelable: false },
              );
            }}>
            <Ionicons
              name="language"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:menuLang')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('account')}>
            <MaterialCommunityIcons
              name="bank"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:menuBank')}</Text>
          </Pressable>
        </Card>
        <Text style={styles.heading}>{i18n.t('langChange:other')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable style={styles.row1} onPress={_onShare}>
            <FontAwesome5
              name="user-plus"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuRefer')}
            </Text>
          </Pressable>
        </Card>
        <Text style={styles.heading}>{i18n.t('langChange:support')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => Linking.openURL('https://serv-go.com/contact-us')}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{i18n.t('langChange:menuCont')}</Text>
          </Pressable>
        </Card>
        <Text style={styles.heading}>{i18n.t('langChange:app')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() =>
              Linking.openURL('https://serv-go.com/terms-and-conditions')
            }>
            <MaterialIcons
              name="list-alt"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuTerms')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() =>
              Linking.openURL('https://serv-go.com/privacy-and-cookies-policy')
            }>
            <Ionicons
              name="eye"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuPrivacy')}
            </Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() =>
              Linking.openURL(
                Platform.OS === 'ios'
                  ? 'itms-apps://apps.apple.com/in/app/servgo/id1579091212'
                  : 'https://play.google.com/store/apps/details?id=com.servgo.app',
              )
            }>
            <Ionicons
              name="download-outline"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:menuDownload')}
            </Text>
          </Pressable>
        </Card>
        <Text style={styles.heading}>{i18n.t('langChange:dangerous')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('DeleteAccount')}>
            <Ionicons name="trash-bin" size={22} color={Colors.primary} />
            <Text style={styles.rowTitle}>
              {i18n.t('langChange:deleteAccount')}
            </Text>
          </Pressable>
        </Card>
        <Text style={styles.deleteMsg}>{i18n.t('langChange:deleteMsg')}</Text>
        <Button mode="outlined" style={styles.btn} onPress={logoutHandler}>
          {i18n.t('langChange:logoutBtn')}
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    color: Colors.grey,
    fontSize: 16,
    padding: RFValue(8),
    fontWeight: 'bold',
    marginTop: 10,
  },
  iosHeading: {
    marginTop: RFValue(-18),
    fontWeight: 'bold',
  },
  row1: {
    flexDirection: 'row',
    marginHorizontal: RFValue(10),
    alignItems: 'center',
  },
  cardContainer: {
    padding: RFValue(5),
    borderRadius: RFValue(6),
    width: '95%',
    alignSelf: 'center',
  },
  rowTitle: {
    fontSize: 17,
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(10),
  },

  deleteMsg: {
    fontSize: 13,
    paddingHorizontal: RFValue(15),
    paddingBottom: RFValue(10),
    paddingTop: RFValue(5),
    color: 'grey',
  },
  btn: {
    marginTop: RFValue(25),
    marginBottom: RFValue(25),
    width: '60%',
    alignSelf: 'center',
  },
  heading1: {
    fontWeight: 'bold',
  },
});

export default MenuScreen;
