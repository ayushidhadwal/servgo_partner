import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {useError} from '../../hooks/useError';
import {successMessage} from '../../utils/success-message';
import Loader from '../../components/Loader';

const TXNScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenloading, setScreenLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();
  const {tax} = useSelector(state => state.request);

  const {trn_name, trn_number} = tax;
  useEffect(() => {
    if (trn_name) {
      setName(trn_name);
    }

    if (trn_number) {
      setNumber(trn_number);
    }
  }, [trn_name, trn_number]);

  const onclickHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.updateTax(name, number));
      setLoading(false);
      successMessage('Success', 'Updated Successfully!');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setScreenLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getTax());
      } catch (e) {
        setError(e.message);
      } finally {
        setScreenLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  if (screenloading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>{i18n.t('langChange:trnName')}</Text>
          <Text style={{color: Colors.grey}}>
            {i18n.t('langChange:trnNameMsg')}
          </Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>{i18n.t('langChange:taxReg')}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={number}
            onChangeText={setNumber}
          />
          <Button
            mode="outlined"
            icon="check"
            loading={loading}
            disabled={loading}
            onPress={onclickHandler}
            style={{alignSelf: 'center', marginBottom: RFValue(15)}}>
            {i18n.t('langChange:saveBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    justifyContent: 'space-between',
  },
  nameContainer: {
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  nameContainer1: {
    padding: RFValue(20),
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  input1: {
    marginBottom: RFValue(15),
  },
  input2: {
    marginBottom: RFValue(20),
  },
});

export default TXNScreen;
