import React, { Component } from "react";
import { Platform } from "react-native";
import {
  Text,
  Item,
  View,
  Icon,
  Switch,
  Title
} from "native-base";
import styles from "./styles";

import {platformStyle} from "../../theme";

declare type Any = any;

export default class FormSwitch extends Component {
  switchInput: Any;

  constructor( props ) {
    super(props);
    this.state = {
      check : true
    };
  }

  onValueChange( value: string ) {
    this.props.input.onChange(!this.props.input.value);
    this.setState({
      check: !this.state.check
    });
    this.props.input.onBlur()
  }

  render() {
    return (
      <View>
        {this.props.title ?
          <Title style={{ ...styles.title, ...this.props.titleStyle, color: platformStyle.lightTextColor }}>{this.props.title}</Title> : null}
        <Item error={this.props.meta.error && this.props.meta.touched}
              style={{...styles.inputGrp, ...this.props.inputGrp}}>
          {this.props.icons ?
            <Icon
              active
              name={this.props.icons}
              style={{ color: platformStyle.contentTextColor }}
            /> : null}
          <Switch
            ref={c => (this.switchInput = c)}
            disabled={this.props.disabled}
            value={this.props.input.value === true ? true : false}
            onTintColor={this.props.onTintColor ? this.props.onTintColor : platformStyle.brandPrimary}
            thumbTintColor={this.props.thumbTintColor ? this.props.thumbTintColor : (Platform.OS === 'ios' ? null : platformStyle.brandDanger)}
            switchWidth={100}
            onChange={this.onValueChange.bind(this)}
            style={{ ...styles.inputs, ...this.props.styleSwitch }}
          />
        </Item>
      </View>
    );
  }
}

