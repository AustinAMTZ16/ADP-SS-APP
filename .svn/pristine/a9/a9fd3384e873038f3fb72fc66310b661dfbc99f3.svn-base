import React, {Component} from "react";
import {TouchableOpacity} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row, View, Icon, Footer, FooterTab, Button} from "native-base";
import {FlatList} from 'react-native';
import I18n from 'react-native-i18n';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";
import {Field, reduxForm} from "redux-form";
import { NavigationActions } from 'react-navigation';

import {platformStyle} from "../../theme";
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import styles from './styles'
import waterfall from "async/waterfall";
import repo from '../../services/database/repository'
import Spinner from '../../components/Spinner';
import {createAlert} from '../../components/ScreenUtils';
import linkContractService from "../../services/general/linkContractService";
import PopupDialog from '../../components/PopupDialog/';
import { required } from '../../shared/validations';

import FormField from '../../components/FormField/';

const backAction = NavigationActions.back({
    key: null
});

class LinkContractScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinnerVisible: false
        }
    }

    linkContract(values) {
        const navigation = this.props.navigation;
        waterfall([
            (callback) => {
                var req = {
                    "idCustomer":repo.configuration.getField('idCustomer'),
                    "account":values.contractNumber,
                    "customerName":values.customerName
                };
                linkContractService.link(req, callback);

                //TESTING METHOD
                // let req = {
                //     "account": repo.configuration.getField('accountNumberSelected'),
                //     "idCustomer":repo.configuration.getField('idCustomer')
                // };
                // linkContractService.unlink(req, callback);
            }
        ], (err, result) => {
            if (!err) {
                // this.setState({
                //     messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"))
                // });
                this.showSuccessMessage(navigation)


            } else {
                TimerMixin.setTimeout(() => {
                    this.setState(err);
                }, 1000);
            }
        });
    }

    showSuccessMessage(navigation){
        let options =  {
            1: {
                key: 'button1',
                text: `${I18n.t('accept')}`,
                action: () => {
                    console.log("Excecuted onLinkContract LinkContract");
                    TimerMixin.setTimeout(() => {
                        //There is a problem to update main screen
                        // if(navigation.state.params.onLinkContract){
                        //     navigation.state.params.onLinkContract();
                        // }
                        navigation.dispatch(backAction);
                    }, 500);

                },
                align: ''
            }
        };

        TimerMixin.setTimeout(() => {
            this.setState({
                messageAlert: createAlert(I18n.t("INFO"), I18n.t("OPERATION_SUCCESS2"),options)
            });
        }, 500);
    }


    submit(values) {
        this.linkContract(values)
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('LINK_CONTRACT')} back {...this.props}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padderHorizontal>
                    <Field name="contractNumber"
                           component={FormField}
                           validate={[ required ]}
                           errorActive
                           inputLabel={I18n.t('ACCOUNT_NO')}
                           light
                           keyboardType="numeric"
                    />

                    <Field name="customerName"
                           component={FormField}
                           validate={[ required ]}
                           errorActive
                           inputLabel={I18n.t('COMPLETE_CUSTOMER_NAME')}
                           light
                    />

                    {platformStyle.platform === 'ios' ?
                                <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}
                                        style={sharedStyles.margin('top')}
                                >
                                <Text sizeNormal>{I18n.t('Submit')}</Text>
                                </Button> : null}
                </Content>

                <Footer noBorders padder>
                    <FooterTab>
                        {platformStyle.platform === 'android' ?
                            <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                                    onPress={this.props.handleSubmit(this.submit.bind(this))}>
                                <Text sizeNormal>{I18n.t('Submit')}</Text>
                            </Button> : null}
                    </FooterTab>
                </Footer>
                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                         overlayColor={`rgba(0, 0, 0, 0.60)`}
                         textStyle={{ color: '#FFF' }}/>

            </Container>
        );
    }
}

const LinkContract = reduxForm({
    form: "LinkContractForm"
})(LinkContractScreen);

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: state.generalReducer.LinkContractForm,
    }
};

export default connect(mapStateToProps, bindAction)(LinkContract);