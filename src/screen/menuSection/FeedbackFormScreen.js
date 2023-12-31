import React, {useCallback, useState} from 'react';
import {Text, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import {useError} from '../../hooks/useError';
import {successMessage} from '../../utils/success-message';

const FeedbackFormScreen = ({route, navigation}) => {
  const {bookingId, complaintId} = route.params;
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const _submitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(userActions.postFeedback(bookingId, complaintId, comment));
      setLoading(false);
      successMessage('Success', 'Reply sent successfully.');
      navigation.goBack();
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  }, [setError, dispatch, bookingId, complaintId, comment, navigation]);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAwareScrollView showsverticalscrollindicator={false}>
        <Text style={styles.heading}>{i18n.t('langChange:postFeedback')}:</Text>
        <TextInput
          mode={'outlined'}
          numberOfLines={15}
          multiline
          value={comment}
          onChangeText={text => setComment(text)}
        />
        <Button
          mode={'contained'}
          style={styles.btn}
          loading={loading}
          disabled={loading}
          onPress={() => _submitHandler()}>
          {i18n.t('langChange:submitBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(20),
  },
  heading: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  btn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
    borderRadius: 50,
  },
});

export default FeedbackFormScreen;
