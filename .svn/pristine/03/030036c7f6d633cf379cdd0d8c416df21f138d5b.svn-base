import React, {Component} from "react";
import waterfall from 'async/waterfall';
import {Image, FlatList, Keyboard, PermissionsAndroid} from 'react-native';
import {Text, View, Content, Container, Button, Footer, FooterTab, Icon,Input} from "native-base";
import {Field, reduxForm, formValueSelector} from "redux-form";
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import TimerMixin from "react-timer-mixin";

import { reloadMenu } from '../../../actions/general';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import FormField from '../../../components/FormField/';
import FormPicker from '../../../components/FormPicker/';
import DocPicker from '../../../components/DocPicker/';

import Checkbox from '../../../components/Checkbox/';
import FormPickerDate from '../../../components/FormPickerDate/';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../../theme";
import {required, email, generateDate} from '../../../shared/validations';
import {NavigationActions} from 'react-navigation';
import assistantService from '../../../services/general/assistantService';
import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import {formatLocaleDate} from '../../../shared/validations';
import {createAlert} from '../../../components/ScreenUtils';
import generalService from "../../../services/general/generalService";
import repo from '../../../services/database/repository'
import firebaseService from "../../../services/firebase/firebaseService";
import moment from 'moment';
import {loadDataListOutages} from '../../../actions/general';
import syncService from '../../../services/general/syncService'


const backAction = NavigationActions.back({
    key: null
});

class AssistantSchedule extends Component {

    constructor() {
        super();
        this.state = {
            spinnerVisible: false,
            responseOK:null,
            responseOKUrl:null
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const {params} = this.props.navigation.state;
        this.setState({
            spinnerVisible: true
        });
        waterfall([
            (callback) => {
                assistantService.getLoadComboData(params.procedure.idRemoteServiceType, callback);
            }
        ], (err, result) => {
            if (!err) {
                if (result && result.dates.length) {
                    let data = _.map(result.dates, function (item) {
                        return {code: JSON.stringify({date:item,
                            dateFormatted:formatLocaleDate(item),
                            idRemoteServiceType:params.procedure.idRemoteServiceType,
                            remoteServiceType: params.procedure.remoteServiceType
                        }), val: formatLocaleDate(item)}
                    });

                    this.setState({
                        spinnerVisible: false,
                        data: data
                    });
                } else {
                    this.setState({data: [], spinnerVisible: false});
                }
            } else {
                this.setState({spinnerVisible: false}, function () {
                    TimerMixin.setTimeout(() => {
                        this.setState(err)
                    }, 1000);
                }.bind(this));
            }
        });
    }

    loadHours(value) {
        if (!value) {
            return;
        }
        const {params} = this.props.navigation.state;
        this.setState({
            spinnerVisible: true
        });

        value = JSON.parse(value);
        waterfall([
            (callback) => {
                assistantService.getLoadComboHoursData(value.date,params.procedure.idRemoteServiceType, callback);
            }
        ], (err, result) => {
            if (!err) {
                if (result && result.hours.length) {
                    let data = _.map(result.hours, function (item) {
                        return {code: JSON.stringify(item), val: item.hour}
                    });

                    this.setState({
                        spinnerVisible: false,
                        dataHours: data
                    });
                } else {
                    this.setState({data: [], spinnerVisible: false});
                }
            } else {
                this.setState({spinnerVisible: false}, function () {
                    TimerMixin.setTimeout(() => {
                        this.setState(err)
                    }, 1000);
                }.bind(this));
            }
        });
    }

    submit(value) {
        var me = this;
        if (me.state.spinnerVisible) {
            return;
        }

        this.setState({
            spinnerVisible: true
        });
        let dateValue = JSON.parse(value.date);
        let hoursValue = JSON.parse(value.hours);

        waterfall([
            (callback ) => {
                let params = {};
                params.idRemoteServiceType = dateValue.idRemoteServiceType;
                params.idCustomer = repo.configuration.getField('idCustomer');
                params.calendarData = hoursValue.calendarData;
                assistantService.newRemoteService(params, callback);
            }
        ], ( err, result ) => {
            if(!err){
                var message = I18n.t("REMOTE_ASSISTANT_MESSAGE");
                message = message.replace("{0}", dateValue.remoteServiceType);
                message = message.replace("{1}", dateValue.dateFormatted + " " + hoursValue.hour);
                if(this.props.navigation.state.params.onGoBack){
                    this.props.navigation.state.params.onGoBack();
                }
                TimerMixin.setTimeout(() => {
                    this.setState({
                        spinnerVisible: false,
                        responseOK: message,
                        responseOKUrl: result.data.urlCall
                    });
                    this.props.reloadMenuAlerts();
                }, 1000);
            }else{
                TimerMixin.setTimeout(() => {
                    this.setState({...err,spinnerVisible: false});
                }, 1000);
            }
        });
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('REMOTE_ASSISTANT_SCHEDULE')} back
                    {...this.props}
                />
                <PopupDialog
                    refModal={this.state.messageAlert}
                />

                <Content>
                    {!this.state.responseOK?
                    <View style={styles.formContainer}>
                        <Field name="date"
                               component={FormPicker}
                               inputLabel={I18n.t("REMOTE_ASSISTANT_SCHEDULE_DAY")}
                               errorActive
                               validate={[ required ]}
                               dataItems={this.state.data}
                               onChange={this.loadHours.bind(this)}
                               underline
                               light
                        />

                        <Field name="hours"
                               component={FormPicker}
                               inputLabel={I18n.t("REMOTE_ASSISTANT_SCHEDULE_HOUR")}
                               errorActive
                               validate={[ required ]}
                               dataItems={this.state.dataHours}
                               underline
                               light
                        />



                        {platformStyle.platform === 'ios'?
                            <Button style={{...sharedStyles.margin('top'), backgroundColor: platformStyle.brandPrimary}}
                                    block
                                    rounded
                                    onPress={this.props.handleSubmit(this.submit.bind(this))}>
                                <Text sizeNormal> {I18n.t('Submit')}</Text>
                            </Button> : null}
                    </View>:
                        <View style={styles.slide1}>
                            <View style={styles.container}>
                                <View>
                                    <Text xlarge heavy style={{color: platformStyle.brandPrimary}}>{this.state.responseOK}</Text>
                                    <Input
                                        editable={true}
                                        value={this.state.responseOKUrl}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                </Content>

                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                         overlayColor={`rgba(0, 0, 0, 0.60)`}
                         textStyle={{ color: '#FFF' }}/>

                {platformStyle.platform === 'android' && !this.state.responseOK ?
                    <Footer
                        noBorders
                        padder>
                        <FooterTab>
                            <Button style={{backgroundColor: platformStyle.brandPrimary}}
                                    block
                                    rounded
                                    onPress={this.props.handleSubmit(this.submit.bind(this))
                }>
                                <Text sizeNormal> {I18n.t('Submit')}</Text>
                            </Button>
                        </FooterTab>
                    </Footer> : null
                }
            </Container>
        );
    }
}

const AssistantScheduleScreen = reduxForm({
    form: "AssistantScheduleForm",
    enableReinitialize: true
})(AssistantSchedule);

function bindAction(dispatch) {
    return {
        reloadMenuAlerts: () => dispatch(reloadMenu())
    };
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, bindAction)(AssistantScheduleScreen);
