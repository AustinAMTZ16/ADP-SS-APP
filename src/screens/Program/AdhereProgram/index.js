import React, {Component} from "react";
import {TouchableOpacity} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row, View, Icon, Footer, FooterTab, Button} from "native-base";
import {FlatList} from 'react-native';
import I18n from 'react-native-i18n';
import {connect} from 'react-redux';
import TimerMixin from "react-timer-mixin";
import {Field, reduxForm} from "redux-form";
import {NavigationActions} from 'react-navigation';

import {platformStyle} from "../../../theme";
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import waterfall from "async/waterfall";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import {createAlert} from '../../../components/ScreenUtils';
import bannerService from "../../../services/general/bannerService";
import PopupDialog from '../../../components/PopupDialog/';
import {required} from '../../../shared/validations';
import Config from 'react-native-config'

import FormField from '../../../components/FormField/';

const emptyData = {
    debtBillCycle: "",
    debtOtherCharges: "",
    condonationBillCycle: "",
    condonationOtherCharges: "",
    totalAmount: ""
};

const backAction = NavigationActions.back({
    key: null
});

class AdhereProgramScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: emptyData,
            spinnerVisible: false,
            program:"EMPTY"
        }
    }

    componentDidMount() {
        let program = repo.configuration.getField('adpProgramData');
        if (program != "") {
            let adpProgram = JSON.parse(program);
            this.setState({program:adpProgram});
        }
    }

    adhereProgram() {
        this.setState({
            spinnerVisible: true
        });

        let req2 = {
            "idPaymentForm": repo.configuration.getField('idPaymentFormSelected'),
            "programType": this.state.program.type
        };
        bannerService.addProgramSubscriber(req2, (err, result) => {
            if(!err){                
                    let options =  {
                        1: {
                            key: 'button1',
                            text: `${I18n.t('accept')}`,
                            action: () => {
                                TimerMixin.setTimeout(() => {
                                    this.props.navigation.dispatch(backAction);
                                }, 500);
                            },
                            align: ''
                        }
                    };
                TimerMixin.setTimeout(() => {
                    this.setState({messageAlert: createAlert(I18n.t("PROGRAM_INFO_ADP"), I18n.t("PROGRAM_SUSCRIBE_DONE").replace("{program}",this.state.program.title),options),spinnerVisible: false})
                }, 500);
            }else{
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false})
                }, 500);
            }
        });
    }

    doNotAdhereProgram() {
        TimerMixin.setTimeout(() => {
            this.props.navigation.dispatch(backAction);
        }, 500);
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('NO_DEBT_PROOF_TITLE')} back {...this.props}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padderHorizontal>
                    <Text xlarge primary heavy style={{marginVertical: 10}}>{I18n.t("PROGRAM_QUESTION").replace("{program}",this.state.program.title)}</Text>
                </Content>
                
                <Footer noBorders padder>
                    <FooterTab>
                        <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                                onPress={this.props.handleSubmit(this.adhereProgram.bind(this))}>
                            <Text sizeNormal>{I18n.t('YES')}</Text>
                        </Button>
                    </FooterTab>
                </Footer>

                <Footer noBorders padder>
                    <FooterTab>
                        <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}}
                                onPress={this.props.handleSubmit(this.doNotAdhereProgram.bind(this))}>
                            <Text sizeNormal>{I18n.t('NO')}</Text>
                        </Button>
                    </FooterTab>
                </Footer>

                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                         overlayColor={`rgba(0, 0, 0, 0.60)`}
                         textStyle={{ color: '#FFF' }}/>

            </Container>
        );
    }
}

const AdhereProgram = reduxForm({
    form: "AdhereProgramForm"
})(AdhereProgramScreen);

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: {}
    }
};

export default connect(mapStateToProps, bindAction)(AdhereProgram);