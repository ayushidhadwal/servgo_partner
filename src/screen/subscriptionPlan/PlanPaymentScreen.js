import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {I18nManager, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';

import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import {useError} from '../../hooks/useError';

const PlanPaymentScreen = props => {
  const {planId, amount} = props.route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [cvv, setCvv] = useState('');

  const setError = useError();
  const dispatch = useDispatch();
  const {settings} = useSelector(state => state.auth);

  const onPayClickHandler = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(
        userActions.payForPlan(planId, amount, cardNumber, month, year, cvv),
      );

      setIsLoading(false);
      alert('Payment Successfully Done!');
      props.navigation.pop(2);
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <Title style={styles.heading}>
          <Text style={{color: 'black'}}>Payable Amount:{'\n'}</Text>{' '}
          {settings.currency} {amount}
        </Title>
        <TextInput
          left={<TextInput.Icon name="credit-card" color={Colors.grey} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          keyboardType="number-pad"
          maxLength={16}
          style={styles.input1}
          placeholder={'0000-0000-0000-0000'}
          label="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <View style={styles.subContent}>
          <TextInput
            left={
              <TextInput.Icon name="calendar-outline" color={Colors.grey} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            keyboardType="number-pad"
            style={styles.input2}
            placeholder={'MM'}
            label="Month"
            maxLength={2}
            value={month}
            onChangeText={setMonth}
          />
          <TextInput
            left={<TextInput.Icon name="calendar-blank" color={Colors.grey} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            keyboardType="number-pad"
            label="Year"
            style={styles.input2}
            placeholder={'YYYY'}
            maxLength={4}
            value={year}
            onChangeText={setYear}
          />
          <TextInput
            left={<TextInput.Icon name="lock" color={Colors.grey} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            keyboardType="number-pad"
            style={styles.input2}
            placeholder={'***'}
            label="CVC/CVV"
            secureTextEntry
            maxLength={4}
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
        <Button
          mode="contained"
          style={styles.btn}
          contentStyle={{height: 55}}
          labelStyle={{fontWeight: 'bold', fontSize: RFValue(15)}}
          disabled={isLoading}
          loading={isLoading}
          onPress={onPayClickHandler}>
          Pay
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(12),
  },
  heading: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: RFValue(18),
  },
  content: {
    marginVertical: RFValue(15),
  },
  title: {
    color: Colors.grey,
    marginLeft: RFValue(15),
    fontStyle: 'italic',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  title1: {
    color: Colors.grey,
    fontStyle: 'italic',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  input1: {
    backgroundColor: Colors.white,
    width: '100%',
    alignSelf: 'center',
  },
  subContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  Content2: {
    flexDirection: 'column',
    width: '45%',
  },
  btn: {
    marginVertical: RFValue(40),
    width: '40%',
    borderRadius: RFValue(50),
    alignSelf: 'center',
  },
  input2: {
    backgroundColor: Colors.white,
    width: '50%',
    alignSelf: 'center',
  },
  box: {
    flexDirection: 'row',
    borderWidth: RFValue(1),
    marginTop: RFValue(6),
    height: RFValue(51),
    padding: RFValue(12),
    borderColor: Colors.grey,
  },
  content3: {
    flexDirection: 'column',
    width: '45%',
    paddingHorizontal: RFValue(15),
    marginTop: RFValue(10),
  },
});

export default PlanPaymentScreen;
