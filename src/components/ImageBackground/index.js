import React, {} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {
  Container
} from "native-base";

export default function ImgBackgroundContainer( { children, source } ) {
  return (
    <Container>
      <ImageBackground style={styles.image} source={source}>
      {children}
      </ImageBackground>
    </Container>
  );
}

const styles = StyleSheet.create( {
  image: {
    flex: 1,
  },
} );