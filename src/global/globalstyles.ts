import {Dimensions} from 'react-native';

export const colors = {
  textBlack: '#303030',
  textGreen: '#58C047',
  textRed: '#FF0000',
};

export const fonts = {};

export const basicDimensions = {
  height: 812,
  width: 370,
};

export const height = // 높이 변환 작업
  (Dimensions.get('screen').height * (1 / basicDimensions.height)).toFixed(2);

export const width = // 가로 변환 작업
  (Dimensions.get('screen').width * (1 / basicDimensions.width)).toFixed(2);
