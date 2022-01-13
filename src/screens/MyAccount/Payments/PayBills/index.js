import React, {Component} from "react";
import {Text, Button, Content, Container, Row, Body, Left, Right, View, Footer, FooterTab} from "native-base";
import {Keyboard, FlatList, Switch, TouchableOpacity} from 'react-native';
import I18n from 'react-native-i18n';
import {Field, reduxForm} from "redux-form";
import {connect} from 'react-redux';
import FormField from '../../../../components/FormField/'
import {loadDataFormPayBills} from '../../../../actions/general'
import {formatValue} from '../../../../components/CurrencyText';
import {required, amount} from '../../../../shared/validations';

import moment from 'moment-timezone';
import Config from 'react-native-config';

import NoDataFound from '../../../../components/NoDataFound/';
import {CurrencyText} from '../../../../components/CurrencyText/'
import Header from '../../../../components/Header';
import YellowSubHeader from '../../../../components/YellowSubHeader';
import SubMenu from '../../SubMenu';
import repo from '../../../../services/database/repository';
import {platformStyle} from "../../../../theme";
import sharedStyles from '../../../../shared/styles';
import Spinner from '../../../../components/Spinner';
import PopupDialog from '../../../../components/PopupDialog/';
import {NavigationActions} from 'react-navigation'
import firebaseService from "../../../../services/firebase/firebaseService";
import {formatLocaleDate} from '../../../../shared/validations';
import styles from './styles';


const backAction = NavigationActions.back({
    key: null
});

