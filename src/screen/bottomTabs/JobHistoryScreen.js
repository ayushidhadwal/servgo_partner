import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Card} from 'react-native-paper';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {useError} from '../../hooks/useError';
import Loader from '../../components/Loader';
import i18next from 'i18next';

const JobHistoryScreen = ({navigation}) => {
  const {jobHistoryList} = useSelector(state => state.request);

  const [loading, setLoading] = useState(true);

  const setError = useError();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_job_history());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      {jobHistoryList.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.activity}>{i18next.t('langChange:jobCompleted')}</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={jobHistoryList}
          keyExtractor={item => item.booking_id}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.cardContainer,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <Button
                  contentStyle={{height: 35}}
                  labelStyle={{fontWeight: 'bold', fontSize: RFValue(12)}}
                  mode="outlined"
                  uppercase={false}
                  style={{
                    width: '40%',
                    alignSelf: 'flex-end',
                    marginBottom: RFValue(5),
                  }}
                  onPress={() =>
                    navigation.navigate('HistoryStatus', {
                      booking_id: item.booking_id,
                    })
                  }>
                  {i18n.t('langChange:seeDetailsBtn')}
                </Button>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}> */}
                <Text style={styles.text}>
                  {i18n.t('langChange:statusBookId')}: {item.booking_id}
                </Text>
                {/* </View> */}
                <Text style={styles.status}>
                  {i18n.t('langChange:statusType')}: {item.service_status}
                </Text>
                <Text style={item.sub_service_name}>
                  {i18n.t('langChange:jobDoneAt')}: {item.created_at}
                </Text>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  cardContainer: {
    padding: RFValue(10),
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-18),
    fontWeight: 'bold',
  },
  service_name: {
    fontSize: RFValue(15),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  status: {
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: 'green',
  },
  text: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
  },
  subService: {
    fontSize: RFValue(15),
  },
});

export default JobHistoryScreen;
