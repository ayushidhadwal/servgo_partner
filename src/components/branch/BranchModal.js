import React from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constant/Colors';
import {heightPercent} from '../../utils/layout';
import Loader from '../Loader';

export const BranchModal = ({
  list = [],
  visible = false,
  onClose = () => {},
  onUpdate = () => {},
  isLoading = false,
}) => {
  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => onUpdate(item.id)}
        style={[
          styles.item,
          {
            backgroundColor: item.branch_status === 1 ? '#c7ddea' : 'white',
            borderColor: item.branch_status === 1 ? Colors.primary : '#cdcdcd',
          },
        ]}>
        <MaterialCommunityIcons
          name="map-marker"
          size={18}
          color={Colors.black}
          style={{marginRight: 5}}
        />
        <Text
          numberOfLines={2}
          style={{
            width: '85%',
            fontSize: 14,
            color: 'black',
          }}>
          {item.partner_address +
            ', ' +
            item.city_name +
            ', ' +
            item.country_name}{' '}
        </Text>
      </Pressable>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Change active branch</Text>
            <AntDesign name="close" size={20} color="black" onPress={onClose} />
          </View>
          {isLoading ? (
            <Loader />
          ) : (
            <FlatList
              data={list}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: heightPercent(35),
    maxHeight: heightPercent(35),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: 16,
    marginVertical: 15,
  },
  item: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 2,
    padding: 5,
    marginBottom: 10,
    height: 50,
  },
});
