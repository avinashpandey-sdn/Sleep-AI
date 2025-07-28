import React from 'react';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';

const AppImage = props => {
  const {source, imgStyle, resizeMode = FastImage.resizeMode.cover} = props;
  // if (!source || !source.uri) {
  //   return null;
  // }
  return (
    // <FastImage
    //   style={imgStyle}
    //   source={source}
    //   resizeMode={resizeMode}
    //   {...props}
    // />
    <Image
      style={imgStyle}
      source={source}
      resizeMode={resizeMode}
      {...props}
    />
  );
};

export default AppImage;
