import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Card, IconButton} from 'react-native-paper';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {URL} from '../../constant/base_url';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ServicesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const setError = useError();
  const {serviceList} = useSelector(state => state.request);
  const {lang} = useSelector(state => state.lang);
  const {settings} = useSelector(state => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(requestAction.getServiceList());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const {bottom} = useSafeAreaInsets();

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      {serviceList.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: RFValue(20),
              fontWeight: 'bold',
            }}>
            No Services Add Yet !!!
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={serviceList}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.content,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 10,
                      marginTop: 10,
                      flexShrink: 1,
                    }}>
                    <Image
                      source={{
                        uri: URL + item.image_path,
                      }}
                      style={[styles.partnerImgStyles, {marginBottom: 4}]}
                      resizeMode={'cover'}
                    />
                    <View
                      style={{
                        marginLeft: 10,
                        flexShrink: 1,
                      }}>
                      <Text style={styles.text1} numberOfLines={2}>
                        <Text style={{fontWeight: 'bold'}}>
                          {i18n.t('langChange:serviceTable')} :{' '}
                        </Text>
                        {lang === 'en'
                          ? item.en_service_name
                          : item.ar_service_name}
                      </Text>
                      <Text style={styles.text1} numberOfLines={2}>
                        <Text style={{fontWeight: 'bold'}}>
                          {i18n.t('langChange:subCategory')} :{' '}
                        </Text>{' '}
                        {lang === 'en'
                          ? item.en_subcategory_name
                          : item.ar_subcategory_name}
                      </Text>
                      <Text style={styles.text1} numberOfLines={2}>
                        <Text style={{fontWeight: 'bold'}}>
                          {i18n.t('langChange:childCategory')} :{' '}
                        </Text>
                        {lang === 'en'
                          ? item.en_child_category_name
                          : item.ar_child_category_name}
                      </Text>
                    </View>
                  </View>
                  <IconButton
                    icon="square-edit-outline"
                    color={Colors.primary}
                    onPress={() =>
                      navigation.navigate('ServicePrice', {
                        item: item,
                      })
                    }
                  />
                </View>
                <View style={{marginTop: 5, marginLeft: 10, marginBottom: 10}}>
                  <Text style={styles.charge}>
                    <Text style={{fontWeight: 'bold'}}>
                      {i18n.t('langChange:charges')}
                    </Text>{' '}
                    {settings.currency} {item.service_price}
                  </Text>
                  <Text style={styles.desc}>{item.service_desc}</Text>
                  {item.status === 1 ? (
                    <Text style={styles.text4}>
                      {i18n.t('langChange:statusActive')}
                    </Text>
                  ) : (
                    <Text style={styles.text5}>
                      {i18n.t('langChange:statusInactive')}
                    </Text>
                  )}
                </View>
              </Card>
            );
          }}
        />
      )}
      <Button
        mode="contained"
        style={[styles.btn, {bottom: bottom ? bottom : 20}]}
        contentStyle={{flexDirection: 'row-reverse', height: 50}}
        icon="plus-circle"
        onPress={() => navigation.navigate('addService')}>
        {i18n.t('langChange:addServiceBtn')}
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heading: {
    fontWeight: 'bold',
  },
  subHeading: {
    textAlign: 'center',
    fontSize: RFValue(16),
    paddingTop: RFValue(250),
  },
  btn: {
    width: '45%',
    borderRadius: RFValue(20),
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  content: {
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    borderRadius: 4,
  },
  text1: {
    fontSize: 13,
    color: '#000',
    marginTop: RFValue(2),
  },
  Service: {
    fontSize: RFValue(13),
    fontWeight: 'bold',
    color: '#000',
  },
  charge: {
    fontSize: 13,
    marginBottom: RFValue(2),
    color: '#000',
  },
  desc: {
    fontSize: 13,
    color: 'grey',
  },
  text2: {
    fontSize: 13,
    color: '#808080',
  },
  text4: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
  text3: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 3,
  },
  text5: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#808080',
    marginTop: 3,
  },
  partnerImgStyles: {
    width: 100,
    height: 100,
    borderWidth: 0.5,
    borderColor: '#ababab',
  },
});

export default ServicesScreen;
