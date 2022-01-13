import React, { Component } from "react";
import { Text, Button, Content, Container, View } from "native-base";
import I18n from 'react-native-i18n';

import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import YellowSubHeader from '../../../components/YellowSubHeader';
import Checkbox from '../../../components/Checkbox/'
import Tabs from '../EditTabs';
import AddressForm from '../AddressForm2';
import PersonalInfoForm from '../PaymentPersonalInfoForm';
import sharedStyles from '../../../shared/styles';
import {platformStyle} from "../../../theme";
import { connect } from 'react-redux';
import { submit } from "redux-form";

class Payment extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      customerDetail: true,
      openedPanel: 1,
      data1: null,
      data2: null,
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      params
    });

  }


  submit1( values ) {

    if( values.name ) {
      this.setState({ data1: values }, function() {

      }.bind(this));
    }

  }

  submit2( values ) {
    if( values.county ) {

      this.setState({ data2: values }, function() {
        if( this.state.data1 ) {
          let step2 = { paymentHolder: {}, paymentHolderAddress: {} };
          step2.paymentHolder = {
            "customerHolder": {
              "birthDate": this.state.data1.birthDate,
              "surname2": this.state.data1.surname2,
              "codSex": this.state.data1.codSex,
              "docCountry": this.state.data1.docCountry,
              "docType": this.state.data1.docType,
              "docNumber": this.state.data1.docNumber,
              "name": this.state.data1.name,
              "surname1": this.state.data1.surname1,
            },
            "indSameOwner": "0",
            "contactData": {
              "email": this.state.data1.email,
              "phone": this.state.data1.phone,
            }
          };
          step2.paymentHolderAddress = {
            "idStreet": values.idStreet,
            "number": values.number,
            "unitNumber": values.unitNumber ? values.unitNumber : '',
            "observations": values.observations ? values.observations : '',
          };

          this.props.navigation.navigate("HolderRequestDocumentation", {
            step1: this.state.params.step1,
            step2
          });
        }
      }.bind(this));
    }

  }


  render() {
    const { customerDetail } = this.state;

    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('Change_Account_Holder')} back {...this.props}/>
        <Tabs {...this.props}/>
        <View style={{ ...sharedStyles.margin('top', 2), padding: platformStyle.contentPadding }}>
          <Checkbox onPress={() => this.setState({ customerDetail: !customerDetail })}
                    label={I18n.t('Do you wish to use your Customer detail as the payment detail')}
                    checked={customerDetail}
          />
        </View>
        <Content>
          {!customerDetail &&
          <View>
            <YellowSubHeader text="Personal"/>
            <PersonalInfoForm onSubmit={this.submit1.bind(this)}/>

            <YellowSubHeader text="Address"/>
            <AddressForm onSubmit={this.submit2.bind(this)}/>
          </View>
          }

          {customerDetail ?
            <View padder>
              <Button block style={{ backgroundColor: platformStyle.brandPrimary}} rounded onPress={() => {
                this.props.navigation.navigate("HolderRequestDocumentation", {

                  step1: this.state.params.step1,
                  step2: {
                    paymentHolder: {
                      contactData: {},
                      customerHolder: {},
                      indSameOwner: "1"
                    },
                    paymentHolderAddress: {},
                  }

                });
              }}>
                <Text sizeNormal>{I18n.t('Continue')}</Text>
              </Button>
            </View> :

            <View padder>
              <Button block style={{ backgroundColor: platformStyle.brandPrimary}} rounded onPress={() => {
                this.props.submitStep20Form();
                setTimeout(() => {
                  this.props.submitStep21Form();
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
    submitStep20Form: () => dispatch(submit('HolderRequestsPaymentPersonalInfoForm')),
    submitStep21Form: () => dispatch(submit('HolderRequestsAddressForm2'))
  };
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Payment);

