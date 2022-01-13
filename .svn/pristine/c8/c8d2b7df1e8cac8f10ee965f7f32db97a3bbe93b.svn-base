import React, { Component } from "react";
import { Image, Picker, TouchableOpacity } from "react-native";
import {
  Text,
  Item,
  View,
  Icon,
  Label
} from "native-base";
import {platformStyle} from "../../theme";
import styles from "./styles";
import SimplePicker from '../../libraries/react-native-simple-picker/';
import I18n from 'react-native-i18n';

const types = { 'email': "Email or Phone", 'password': 'Password', 'text': '' };

const PickerItem = Picker.Item;
declare type Any = any;

export default class FormPicker extends Component {
  pickerInput: Any;

  constructor( props ) {
    super(props);
    this.state = {
      selectedOption: ''
    };
  }

  componentWillMount() {
    let items = [];
    if( !this.props.noSelect ){
      items = [ { id: '', val: '', text: this.props.placeholder ? this.props.placeholder : I18n.t("SELECT") } ];
    }
    
    if( this.props.dataItems ){
      this.props.dataItems.map(( x, i ) => {
        items.push({
          id: x.code.toString(),
          val: x.code.toString(),
          text: x.val.toString().trim(),
        })
      });
    }  
    this.setState({
      items
    });
  }

  componentWillReceiveProps( nextProps ) {

	  if( !_.isEqual(nextProps.dataItems, this.props.dataItems) ) {
		  let items = [{
			  id: '',
			  val: '',
			  text: this.props.placeholder ? this.props.placeholder : I18n.t("SELECT") 
		  }];

		  nextProps.dataItems.map(( x, i ) => {
			  items.push({
				  id: x.code.toString(),
				  val: x.code.toString(),
				  text: x.val.toString().trim(),
			  })
		  });

		  this.setState({
			  items
		  });
	  }
  }

  onValueChange( value: string ) {
    // console.tron.log('here', this.props.input.value)

    this.props.input.onChange(value.toString());
    this.props.input.onBlur();
    /*if( this.props.onChange ) {
      this.props.onChange(value);
    }*/
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
    const { icon } = this.props;
    let selected = this.props.input.value;
    // console.tron.log('selected', this.props.input.value);
    let selectedIos = null;
    _.map(this.state.items, function( item ) {
      if( item.val.toString() === selected.toString() )
        selectedIos = item;
    }.bind(this));

    return (
      <View style={{
        ...this.props.contentStyle
      }}>
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
                borderColor: this.props.editable === false ? '#E6E6E6' : '#000'
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
          {platformStyle.platform === 'ios' ?
            <View>
              {this.props.editable === false ?
                <View
                  style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                  <Text
                    style={{
                      ...styles.textPicker,
                      fontSize: platformStyle.fontSizeLarge,
                      color: platformStyle.brandSecondary,
                      fontFamily: platformStyle.fontFamily,
                      width: platformStyle.deviceWidth - 55
                    }}>
                    {selectedIos ? selectedIos.text : this.props.placeholder ? this.props.placeholder : I18n.t("SELECT") }
                  </Text>
                  <Icon
                    active
                    name={"md-arrow-dropdown"}
                    style={{
                      color: platformStyle.brandSecondary,
                      fontSize: platformStyle.fontSizeBase
                    }}
                  />
                </View> :
                <TouchableOpacity
                  style={{ flexDirection: 'row', backgroundColor: 'transparent' }}
                  onPress={() => {this.pickerInput.show()}}>
                  <Text
                    style={{
                      ...styles.textPicker,
                      fontSize: platformStyle.fontSizeLarge,
                      color: platformStyle.brandSecondary,
                      fontFamily: platformStyle.fontFamily,
                      width: platformStyle.deviceWidth - 55
                    }}>
                    {selectedIos ? selectedIos.text : this.props.placeholder ? this.props.placeholder : I18n.t("SELECT") }
                  </Text>
                  <Icon
                    active
                    name={"md-arrow-dropdown"}
                    style={{
                      color: platformStyle.brandSecondary,
                      fontSize: platformStyle.fontSizeBase
                    }}
                  />
                </TouchableOpacity>
              }
              <SimplePicker
                ref={c => (this.pickerInput = c)}
                options={_.map(this.state.items, function( item ) {
                  return item.val;
                })}
                labels={_.map(this.state.items, function( item ) {
                  return item.text;
                })}
                onSubmit={this.onValueChange.bind(this)}
                disableOverlay={false}
                buttonStyle={{ fontSize: 18, color: platformStyle.brandSecondary, }}
                pickerStyle={{ ...styles.inputs, ...this.props.stylePiker }}
                itemStyle={{
                  fontSize: 20,
                  color: platformStyle.brandSecondary,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
                {...this.props.input}
              />
            </View> :
            <Picker
              ref={c => (this.pickerInput = c)}
              style={{
                ...styles.inputs, ...this.props.stylePiker,
                ...(icon && icon.toRigth) ? styles.inputsWidthIcon : styles.inputsWidth,
              }}
              itemStyle={{ color: platformStyle.brandDark }}
              mode="dialog"
              enabled={this.props.editable}
              selectedValue={this.props.input.value.toString()}
              onValueChange={this.onValueChange.bind(this)}
              {...this.props.input}
            >
              {this.state.items.map(( val ) => (
                <PickerItem key={val.id} value={val.val.toString()} label={val.text}/>
              ))}
            </Picker>}
          {this.renderClear()}

          {(icon && icon.name && icon.toRigth) ?
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

