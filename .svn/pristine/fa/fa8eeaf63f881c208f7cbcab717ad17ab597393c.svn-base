import React, { Component } from "react";
import { Text, Content, Container, Button, View } from "native-base";
import I18n from 'react-native-i18n';
import { Field } from "redux-form";
import { connect } from 'react-redux';
import YellowSubHeader from '../../../components/YellowSubHeader';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import styles from './styles'
import {platformStyle} from "../../../theme";
import repo from '../../../services/database/repository'
import waterfall from 'async/waterfall';
import generalService from '../../../services/general/generalService';
import Spinner from '../../../components/Spinner';
import { NavigationActions, StackActions } from 'react-navigation'
import PopupDialog from '../../../components/PopupDialog/';
import firebaseService from "../../../services/firebase/firebaseService";
import TimerMixin from "react-timer-mixin";

const backAction = NavigationActions.back({
  key: null
});

const resetAction = StackActions.reset({
  index: 0,
  actions: [ NavigationActions.navigate({ routeName: 'HolderRequestList' }) ],
});

class Documentation extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: null,
      params: { step1: null, step2: null }
    };
  }


  componentDidMount() {

    firebaseService.supervisorAnalytic('CHANGEHOLDER');

    const { params } = this.props.navigation.state;
    this.setState({
      params
    });

  }

  sendData() {

    let idSr = null;
    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true });

        let idPaymentForm = repo.configuration.getField('idPaymentForm');
        let idCustomer = repo.configuration.getField('idCustomer');

        let dataObj = {
          "typeSr": "SREQTYP017",
          "idAccountOwner": idPaymentForm,
          "holderData": {
            "idCustomer": idCustomer
          },
          "contactData": {
            "phone": "",
            "email": ""
          },
          "holderAddress": {
            "indSameSupply": "1"
          },
          "supplyData": {},
          correspondenceAddress: this.state.params.step1.correspondenceAddress,
          paymentHolder: this.state.params.step2.paymentHolder,
          paymentHolderAddress: this.state.params.step2.paymentHolderAddress,
          "bankData": {
            "indDebitAccount": "0",
            "codBankAccount": ""
          }
        };

        generalService.postHolderRequestAction(dataObj, callback);
      },
      ( arg1, callback ) => {
        idSr = arg1.idSr;
        if( arg1 && idSr ) {
          let dataObj = {};
          generalService.postHolderDocAction(idSr, 'DT00002', dataObj, callback);
        } else {
          return callback("Error", null)
        }
      },
      ( arg1, callback ) => {
        idSr = arg1.idSr;
        if( idSr ) {
          let dataObj = {};
          generalService.postHolderDocAction(idSr, 'DT0028', dataObj, callback);
        } else {
          return callback("Error", null)
        }
      },
      ( arg1, callback ) => {
        idSr = arg1.idSr;
        if( idSr ) {
          let dataObj = {};
          generalService.postHolderDocAction(idSr, 'DT0060', dataObj, callback);
        } else {
          return callback("Error", null)
        }
      },


    ], ( err, result ) => {

      this.setState({ spinnerVisible: false }, function() {
        if( !err ) {
          //TODO Review this test
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"));
          }, 1000);
          this.props.navigation.dispatch(resetAction);
        } else {
          TimerMixin.setTimeout(() => {
            if( err )
              this.showPopupAlert(I18n.t("INFO"), `${err}`);
            else
              this.showPopupAlert(I18n.t("INFO"), I18n.t("HAS_ERROR_RETRY"));
          }, 1000);
        }
      });
    })
  }


  /**
   *
   * @param title
   * @param text
   * @param content
   * @param options
   */
  showPopupAlert( title, text, content, options ) {
    this.setState({
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 300,
        animation: 2,
        contentText: text,
        content: content,
        options: options ? options : {
          1: {
            key: 'button1',
            text: `${I18n.t('accept')}`,
            align: ''
          }
        },
      }

    })
  }


  render() {
    const { step1, step2 } = this.state.params;

    return (
      <Container>
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('Change_Account_Holder')} back {...this.props} leftIcon="md-close"/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />

        <Content>
          <View padder>
            <YellowSubHeader text="Personal"/>
            {step1 && step1.correspondenceAddress && !step1.correspondenceAddress.indOwner ?
              <Text
                dark>{`name: ${step1.correspondenceAddress.name} surname1:${step1.correspondenceAddress.surname1}`}</Text> :
              <Text dark>{I18n.t('MSG004')}</Text>}
          </View>
          <View padder>
            <YellowSubHeader text="Postal"/>
            {step1 && step1.correspondenceAddress && !step1.correspondenceAddress.indOwner ?
              <Text
                dark>{`idStreet: ${step1.correspondenceAddress.address.idStreet} number:${step1.correspondenceAddress.address.number}`}</Text> :
              <Text dark>{I18n.t('MSG004')}</Text>}
          </View>
          <View padder>
            <YellowSubHeader text="Payments"/>
            {step2 && step2.paymentHolder && step2.paymentHolder.indSameOwner === "0" ?
              <Text
                dark>{`name: ${step2.paymentHolder.customerHolder.name} surname1:${step2.paymentHolder.customerHolder.surname1} `}</Text> :
              <Text dark>{I18n.t('CUSTOMER_PAYMENT')}</Text>}
          </View>
          <View padder>
            <YellowSubHeader text="Payment Address"/>
            {step2 && step2.paymentHolder && step2.paymentHolder.indSameOwner === "0" ?
              <Text dark>{`${step2.paymentHolderAddress.idStreet} ${step2.paymentHolderAddress.number} `}</Text> :
              <Text dark>{I18n.t('CUSTOMER_PAYMENT')}</Text>}
          </View>
        </Content>


        <View padder style={{ marginVertical: 2 }}>
          <Text sizeNormal light style={styles.listItemRow.text}>
          	{I18n.t('CUSTOMER_PAYMENT_NOTE')}
          </Text>
        </View>


        <View padder style={{ marginVertical: 5 }}>
          <Button block style={{ backgroundColor: platformStyle.brandPrimary}} rounded onPress={this.sendData.bind(this)}>
            <Text sizeNormal>{I18n.t('Send')}</Text>
          </Button>
        </View>
        <View padder style={{ marginVertical: 5 }}>
          <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={() => {
            this.props.navigation.dispatch(resetAction);
          }
          }>
            <Text sizeNormal>{I18n.t('Cancel')}</Text>
          </Button>
        </View>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
      </Container>
    );
  }
}

function bindAction( dispatch ) {
  return {
    // loadDataFormHolderDocumentation: ( formData ) => dispatch(loadDataFormHolderDocumentation(formData)),
  };
}


const mapStateToProps = state => {
  return {}
};


export default connect(mapStateToProps, bindAction)(Documentation);