class PayBills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            reRender: new Date().valueOf(),
            data: [],
            swich: true,
            txtSwich: I18n.t("PAY_DOCUMENT_LIST_PENDING"),
            partialPayments: repo.configuration.getField('partialPayments'),
            ammountToPay: 0
        };
    }

    componentDidMount() {
        firebaseService.supervisorAnalytic('PAYBILLS');
        this.loadData();
    }

    componentWillReceiveProps( nextProps ) {
        if( this.props.paymentRefreshed !== nextProps.paymentRefreshed  ) {         
            this.loadData();
        }
    }

    loadData() {
        this.setState({
            data: this.getBySwitch(true),
            reRender: new Date().valueOf(),
            ammountToPay: 0
        }, function () {
            this.props.loadDataFormPayBills({amount: ''});
        }.bind(this));
    }

    getBySwitch(swich) {      
        var bills = JSON.parse(repo.configuration.getField('bills'));
        if (swich && bills.length) {
            bills = bills.filter(function (item) {
                if (item.billPendAmount > 0) {
                    return true
                }
                return false;
            })
        }
        return bills;
    }

    toggleSwitch(value) {
        let txt = value ? I18n.t("PAY_DOCUMENT_LIST_PENDING") : I18n.t("PAY_DOCUMENT_LIST_ALL");
        let bills = this.getBySwitch(value);
        this.setState({swich: value, txtSwich: txt, data: bills, ammountToPay: 0});
    }


    submit(values) {
        let items = this.state.data.filter(function (item) {
            return item.isSelect
        });

        let amount = 0;
        if (values.amount) {
            amount = values.amount.replace(',', '');
        } else {
            amount = this.state.ammountToPay;
        }

        if (amount <= 0) {
            this.showPopupAlert("Error!", I18n.t('PAY_0'));
            return;
        }

        if (items.length == 0) {
            this.showPopupAlert("Error!", I18n.t('PAY_BILL_REQUIRED'));
            return;
        }

        repo.configuration.setField('adpProgramData', "");
        this.props.navigation.navigate('PaymentScreen', {
            indPrepayment: false,
            amount: amount,
            listBills: items,
            idPaymentForm: repo.configuration.getField('idPaymentForm')
        });
    }   

    ShowPDF(idDocument) {

        let endPoint = Config.ENDPOINT_PROD_POST_PDF;
        let API_URL = repo.configuration.getField('domain');
        let filename = `${idDocument}.pdf`;
        let URL_FINAL = `${endPoint}${idDocument}/pdf`;
        URL_FINAL = URL_FINAL.replace("{apiVersion}", repo.configuration.getField('apiVersion'));

        let TENANT = repo.configuration.getField('tenantId');
        if (Config.IS_MULTITENANT === "true" && TENANT.length) {
            URL_FINAL = "/t/" + TENANT + URL_FINAL;
        }

        if (API_URL.substring(API_URL.length - 1) == "/") {
            API_URL = API_URL.substring(0, API_URL.length - 1);
        }

        URL_FINAL = API_URL + URL_FINAL;

        this.props.navigation.navigate('ViewPDF', {
            downloadUrl: URL_FINAL,
            title: I18n.t('PREVIEW_PDF'),
            filename: filename
        });
    }

    /**
     * POPUP
     * @param title
     * @param text
     * @param options
     */
    showPopupAlert(title, text, options, content) {
        this.setState({
            messageAlert: {
                refresh: new Date().valueOf(),
                outside: false,
                title: title,
                height: 200,
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


    selectItem(item) {
        item.isSelect = !item.isSelect;
        let value = this.state.ammountToPay;
        if (item.isSelect) {
            value += item.billPendAmount;
        } else if (value > 0) {
            value -= item.billPendAmount;
        }
      
        let formData = {amount: formatValue(value, false)};       
        this.setState({data: this.state.data, ammountToPay: value}, function () {         
            this.props.loadDataFormPayBills(formData);
        }.bind(this));
    }

    renderItem({item}) {
        let timeZone = repo.configuration.getField("timeZone");
        let style = null;
        if (item.isSelect) {
            style = {
                backgroundColor: "#CED0CE"
            };
        }
        return (
            <TouchableOpacity
                onPress={() => this.selectItem(item)} style={{flexDirection: "row", ...style}}>
                <View style={{flex: 1}}>
                    <Row style={styles.listItemRow.self}>
                        <Body flex06 style={styles.listItemRow.right}>
                        <Text light>{I18n.t('DUE_DATE')}</Text>
                        </Body>
                        <Body style={styles.listItemRow.left}>
                        <Text heavy>{( item.dueDate ? formatLocaleDate(item.dueDate) : '-')}</Text>
                        </Body>
                    </Row>

                    <Row style={styles.listItemRow.self}>
                        <Body flex06 style={styles.listItemRow.right}>
                        <Text light>{I18n.t('BILL_NUMBER')}</Text>
                        </Body>
                        <Body style={styles.listItemRow.left}>
                        <Text heavy>{item.billNumber}</Text>
                        </Body>
                    </Row>

                    <Row style={styles.listItemRow.self}>
                        <Body flex06 style={styles.listItemRow.right}>
                        <Text light>{I18n.t('PENDING_AMMOUNT')}</Text>
                        </Body>
                        <Body style={styles.listItemRow.left}>
                        <CurrencyText style={{color: "red"}} heavy value={item.billPendAmount}/>
                        </Body>
                    </Row>


                    <Row style={styles.listItemRow.self}>
                        <Body flex06 style={styles.listItemRow.right}>
                        <Text light>{I18n.t('TOTAL_AMMOUNT')}</Text>
                        </Body>
                        <Body style={styles.listItemRow.left}>
                        <CurrencyText heavy value={item.billAmount}/>
                        </Body>
                    </Row>


                    <Row style={styles.listItemRow.self}>
                        <Body flex06 style={styles.listItemRow.right}>
                        <Text light>{I18n.t('ISSUE_DATE')}</Text>
                        </Body>
                        <Body style={styles.listItemRow.left}>
                        <Text heavy>{( item.emissionDate ? formatLocaleDate(item.emissionDate) : '-')}</Text>
                        </Body>
                    </Row>
                </View>
                <View>
                    <Button style={{backgroundColor: platformStyle.brandPrimary, marginTop: 20}}
                            onPress={this.ShowPDF.bind(this, item.idDocument)}>
                        <Text heavy small>PDF</Text>
                    </Button>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => item.idDocument.toString();


    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer/>

                <SubMenu title={I18n.t("PAY_BILLS")} noMenu={true} leftIcon={"md-arrow-round-back"} {...this.props}
                         reRender={this.state.reRender}
                         indPrepayment={this.state.indPrepayment}/>

                <PopupDialog refModal={this.state.messageAlert}/>

                <YellowSubHeader text={this.state.txtSwich} right={
        		<Switch
                	onValueChange = {this.toggleSwitch.bind(this)}
                	value = {this.state.swich}/>		
        }/>

                <Content padderHorizontal>

                    <FlatList data={this.state.data}
                              style={sharedStyles.margin('bottom', 5)}
                              renderItem={this.renderItem.bind(this)}
                              keyExtractor={this._keyExtractor}
                              ItemSeparatorComponent={ () => <View style={ { width: '100%', height: 1, backgroundColor: "#CED0CE", margin: 5 } } /> }
                              extraData={this.state}
                              ListEmptyComponent={NoDataFound}
                    />

                </Content>

                <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}/>

                {this.state.data.length ?
                    <Footer style={styles.footer}>
                        <FooterTab style={{flexDirection: 'column'}}>
                            {this.state.partialPayments ?
                                <Row>
                                    <Field name="amount"
                                           component={FormField}
                                           keyboardType="numeric"
                                           validate={[ required,amount]}
                                           errorActive
                                           editable={true}
                                           inputLabel={I18n.t('AMMOUNT_TO_PAY')}
                                           light/>
                                </Row> :
                                <Row>
                                    <Left flex05><Text heavy>{I18n.t('AMMOUNT_TO_PAY')}</Text></Left>
                                    <Right><CurrencyText heavy value={this.state.ammountToPay}/></Right>
                                </Row>
                            }
                            <Row>
                                <Button style={{backgroundColor: platformStyle.brandPrimary}}
                                        rounded
                                        onPress={this.props.handleSubmit(this.submit.bind(this))}>
                                    <Text sizeNormal>{I18n.t('GO_PAY')}</Text>
                                </Button>
                            </Row>
                        </FooterTab>
                    </Footer>
                    : null}

            </Container>
        );
    }
}

const PayBillsForm = reduxForm({
    form: "PayBillsForm",
    enableReinitialize: true
})(PayBills);

const mapStateToProps = state => {
    return ({
        initialValues: state.generalReducer.formDataPayBills,
        paymentRefreshed: state.generalReducer.paymentRefreshed
    })
};

const bindAction = dispatch => {
    return {
        loadDataFormPayBills: (formData) => dispatch(loadDataFormPayBills(formData))
    };
};

export default connect(mapStateToProps, bindAction)(PayBillsForm);
