import {Modal, StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, TextInput} from 'react-native-paper';
import i18n from 'i18next';
import React, {useState} from 'react';

import {useError} from '../../hooks/useError';

export const RejectLeadModal = ({isLoading, onSubmit}) => {
  const [reason, setReason] = useState('');
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible(!visible);
  const setError = useError();

  const onLeadReject = () => {
    if (!reason) {
      setError('Reason is required!');
      return;
    }

    onSubmit(reason, 'REJECTED').then(() => toggleVisible());
  };

  const onLeadReschedule = () => {
    if (!reason) {
      setError('Reason is required!');
      return;
    }

    onSubmit(reason, 'RESCHEDULE').then(() => toggleVisible());
  };

  return (
    <>
      <Button
        mode="outlined"
        labelStyle={{color: 'red'}}
        onPress={toggleVisible}>
        {i18n.t('langChange:rejBtn')}
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={toggleVisible}>
        <View style={styles.centeredView}>
          <View style={{padding: RFValue(12), backgroundColor: '#fff'}}>
            <TextInput
              label={i18n.t('langChange:rejectReason')}
              placeholder={i18n.t('langChange:rejectReason')}
              value={reason}
              onChangeText={setReason}
              multiline={true}
              style={{
                backgroundColor: 'transparent',
                marginBottom: RFValue(10),
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button
                loading={isLoading}
                disabled={isLoading}
                mode="contained"
                onPress={onLeadReject}
                color="red">
                {i18n.t('langChange:rejBtn')}
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                mode="contained"
                onPress={onLeadReschedule}>
                {i18n.t('langChange:reschduleBtn')}
              </Button>
              <Button mode="contained" onPress={toggleVisible} color="gray">
                {i18n.t('langChange:closeBtn')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
