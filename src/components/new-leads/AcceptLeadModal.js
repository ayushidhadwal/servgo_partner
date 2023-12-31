import React, {useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, TextInput} from 'react-native-paper';
import i18n from 'i18next';

export const AcceptLeadModal = ({isLoading, onSubmit}) => {
  const [reason, setReason] = useState('');
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible(!visible);

  const onLeadAccept = () => {
    onSubmit(reason, 'ACCEPTED').then(() => toggleVisible());
  };

  return (
    <>
      <Button
        mode="outlined"
        labelStyle={{color: 'green'}}
        onPress={toggleVisible}>
        {i18n.t('langChange:acceptBtn')}
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={toggleVisible}>
        <View style={styles.centeredView}>
          <View style={{padding: RFValue(12), backgroundColor: '#fff'}}>
            <TextInput
              label={i18n.t('langChange:acceptReason')}
              placeholder={i18n.t('langChange:acceptReason')}
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
                onPress={onLeadAccept}>
                {i18n.t('langChange:acceptBtn')}
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
