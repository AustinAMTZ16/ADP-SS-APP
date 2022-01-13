import React from "react";
import {TouchableOpacity} from "react-native";
import {Text, Row, Icon, View, Label} from "native-base";
import _ from "lodash";

import {platformStyle} from "../../theme";
import formFieldStyles from "../FormField/styles";
import sharedStyles from '../../shared/styles';

export default ( { checked, onPress, meta, input, options, label, ...rest } ) => {
  const value = input ? input.value : checked;

  return (
    <View>
      {label ? <Label style={formFieldStyles.inputLabel}>{label}</Label> : null }
      {_.map( options, ( option, index ) =>
        <TouchableOpacity key={index} onPress={input ? () => rest.change(input.name, option.id) : onPress}>
          <Row style={sharedStyles.alignItems()}>
            <Icon name={value === option.id ? 'md-radio-button-on' : 'md-radio-button-off'}
                  style={{ color: platformStyle.brandSecondary }}/>
            <Text sizeNormal style={sharedStyles.margin('left', 2)}>{option.name}</Text>
          </Row>
        </TouchableOpacity>
      )}

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

