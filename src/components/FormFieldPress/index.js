import React, {Component} from "react";
import {Image} from "react-native";
import {Text, Item, View, Label} from "native-base";
import formFieldStyles from "../FormField/styles";
import {platformStyle} from "../../theme";

export default class FormFieldPress extends Component {

  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {
    const { input, label, meta, onPress, placeholder } = this.props;

    return (
      <View>
        <Label style={formFieldStyles.inputLabel}>{label}</Label>
        <Item error={meta.error && meta.touched}
              onPress={onPress}
              style={{height: platformStyle.inputHeightBase}}>
          <Text style={{fontSize: platformStyle.fontSizeLarge, fontFamily: platformStyle.fontFamilyBlack,
                            color: input.value ? platformStyle.brandSecondary : platformStyle.inputBorderColor}}>
            {input.value || placeholder || '...'}
          </Text>
        </Item>
        <View style={formFieldStyles.labelError}>
          <Text
            style={meta.touched && meta.error ? formFieldStyles.formErrorText1 : formFieldStyles.formErrorText2}>
            {meta.error || 'error here'}
          </Text>
        </View>
      </View>
    );
  }
}

