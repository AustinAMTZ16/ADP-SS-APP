import React from "react";
import {TouchableOpacity} from "react-native";
import {Text, Row, Icon, View} from "native-base";
import _ from 'lodash';

import {platformStyle} from "../../theme";
import formFieldStyles from "../FormField/styles";
import sharedStyles from '../../shared/styles';
import styles from './styles';

export default ( { checked, label, onPress, meta, input, editable, ...rest } ) => {
  const value = input ? input.value : checked;

  return (
    <View>
      {editable === false ?
        <Row style={styles.row}>
          <Icon name={value ? 'ios-checkbox-outline' : 'ios-square-outline'}
                style={{ color: platformStyle.brandSecondary }}/>
          {_.isObject( label ) ? label :
              <Text sizeNormal style={{...sharedStyles.margin('left', 2), flex:1}}>
          		 {label}
            </Text>
          }
        </Row> :
        <TouchableOpacity onPress={input ? () => {
          rest.change(input.name, !input.value);
          if(onPress) onPress(!input.value)
        } : onPress}>
          <Row style={styles.row}>
            <Icon name={value ? 'ios-checkbox-outline' : 'ios-square-outline'}
                  style={{ color: platformStyle.brandSecondary }}/>
            {_.isObject( label ) ? label :
              <Text sizeNormal style={{...sharedStyles.margin('left', 2), flex:1}}>
               {label}
              </Text>
            }
          </Row>
        </TouchableOpacity>
      }
      {input ?
        <View style={formFieldStyles.labelError}>
          <Text
            style={meta.touched && meta.error ? formFieldStyles.formErrorText1 : formFieldStyles.formErrorText2}>
            {meta.error || 'error here'}
          </Text>
        </View> : null
      }
    </View>
  );
}

