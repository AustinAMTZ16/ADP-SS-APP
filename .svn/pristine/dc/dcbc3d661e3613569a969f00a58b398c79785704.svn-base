import React, { Component, useState } from "react";
import { TouchableOpacity } from 'react-native';
import { Text, Content, Container, Left, Body, ListItem, Row,
    View, Icon, Button, Footer, FooterTab} from "native-base";
import { FlatList } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import TimerMixin from "react-timer-mixin";
import { Field, reduxForm } from "redux-form";
import Config from 'react-native-config';
import * as OpenAnything from "react-native-openanything";

import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import waterfall from "async/waterfall";
import base64 from 'base-64';
import {platformStyle} from "../../../theme";

import Spinner from '../../../components/Spinner';
import NoDataFound from '../../../components/NoDataFound/';
import { required } from '../../../shared/validations';
import linkContractService from "../../../services/general/linkContractService";
import PopupDialog from '../../../components/PopupDialog/';
import FormPicker from '../../../components/FormPicker/'
import repo from '../../../services/database/repository'

class AnnualFolioScreen extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			data: [],
			spinnerVisible: false
		}
        this.pastYears = [];
        this.yearSelected = 0;
	}

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

    onFolio() {
        const year = this.yearSelected;
        const nis = repo.configuration.getField('accountNumber');
        if (year < 2022) {
            this.showPopupAlert(I18n.t('Error'), I18n.t('ViewFoliosError'));
        } else {
            var parameter = {
                nis:nis,
                anual:year
            };
            var parameterEncode = base64.encode(JSON.stringify(parameter));
            var url = Config.TIKETTO;
            OpenAnything.Open(url+'?id='+parameterEncode);
            console.log(parameterEncode);
        }
    }

    componentWillMount() {
        var nextYear = (new Date().getFullYear()+1).toString();
        this.pastYears.push({ code:nextYear, val: nextYear})
        for(var i =0;i<4;i++){
            let year = (new Date().getFullYear()-i).toString();
            this.pastYears.push({ code:year, val: year})
        };
    }

	loadData(year){
        this.setState({ spinnerVisible: true});

		waterfall([
			( callback ) => {
                let req = {
                    "account": repo.configuration.getField('accountNumber'),
                    //"account": 26
                    "year": year
                };
                linkContractService.getTicket(req,callback);
			},
			], ( err, result ) => {
                if(!err){
                    this.setState({ data: result,spinnerVisible: false});
                }else{
                    TimerMixin.setTimeout(() => {
                        this.setState({...err,spinnerVisible: false});
                    }, 1000);
                }
		});
	}

    yearComboChange(value){
        this.yearSelected = value;
        this.loadData(value);
    }

    renderItem( { item } ) {
        return (
            <ListItem column borderDark >
                <Row style={styles.listItemRow.self}>
                    <Left flex05 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('ANNUAL_FOLIO_NUMBER')}:</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.folioNumber}</Text>
                    </Body>
                </Row>

                <Row style={styles.listItemRow.self}>
                    <Left flex05 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('ANNUAL_FOLIO_DATE')}:</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.folioDate}</Text>
                    </Body>
                </Row>

            </ListItem>
        )
    }

  _keyExtractor = ( item, index ) => item.folioNumber.toString();

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>
          <SubHeader text={I18n.t('ANNUAL_FOLIO_CONSULTATION')} back {...this.props}/>
          <PopupDialog
              refModal={this.state.messageAlert}
          />
        <Content>
            <Field name="year"
                   component={FormPicker}
                   validationActive
                   inputLabel={I18n.t('MONTHS')}
                   borderBottomStyle
                   errorActive
                   onChange={(value) => {this.yearComboChange(value)}}
                   validate={[ required ]}
                   dataItems={this.pastYears}
            />
            <FlatList data={this.state.data}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
            />
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        
        <Footer noBorders padder>
            <FooterTab>
                <Button block rounded style={{backgroundColor: platformStyle.brandPrimary}}
                        onPress={this.onFolio.bind(this)}>
                    <Text sizeNormal>{I18n.t('ViewFolios')}</Text>
                </Button>
            </FooterTab>
        </Footer>

      </Container>
    );
  }
}

const AnnualFolio = reduxForm({
    form: "AnnualFolioForm"
})(AnnualFolioScreen);

function bindAction( dispatch ) {
    return {};
}

const mapStateToProps = state => {
    return {
        initialValues: state.generalReducer.AnnualFolioForm,
    }
};

export default connect(mapStateToProps, bindAction)(AnnualFolio);