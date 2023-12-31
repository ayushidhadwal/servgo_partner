import {RFValue} from 'react-native-responsive-fontsize';
import {Text} from 'react-native';
import * as React from 'react';
import {memo, useEffect, useRef, useState} from 'react';

import Colors from '../constant/Colors';

const DEFAULT = 120;
const ResendOtp = ({onSubmit, style = {}}) => {
  const [timer, setTimer] = useState(DEFAULT);

  const interval = useRef();

  useEffect(() => {
    interval.current = setInterval(() => {
      setTimer(time => {
        return time > 0 ? time - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  const onPress = () => {
    onSubmit().then(() => setTimer(DEFAULT));
  };

  return (
    <Text style={[{marginTop: RFValue(20), fontWeight: 'bold'}, style]}>
      Didn't receive OTP?{' '}
      {timer === 0 ? (
        <Text onPress={onPress} style={{color: Colors.primary}}>
          resend
        </Text>
      ) : (
        <Text style={{color: Colors.primary}}>resend in {timer}</Text>
      )}
    </Text>
  );
};

export default memo(ResendOtp);
