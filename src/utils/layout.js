import {Dimensions} from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const percentage = (total, percent) => (total * percent) / 100;
export const widthPercent = percent => percentage(windowWidth, percent);
export const heightPercent = percent => percentage(windowHeight, percent);
