import React, { Component } from "react";
import { Text, Button, Content, Container, View, Icon } from "native-base";
import { TouchableOpacity } from "react-native";
import I18n from 'react-native-i18n';

import { connect } from 'react-redux';
import { submit } from "redux-form";
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import YellowSubHeader from '../../../components/YellowSubHeader';
import Checkbox from '../../../components/Checkbox/'
import Tabs from '../EditTabs';
import AddressForm from '../AddressForm';
import PersonalInfoForm from '../PersonalInfoForm';
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";

class Correspondence extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      addressHolder: true,
      openedPanel: 1,
      data1: null,
      data2: null,
    };
  }

  renderCollapsePanelIcon( index ) {
    return (
      <TouchableOpacity onPress={() => {
        if( this.state.openedPanel === index ) this.setState({ openedPanel: index + 1 > 2 ? 1 : index + 1 });
        else this.setState({ openedPanel: index })
      }}>
        <Icon name={this.state.openedPanel === index ? 'md-remove' : 'md-add'}
              style={{ color: platformStyle.brandSecondary }}/>
      </TouchableOpacity>
    )
  }

  submit1( values ) {

    if( values.name ) {
      this.setState({ data1: values }, function() {
        if( this.state.data2 ) {
        }
      }.bind(this));
    }

  }

  submit2( values ) {
    if( values.county ) {

      this.setState({ data2: values }, function() {
        if( this.state.data1 ) {

          let step1 = {};
          step1.correspondenceAddress = {
            indOwner: 0,
            "name": this.state.data1.name,
            "surname1": this.state.data1.surname1,
            "surname2": this.state.data1.surname2,
            "address": {
              "idStreet": values.idStreet,
              "number":  values.number,
              "unitNumber":  values.unitNumber ? values.unitNumber : '',
              "observations":  values.observations ? values.observations: '',
            }
          };

          this.props.navigation.navigate("HolderRequestPayment", {
            step1
          });
        }
      }.bind(this));
    }

  }
  handleScroll(event) {
    this.setState({ scrollY: event.nativeEvent.contentOffset.y });
  }

  render() {
    const { addressHolder, openedPanel } = this.state;
    _.set(this.refs, 'Content._scrollview.resetCoords', { x: 0, y: this.state.scrollY });
    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('Change_Account_Holder')} back {...this.props}/>
        <Tabs {...this.props}/>
        <View style={{ ...sharedStyles.margin('top', 2), padding: platformStyle.contentPadding }}>
          <Checkbox onPress={() => this.setState({ addressHolder: !addressHolder })}
                    label={I18n.t('MSG004')}
                    checked={addressHolder}
          />
        </View>
        <Content
          ref="Content"
          onScroll={event => this.handleScroll(event)}>

          {!addressHolder &&
          <View>
            <YellowSubHeader text="Personal"
              // right={this.renderCollapsePanelIcon(1)}
            />
            <PersonalInfoForm
              onSubmit={this.submit1.bind(this)}/>

            <YellowSubHeader text="Address"
              // right={this.renderCollapsePanelIcon(2)}
            />
            <AddressForm onSubmit={this.submit2.bind(this)}/>
          </View>
          }
          {addressHolder ?
            <View padder>
              <Button block rounded style={{...styles.loginBtn, backgroundColor: platformStyle.brandPrimary}} onPress={() => {
                let step1 = {};

                step1.correspondenceAddress = {
                  indOwner: this.state.addressHolder ? "1": "0",
                };

                this.props.navigation.navigate("HolderRequestPayment", {
                  step1
                });
              }}>
                <Text sizeNormal>{I18n.t('Continue')}</Text>
              </Button>
            </View> :

            <View padder>
              <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}} onPress={() => {
                this.props.submitStep10Form();
                setTimeout(() => {
                  this.props.submitStep11Form();
                }, 600);

              }}>
                <Text sizeNormal>{I18n.t('Save')}</Text>
              </Button>
            </View>}
        </Content>

      </Container>
    );
  }
}


function bindAction( dispatch ) {
  return {
    submitStep10Form: () => dispatch(submit('HolderRequestsPersonalInfoForm')),
    submitStep11Form: () => dispatch(submit('HolderRequestsAddressForm'))
  };
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Correspondence);


