import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import i18n from 'i18next';

import * as requestAction from '../../store/actions/request';
import Colors from '../../constant/Colors';
import {useError} from '../../hooks/useError';
import Loader from '../../components/Loader';
import {successMessage} from '../../utils/success-message';

const CategoryScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [number, setNumber] = useState([]);

  const dispatch = useDispatch();
  const setError = useError();
  const {services} = useSelector(state => state.request);
  const {lang} = useSelector(state => state.lang);

  useEffect(() => {
    if (services.length > 0) {
      setNumber(
        services
          .filter(service => service.selectedService)
          .map(item => item.id),
      );
    }
  }, [services]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getServices());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const _onServiceSelectHandler = id => {
    setNumber(preState => {
      const nums = [...preState];
      const i = nums.findIndex(n => Number(n) === Number(id));
      if (i >= 0) {
        nums.splice(i, 1);
      } else {
        nums.push(id);
      }
      return nums;
    });
  };

  const submitHandler = async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.selectServices(number));
      setBtnLoading(false);
      successMessage('Success', 'Updated successfully.');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  };

  return (
    <View style={styles.screen}>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={services}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          style={styles.list}
          ListFooterComponent={() => (
            <Button
              mode="contained"
              style={styles.btn}
              loading={btnLoading}
              disabled={btnLoading}
              onPress={submitHandler}>
              {i18n.t('langChange:saveChange')}
            </Button>
          )}
          renderItem={({item}) => {
            const found = number.find(n => Number(n) === Number(item.id));
            return (
              <Pressable
                onPress={() => _onServiceSelectHandler(item.id)}
                style={[styles.container, found ? styles.onfocusbutton : null]}>
                <Image
                  source={{
                    uri:
                      'https://serv-go.com/public/images/services/' +
                      item.service_icon,
                  }}
                  style={styles.img}
                />
                <Text style={styles.name}>
                  {lang === 'en' ? item.en_service_name : item.ar_service_name}
                </Text>
                <View style={styles.check} />
              </Pressable>
            );
          }}
          numColumns={3}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  btn: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: RFValue(15),
  },
  list: {
    marginVertical: RFValue(20),
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#ffff',
    marginBottom: RFValue(5),
    marginLeft: RFValue(9),
    padding: RFValue(8),
    width: wp('30%'),
    // height: hp('17%'),
  },
  onfocusbutton: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#dfe9f7',
    marginBottom: RFValue(5),
    marginLeft: RFValue(9),
    padding: RFValue(8),
    width: wp('30%'),
    // height: hp('17%'),
  },
  img: {
    width: RFValue(50),
    height: RFValue(50),
    alignSelf: 'center',
  },
  name: {
    color: Colors.black,
    textAlign: 'center',
    marginTop: RFValue(5),
  },
  check: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
  },
});

export default CategoryScreen;
