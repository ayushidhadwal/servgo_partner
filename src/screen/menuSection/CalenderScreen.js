import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import i18n from 'i18next';

import * as userActions from '../../store/actions/user';
import DaySection from '../../components/DaySection';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';

const CalenderScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();
  const {calender} = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getCalender());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const _updateHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(userActions.updateCalender());
      alert('Schedule updated Successfully !!!');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch, setError]);

  if (loading) {
    return <Loader />;
  }
  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView showsverticalscrollindicator={false}>
        <DaySection
          name={i18n.t('langChange:sun')}
          selected={calender.sunday}
          start1={calender.sunday_start}
          end1={calender.sunday_end}
          start2={calender.sunday_start_two}
          end2={calender.sunday_end_two}
        />
        <DaySection
          name={i18n.t('langChange:mon')}
          selected={calender.monday}
          start1={calender.monday_start}
          end1={calender.monday_end}
          start2={calender.monday_start_two}
          end2={calender.monday_end_two}
        />
        <DaySection
          name={i18n.t('langChange:tue')}
          selected={calender.tuesday}
          start1={calender.tuesday_start}
          end1={calender.tuesday_end}
          start2={calender.tuesday_start_two}
          end2={calender.tuesday_end_two}
        />
        <DaySection
          name={i18n.t('langChange:wed')}
          selected={calender.wednesday}
          start1={calender.wednesday_start}
          end1={calender.wednesday_end}
          start2={calender.wednesday_start_two}
          end2={calender.wednesday_end_two}
        />
        <DaySection
          name={i18n.t('langChange:thur')}
          selected={calender.thursday}
          start1={calender.thursday_start}
          end1={calender.thursday_end}
          start2={calender.thursday_start_two}
          end2={calender.thursday_end_two}
        />
        <DaySection
          name={i18n.t('langChange:fri')}
          selected={calender.friday}
          start1={calender.friday_start}
          end1={calender.friday_end}
          start2={calender.friday_start_two}
          end2={calender.friday_end_two}
        />
        <DaySection
          name={i18n.t('langChange:sat')}
          selected={calender.saturday}
          start1={calender.saturday_start}
          end1={calender.saturday_end}
          start2={calender.saturday_start_two}
          end2={calender.saturday_end_two}
        />
      </ScrollView>
      <Button
        mode={'contained'}
        style={{
          width: '60%',
          alignSelf: 'center',
          borderRadius: RFValue(20),
          marginTop: RFValue(10),
        }}
        contentStyle={{height: 45}}
        onPress={() => _updateHandler()}
        loading={loading}
        disabled={loading}>
        {i18n.t('langChange:updBtn')}
      </Button>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(5),
  },
});
export default CalenderScreen;
