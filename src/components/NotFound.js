import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const NotFound = () => {
  return (
    <View style={styles.screen}>
      <Text>Not Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
