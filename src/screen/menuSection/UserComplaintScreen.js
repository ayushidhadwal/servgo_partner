import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import dayjs from 'dayjs';

import * as userActions from '../../store/actions/user';
import Colors from '../../constant/Colors';
import i18n from 'i18next';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';

const TextRow = ({heading, desc}) => {
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.headingStyle}>{heading}:</Text>
      <Text style={styles.textStyle}>{desc}</Text>
    </View>
  );
};

const UserComplaintScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const {complaints} = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(userActions.getComplaints());
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
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      {complaints.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(17),
              color: Colors.primary,
              textAlign: 'center',
            }}>
            {i18n.t('langChange:noComplaint')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          renderItem={({item, index}) => {
            return (
              <Card style={styles.cardStyle}>
                <TextRow
                  heading={i18n.t('langChange:statusBookId')}
                  desc={item.cr_booking_id}
                />
                <TextRow
                  heading={i18n.t('langChange:uname')}
                  desc={item.username}
                />
                <TextRow
                  heading={i18n.t('langChange:complaintSubj')}
                  desc={item.cr_subject}
                />
                <TextRow
                  heading={i18n.t('langChange:complaint')}
                  desc={item.cr_comment}
                />
                <TextRow
                  heading={i18n.t('langChange:dateTime')}
                  desc={dayjs(item.created_at).format('DD-MM-YYYY , hh:mm a')}
                />
                <Button
                  mode={'contained'}
                  style={{
                    width: '30%',
                    marginTop: RFValue(10),
                    borderRadius: RFValue(100),
                    alignSelf: 'flex-end',
                  }}
                  icon={'reply-all'}
                  contentStyle={{flexDirection: 'row-reverse'}}
                  onPress={() =>
                    navigation.navigate('feedBack', {
                      complaintId: item.id,
                      bookingId: item.cr_booking_id,
                    })
                  }>
                  {i18n.t('langChange:replyBtn')}
                </Button>
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 12,
  },
  cardStyle: {
    padding: RFValue(10),
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(5),
  },
  headingStyle: {
    flex: 0.5,
    fontWeight: 'bold',
  },
  textStyle: {
    flex: 1,
    textAlign: 'right',
  },
});

export default UserComplaintScreen;
