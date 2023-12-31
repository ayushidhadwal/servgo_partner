import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';

import Colors from '../../constant/Colors';
import Rating from '../../components/Rating';
import * as userActions from '../../store/actions/user';
import {URL} from '../../constant/base_url';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';

const MyReviewScreen = ({navigation}) => {
  const setError = useError();
  const dispatch = useDispatch();
  const {myReviews} = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.setMyReview());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {myReviews.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(17),
              color: Colors.primary,
              textAlign: 'center',
            }}>
            {'No Reviews Added Yet !!!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={myReviews}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.cardContainer,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View style={styles.rowStyle}>
                  <Image
                    source={{uri: 'https://serv-go.com' + item.photo}}
                    style={styles.imgStyle}
                  />
                  <View style={{marginLeft: RFValue(15)}}>
                    <Text style={styles.username}>{item.name}</Text>
                    <Text style={styles.time}>
                      {dayjs(item.created_at).format('DD MMM YYYY, hh:mm a')}
                    </Text>
                  </View>
                </View>
                <Rating
                  rating={(item.services + item.vofm + item.behaviour) / 3}
                  service={item.services}
                  moneyOfValue={item.vofm}
                  behaviour={item.behaviour}
                />
                {item.images !== '' && (
                  <Image
                    source={{uri: URL + item.images}}
                    style={styles.reviewImgStyle}
                  />
                )}

                {item.message !== '' && (
                  <Text>
                    <Text style={styles.quotes}>"</Text>
                    <Text style={styles.comment}>{item.message}</Text>
                    <Text style={styles.quotes}>"</Text>
                  </Text>
                )}
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    padding: RFValue(10),
    borderRadius: 6,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(5),
  },
  imgStyle: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(100),
  },
  reviewImgStyle: {
    width: RFValue(100),
    height: RFValue(100),
    marginVertical: 12,
  },
  username: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: RFValue(15),
  },
  time: {
    color: Colors.primary,
    fontSize: RFValue(10),
  },
  quotes: {
    fontSize: RFValue(15),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  comment: {
    color: 'grey',
  },
});

export default MyReviewScreen;
