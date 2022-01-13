import React, { Component } from "react";
import { Image } from "react-native";
import {
  Text,
  Item,
  Input,
  View,
  Icon,
  Label
} from "native-base";
import styles from "./styles";
import {platformStyle} from "../../theme";

export default class FormField extends Component {

  constructor( props ) {
    super(props);
    this.state = {};
  }

  renderError() {
    if( this.props.errorActive )
      return (
        <View style={{ ...styles.labelError, ...this.props.labelError }}>
          {this.props.meta.touched && this.props.meta.error
            ? <Text style={this.props.inverseTextColor ? {...styles.formErrorText11, color: platformStyle.brandPrimary} : {...styles.formErrorText1, color: platformStyle.brandDanger}}>
              {this.props.meta.error}
            </Text>
            : <Text style={styles.formErrorText2}>Error</Text>}
        </View>)
  }

  renderClear() {
    if( this.props.clearActive )
      return (
        <View>
          {this.props.meta.touched && this.props.meta.error && this.props.clearActive && <Icon
            active
            style={styles.formErrorIcon}
            onPress={() => this.textInput._root.clear()}
            name="close"
          />}
        </View>)
  }

  render() {

    return (
      <View>
        {this.props.inputLabel ?
          <Label style={{ ...styles.inputLabel, color: platformStyle.brandSecondary }}>{this.props.inputLabel}</Label> : null}
        <Item error={this.props.meta.error && this.props.meta.touched}
              rounded={this.props.roundedActive}
              regular={this.props.regularActive}
              underline={this.props.underlineActive}
              style={{
                ...styles.inputGrp,
                ...this.props.stylesGrp,
                width: this.props.widthInput ? this.props.widthInput : undefined,
                borderColor: this.props.editable === false ? '#E6E6E6' : '#000',

              }}>
          {(this.props.icon && this.props.icon.name && !this.props.icon.toRigth) ?
            <Icon
              active
              name={this.props.icon.name}
              style={{
                color: platformStyle.contentTextColor,
                fontSize: this.props.icon.fontSize ? this.props.icon.fontSize : platformStyle.fontSizeBase
              }}
            /> : null}
          <Input
            light={this.props.light}
            ref={c => (this.textInput = c)}
            placeholderTextColor={this.props.inverseTextColor ? platformStyle.inverseTextColor : platformStyle.inputBorderColor}
            style={{
              color: this.props.inverseTextColor ? platformStyle.inverseTextColor : platformStyle.brandSecondary,
              height: this.props.height ? this.props.height : platformStyle.inputHeightBase, ...this.props.styleField,
              fontSize: platformStyle.fontSizeLarge,
              fontFamily: platformStyle.fontFamilyBlack,
              lineHeight: 16,
            }}
            placeholder={this.props.placeholder ? this.props.placeholder : '...'}
            secureTextEntry={this.props.type === "password"}
            onEndEditing={( props ) => {
            	this.props.input.onBlur && this.props.input.onBlur(props);
            	this.props.onBlurInput && this.props.onBlurInput()
            }}
            onFocus={( props ) => {
            	this.props.input.onFocus && this.props.input.onFocus(props);
            	this.props.onFocusInput && this.props.onFocusInput()
            }}
            onChangeText={this.props.input.onChange}
            autoCapitalize={`none`}
            autoCorrect={false}
            autoFocus={false}
            editable={this.props.editable !== false}
            keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'} //'email-address', 'numeric','url',
            multiline={this.props.multiline === true}
            value={this.props.input.value}
            {...this.props.inputProps}
          />

          {this.renderClear()}
          {(this.props.icon && this.props.icon.name && this.props.icon.toRigth) ?
            <Icon
              active
              name={this.props.icon.name}
              style={{
                color: this.props.icon.color ? this.props.icon.color : platformStyle.contentTextColor,
                fontSize: this.props.icon.fontSize ? this.props.icon.fontSize : platformStyle.fontSizeBase
              }}
            /> : null}
        </Item>

        {this.renderError()}

      </View>
    );
  }
}

