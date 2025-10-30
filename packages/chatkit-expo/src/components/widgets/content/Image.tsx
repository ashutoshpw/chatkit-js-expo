import React from 'react';
import { Image as RNImage, StyleSheet } from 'react-native';

export function ImageComponent({ src, width, height, alt, ...props }: any) {
  return (
    <RNImage
      source={{ uri: src }}
      style={[styles.image, { width: width || 200, height: height || 200 }]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    marginVertical: 8,
  },
});
