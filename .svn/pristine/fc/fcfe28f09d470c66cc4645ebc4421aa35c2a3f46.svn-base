import React, {} from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../../assets/fonts/configFontello.json';

const Fontello = createIconSetFromFontello(fontelloConfig, 'fontello');


export default function IconFontello( { name, size, style, onPress } ) {
  if( onPress )
    return (
      <Fontello name={name} size={size} style={style} onPress={onPress}/>
    );
  else
    return (
      <Fontello name={name} size={size} style={style}/>
    );
}

