import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  I18nManager,
  Alert,
  Keyboard,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import Colors from '../../constant/Colors';
import * as authActions from '../../store/actions/auth';
import {useDispatch} from 'react-redux';
import {useError} from '../../hooks/useError';

const DeleteAccountScreen = ({navigation}) => {
  // const [btnLoading, setBtnLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const accountDeleteHandler = async () => {
    // setBtnLoading(true);
    setError(null);
    try {
      await dispatch(authActions.deletePartnerAccount());
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Text style={{padding: 5, margin: 5}}>
        Are you sure you want to delete your account? If you want to permanently
        delete your account, then type confirm below
      </Text>
      <TextInput
        left={<TextInput.Icon name="account" color={Colors.primary} />}
        mode={I18nManager.isRTL ? 'outlined' : 'flat'}
        label="Confirm"
        style={styles.code}
        // value={name}
        // onChangeText={setName}
      />
      <Button
        mode={'contained'}
        contentStyle={{height: 40}}
        style={styles.btnStyles}
        onPress={() =>
          Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  accountDeleteHandler();
                },
              },
              {text: 'Cancel', onPress: () => navigation.goBack()},
            ],
          )
        }
        // loading={btnLoading}
        // disabled={btnLoading}
      >
        Delete
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  code: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
  },
  btnStyles: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default DeleteAccountScreen;
