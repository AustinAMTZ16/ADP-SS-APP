import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import {Button, Text, View, Content, Container, Left, Body, ListItem, Row, Icon } from "native-base";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import * as OpenAnything from 'react-native-openanything';
import waterfall from "async/waterfall";
import TimerMixin from "react-timer-mixin";

import NoDataFound from '../../../components/NoDataFound/';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import repo from '../../../services/database/repository'
import assistantService from '../../../services/general/assistantService';
import Spinner from '../../../components/Spinner';
import PopupDialog from '../../../components/PopupDialog/';
import { formatLocaleDate } from '../../../shared/validations';
import BackButton from '../../../components/BackButton';


class HistoricProcedures extends Component {

    constructor() {
        super();

        this.state = {
            spinnerVisible: false
        }
    }

    componentDidMount() {
        this.getHistoricProcedureList();
    }

    getHistoricProcedureList(){
        this.setState({
            spinnerVisible: true
        });
        waterfall([
            (callback ) => {
                let idCustomer = repo.configuration.getField('idCustomer');
                assistantService.getRemoteServiceHist(idCustomer, callback);
            }
        ], ( err, result ) => {
            if(!err){
                if(result && result.length){
                    //let data = _.sortBy(result, ["remoteServiceDate","remoteServiceFrom"], false);
                    this.setState({
                        spinnerVisible: false,
                        data: result
                    });
                } else {
                    this.setState({ data: null, spinnerVisible: false});
                }
            }else{
                this.setState({ spinnerVisible: false }, function() {
                    TimerMixin.setTimeout(() => {
                        this.setState(err)
                    }, 1000);
                }.bind(this));
            }
        });
    }

    renderItem( { item } ) {
        let remoteServiceDate = item.remoteServiceDate ? formatLocaleDate(item.remoteServiceDate) : '';
        let selected = this.state.selected==item.idRemoteServiceType;
        return (
            <ListItem column borderDark>
                <Row style={styles.listItemRow.self}>
                    <Body>
                    {(item.remoteServiceDate) ?
                        <Text sizeNormal heavy>{remoteServiceDate + " " + item.remoteServiceFrom + " " + item.remoteServiceTo}</Text> :null
                    }
                    </Body>
                </Row>

                <Row style={styles.listItemRow.self}>
                    <Body>
                    <Text sizeNormal>{item.remoteServiceType}</Text>
                    </Body>
                </Row>

                <Row style={styles.listItemRow.self}>
                    <Body>
                    <Text sizeNormal>{item.status}</Text>
                    </Body>
                </Row>
            </ListItem>
        )
    }

    _keyExtractor = ( item, index ) => index.toString();

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer iconAction={false}/>
                <SubHeader text={I18n.t('REMOTE_ASSISTANT_HISTORIC')} back noMenu {...this.props}/>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <BackButton/>
                <Content padderHorizontal>
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
            </Container>
        );
    }
}

function bindAction( dispatch ) {
    return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(HistoricProcedures);
