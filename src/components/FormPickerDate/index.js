import React, { Component } from "react";
import { Image } from "react-native";
import {
  Text,
  Item,
  View,
  Icon,
  Label
} from "native-base";
import styles from "./styles";
import {platformStyle} from "../../theme";
import DatePicker from 'react-native-datepicker';
import moment from "moment";
import I18n from 'react-native-i18n';

declare type Any = any;

export default class FormPickerDate extends Component {
  pickerDateInput: Any;

  constructor( props ) {
    super(props);
    this.state = {};
  }


  renderError() {
    if( this.props.errorActive )
      return (
        <View>
          {this.props.meta.touched && this.props.meta.error
            ? <Text style={this.props.inverseTextColor ? {...styles.formErrorText11, color: patformStyle.brandPrimary }: {...styles.formErrorText1, color: platformStyle.brandDanger}}>
              {this.props.meta.error}
            </Text>
            : <Text style={styles.formErrorText2}>Error</Text>}
        </View>)
  }

  renderClear() {
    if(this.props.clearActive && !this.props.disabled)
      return (
        <View>
          {this.props.clearActive && <Icon
            active
            style={styles.formErrorIcon}
            onPress={() => this.props.input.onChange("")}
            name="close"
          />}
        </View>)
  }

  render() {
	  
	  let dateValue = this.props.input.value ? this.props.input.value : this.props.defaultValue;
	  if(dateValue && Number.isInteger(dateValue)){
		  dateValue = moment(this.props.input.value).format(this.props.dataFormat);
	  }

    return (
      <View style={{ ...this.props.contentStyle }}>
        {this.props.label ?
          <Label style={{ ...styles.inputLabel, ...this.props.labelStyle, color: platformStyle.brandSecondary }}>{this.props.label}</Label> : null}
        <Item
          error={this.props.meta.error && this.props.meta.touched}
          rounded={this.props.roundedActive}
          regular={this.props.regularActive}
          underline={this.props.underlineActive}
          style={{
            ...styles.inputGrp,
            width: this.props.widthInput ? this.props.widthInput : undefined,
            ...this.props.stylesGrp,
            borderColor: this.props.disabled === true ?  '#E6E6E6' : '#000'
          }}>
          <DatePicker
            ref={c => (this.pickerDateInput = c)}
            mode={this.props.modeDate ? this.props.modeDate : "date"}
            placeholder={this.props.placeholder ? this.props.placeholder : I18n.t("SELECT")}
            format={this.props.dataFormat ? this.props.dataFormat : "DD/MM/YYYY"}
            confirmBtnText= {I18n.t("CONFIRM")}
            cancelBtnText={I18n.t("cancel")}
            showIcon={true}
            onOpenModal={this.props.input.onFocus}
            onCloseModal={this.props.input.onBlur}
            disabled={this.props.disabled === true}
            customStyles={{
              ...styles.datePicker,
              dateInput: { ...styles.datePicker.dateInput, ...this.props.dateInputStyles },
              disabled: { backgroundColor: 'transparent'},
              btnTextConfirm: {
                height: 25,
                color: '#004B8D'
              },
              btnTextCancel: {
                height: 25,
                color: '#4A4A4A'
              },
              dateIcon: {
                position: 'absolute',
                right: 0,
                top: 4,
                marginLeft: 0
              }
            }}
            style={{ width: this.props.width ? this.props.width + 30 : 100 }}
            onDateChange={( value ) => {
              this.props.input.onChange(value)
            }}
          	date={dateValue}
            {...this.props.input}
          />

          {this.renderClear()}

        </Item>
        {this.renderError()}

      </View>
    );
  }
}

