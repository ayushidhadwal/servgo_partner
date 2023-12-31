import React, {useEffect, useState} from 'react';
import {View, Image as RNImage, Pressable} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {generateId} from '@notifee/react-native/src/utils';

const FALLBACK = require('../assets/no-image.jpg');

export const Image = ({source: imgSource, zoom = false, ...props}) => {
  const [source, setSource] = useState(imgSource);
  const [visible, setIsVisible] = useState(false);
  const [key, setKey] = useState(generateId());
  const [isErr, setIsErr] = useState(generateId());

  useEffect(() => {
    setSource(imgSource);
    setKey(generateId());
    setIsErr(false);
  }, [imgSource]);

  const zoomEnabled = zoom && !isErr;

  const Wrapper = zoomEnabled ? Pressable : View;

  return (
    <Wrapper onPress={() => setIsVisible(zoomEnabled)}>
      <RNImage
        {...props}
        source={source}
        onError={() => {
          setSource(FALLBACK);
          setIsErr(true);
        }}
        loadingIndicatorSource={FALLBACK}
        key={key}
      />
      {zoomEnabled ? (
        <ImageView
          images={[imgSource]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      ) : null}
    </Wrapper>
  );
};
