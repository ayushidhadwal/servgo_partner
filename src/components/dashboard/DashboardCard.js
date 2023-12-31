import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';

import {heightPercent} from '../../utils/layout';
import Colors from '../../constant/Colors';

export const DashboardCard = ({image, title, count}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.cover} />
      <Text style={styles.count}>{count ? Math.round(Number(count)) : 0}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 15,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    alignItems: 'center',
  },
  cover: {
    resizeMode: 'contain',
    width: '80%',
    height: heightPercent(10),
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  title: {
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
