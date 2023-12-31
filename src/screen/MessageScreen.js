import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Platform,
  I18nManager,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {moderateScale} from 'react-native-size-matters';
import {Caption} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {SafeAreaView} from 'react-native-safe-area-context';

import * as userActions from '../store/actions/user';
import Colors from '../constant/Colors';
import {useError} from '../hooks/useError';

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardDidShow(e) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const keyboardHide = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  return [keyboardHeight];
};

const MessageScreen = ({route}) => {
  const {bookingId, customerId} = route.params;
  let flatList = useRef();

  const [chatLoading, setChatLoading] = useState(false);
  const [text, setText] = useState('');

  const {getChats} = useSelector(state => state.user);

  const setError = useError();
  const dispatch = useDispatch();

  const [keyboardHeight] = useKeyboard();

  const interval = useRef();
  useEffect(() => {
    dispatch(userActions.getMessage(bookingId, customerId)).catch(e =>
      setError(e.message),
    );

    interval.current = setInterval(() => {
      dispatch(userActions.getMessage(bookingId, customerId)).catch(e =>
        setError(e.message),
      );
    }, 5000);

    return () => {
      clearInterval(interval.current);
    };
  }, [bookingId, customerId, dispatch, setError]);

  const _onSubmitHandler = async () => {
    setChatLoading(true);
    setError(null);
    try {
      await dispatch(userActions.sendMessage(bookingId, text));
      dispatch(userActions.getMessage(bookingId, customerId));
      setText('');
    } catch (e) {
      setError(e.message);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Colors.white,
      }}>
      <FlatList
        ref={ref => (flatList = ref)}
        onContentSizeChange={() => flatList.scrollToEnd({animated: false})}
        onLayout={() => flatList.scrollToEnd({animated: false})}
        keyExtractor={item => `${item.id}${item.created_at}`}
        data={getChats}
        renderItem={itemData => {
          return itemData.item.type === 'vendor' ? (
            <View style={[styles.item, styles.itemOut]}>
              <View style={[styles.balloon, {backgroundColor: Colors.primary}]}>
                <Text style={{paddingTop: 5, color: 'white'}}>
                  {itemData.item.message}
                </Text>
                <Caption style={{color: '#fff'}}>
                  {dayjs(itemData.item.created_at).format('hh:mm a')}
                </Caption>
                <View
                  style={[styles.arrowContainer, styles.arrowRightContainer]}>
                  <Svg
                    style={styles.arrowRight}
                    width={moderateScale(15.5, 0.6)}
                    height={moderateScale(17.5, 0.6)}
                    viewBox="32.485 17.5 15.515 17.5"
                    enable-background="new 32.485 17.5 15.515 17.5">
                    <Path
                      d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                      fill={Colors.primary}
                      x="0"
                      y="0"
                    />
                  </Svg>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.item, styles.itemIn]}>
              <View style={[styles.balloon, {backgroundColor: '#f0f0f2'}]}>
                <Text style={{paddingTop: 5, color: 'black'}}>
                  {itemData.item.message}
                </Text>
                <Caption style={{color: 'black'}}>
                  {dayjs(itemData.item.created_at).format('hh:mm a')}
                </Caption>
                <View
                  style={[styles.arrowContainer, styles.arrowLeftContainer]}>
                  <Svg
                    style={styles.arrowLeft}
                    width={moderateScale(15.5, 0.6)}
                    height={moderateScale(17.5, 0.6)}
                    viewBox="32.484 17.5 15.515 17.5"
                    enable-background="new 32.485 17.5 15.515 17.5">
                    <Path
                      d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                      fill="#f0f0f2"
                      x="0"
                      y="0"
                    />
                  </Svg>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View
        style={[
          styles.inputRow,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
          },
        ]}>
        <TextInput
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          value={text}
          onChangeText={text => setText(text)}
          placeholder={'Write your massage here...'}
          style={styles.inputStyle}
          multiline
        />
        <Pressable
          onPress={_onSubmitHandler}
          disable={text === '' || chatLoading}>
          {chatLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="md-send" size={35} color={Colors.primary} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = ({route}) => ({
  headerTitle: route.params.userName,
});

const styles = StyleSheet.create({
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-5.7, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6.2, 0.5),
  },

  inputStyle: {
    backgroundColor: '#f0f0f2',
    width: '85%',
    borderRadius: 25,
    padding: 15,
    borderWidth: 1,
    borderColor: '#c0c0c2',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default MessageScreen;
