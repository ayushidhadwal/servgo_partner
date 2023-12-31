import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card, Checkbox} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';
import {useDispatch} from 'react-redux';

import Colors from '../constant/Colors';
import {timeData} from '../data/Time';
import {useTranslation} from 'react-i18next';

export const UPDATE_CALENDER_FIELD = 'UPDATE_CALENDER_FIELD';

const DaySection = ({name, selected, start1, end1, start2, end2}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation('langChange');

  const updateTime = (value, subField) => {
    dispatch({
      type: UPDATE_CALENDER_FIELD,
      input: {
        field: name.toLowerCase(),
        subField: subField, // end || end_two || start || start_two,
        value: value,
      },
    });
  };

  return (
    <Card style={styles.cardStyles}>
      <View style={styles.rowStyles}>
        <Checkbox.Android
          color={Colors.primary}
          status={parseInt(selected) === 1 ? 'checked' : 'unchecked'}
          onPress={() => {
            updateTime(parseInt(selected) === 1 ? 0 : 1, '');
          }}
        />
        <Text style={styles.dayName}>{name}</Text>
      </View>
      <Text style={styles.slotStyles}>{t('slot1')}</Text>
      <View style={styles.rowStyles1}>
        <View style={styles.pickerRow}>
          <Text style={styles.text}>{t('startTime')}</Text>
          <RNPickerSelect
            onValueChange={value => updateTime(value, 'start')}
            items={timeData}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={start1}
          />
        </View>
        <View style={styles.pickerRow}>
          <Text style={styles.text}>{t('endTime')}</Text>
          <RNPickerSelect
            onValueChange={value => updateTime(value, 'end')}
            items={timeData}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={end1}
          />
        </View>
      </View>
      <Text style={styles.slotStyles}>{t('slot2')}</Text>
      <View style={styles.rowStyles1}>
        <View style={styles.pickerRow}>
          <Text style={styles.text}>{t('startTime')}</Text>
          <RNPickerSelect
            onValueChange={value => updateTime(value, 'start_two')}
            items={timeData}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={start2}
          />
        </View>
        <View style={styles.pickerRow}>
          <Text style={styles.text}>{t('endTime')}</Text>
          <RNPickerSelect
            onValueChange={value => updateTime(value, 'end_two')}
            items={timeData}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={end2}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardStyles: {
    padding: RFValue(10),
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: RFValue(12),
    width: '95%',
    alignSelf: 'center',
  },
  rowStyles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayName: {
    textTransform: 'capitalize',
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  slotStyles: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: RFValue(14),
    paddingLeft: RFValue(10),
  },
  rowStyles1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerRow: {
    flexDirection: 'column',
    width: '48%',
  },
  text: {
    paddingLeft: RFValue(12),
    marginTop: 10,
    color: 'grey',
  },
  ////
  selectedTextStyle: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    width: '100%',
    color: 'black',
    fontSize: 20,
    paddingLeft: 10,
  },
  listTextStyle: {
    color: 'black',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: RFValue(15),
  },
  dropDownIconStyle: {
    width: 10,
    height: 10,
    left: -20,
  },
  pickerStyle: {
    shadowRadius: 0.5,
    shadowOpacity: 0.5,
    borderWidth: 0.5,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    height: RFValue(35),
    borderColor: '#dcdcdc',
    shadowColor: '#dcdcdc',
    borderRadius: 1,
    elevation: 0.5,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 10,
    borderRadius: 8,
    borderColor: 'red',
    color: 'black',
  },
});
export default DaySection;
