import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Modal} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {Button, Card, TextInput, Title} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import i18n from 'i18next';

import * as userActions from '../../store/actions/user';
import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {successMessage} from '../../utils/success-message';
import {useError} from '../../hooks/useError';

const WithdrawalScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [amt, setAmt] = useState('');

  const setError = useError();
  const dispatch = useDispatch();

  const {getWithdrawalList} = useSelector(state => state.user);
  const {settings} = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getWithdrawalRequest());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const _requestHandler = useCallback(async () => {
    setRequestLoading(true);
    setError(null);
    try {
      await dispatch(userActions.sendRequest(amt));
      successMessage('Withdraw', 'Request sent successfully.');
      navigation.navigate('withdrawal');
    } catch (e) {
      setError(e.message.toString());
    } finally {
      setAmt('');
      setModalVisible(false);
    }
    setRequestLoading(false);
  }, [amt, dispatch, navigation, setError]);

  const {bottom} = useSafeAreaInsets();

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      {getWithdrawalList.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(14),
              color: Colors.primary,
              textAlign: 'center',
            }}>
            No Withdrawal Request
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={getWithdrawalList}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            return (
              <Card style={styles.cardContainer}>
                <Text style={[styles.font, {marginBottom: 4}]}>
                  {i18n.t('langChange:amtReq')}: {settings.currency}{' '}
                  {item.wr_amount}
                </Text>
                <Text
                  style={
                    item.wr_status === 'PENDING'
                      ? [styles.status, {color: Colors.primary}]
                      : item.wr_status === 'ACCEPTED'
                      ? [styles.status, {color: Colors.darkYellow}]
                      : item.wr_status === 'REJECTED'
                      ? [styles.status, {color: 'red'}]
                      : item.wr_status === 'COMPLETED'
                      ? [styles.status, {color: 'green'}]
                      : null
                  }>
                  {i18n.t('langChange:statusType')}: {item.wr_status}
                </Text>

                <Text style={[styles.font, {fontSize: 12, textAlign: 'right'}]}>
                  {dayjs(item.created_at).format('DD MMM YYYY hh:mm a')}
                </Text>
              </Card>
            );
          }}
        />
      )}

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.rowStyle}>
                <Title style={{color: Colors.primary}}>
                  {i18n.t('langChange:withdrawReq')}
                </Title>
                <AntDesign
                  name="closecircle"
                  size={24}
                  color={Colors.primary}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
              <TextInput
                mode={'outlined'}
                keyboardType={'number-pad'}
                value={amt}
                onChangeText={text => setAmt(text)}
                label={i18n.t('langChange:reqLabel')}
              />
              <Button
                mode={'contained'}
                style={styles.btnStyles}
                loading={requestLoading}
                disabled={requestLoading}
                onPress={_requestHandler}>
                {i18n.t('langChange:request')}
              </Button>
            </View>
          </View>
        </Modal>
      </View>

      <Button
        mode={'contained'}
        icon="plus"
        onPress={() => setModalVisible(true)}
        style={[styles.fab, {bottom: bottom}]}
        contentStyle={{height: 45}}>
        {i18n.t('langChange:newReq')}
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cardContainer: {
    margin: 12,
    padding: 12,
    borderRadius: 4,
  },
  font: {
    fontSize: RFValue(12),
  },
  status: {
    fontSize: RFValue(12),
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    width: '45%',
    borderRadius: RFValue(20),
  },
  /// modal css
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  btnStyles: {
    width: '50%',
    alignSelf: 'center',
    borderRadius: RFValue(20),
    marginTop: RFValue(20),
  },
});
export default WithdrawalScreen;
