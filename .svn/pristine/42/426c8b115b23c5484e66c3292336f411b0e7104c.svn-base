import React, {Component} from "react";
import {Image, FlatList} from 'react-native';
import {Text, Content, Container, Left, Body, ListItem, Row} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';

import NoDataFound from '../../components/NoDataFound/';
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import styles from './styles'
import {platformStyle} from "../../theme";
import {connect} from 'react-redux';
import generalService from "../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from "../../services/database/repository";
import moment from 'moment-timezone';
import Spinner from '../../components/Spinner';
import TimerMixin from "react-timer-mixin";
import PopupDialog from '../../components/PopupDialog/';
import { formatLocaleDate } from '../../shared/validations';


class ServiceRequests extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            spinnerVisible: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            spinnerVisible: true
        });
        let idDocument = repo.configuration.getField('idCustomer');
        generalService.getServiceRequests(idDocument, (err, result) => {
            if(!err){
                generalService.getWRAction(idDocument, (err, result2) => {
                	this.setState({spinnerVisible: false});
                	if(!err){
                		
                		let data = [];
                		if(result.length){
                			data = result;
                		}
                		if(data.length){
                			data = data.concat(result2);
                		}else{
                			data = result2;
                		}
                		
                		for(let i in data){
                			if(data[i].changeDate){
                				data[i].lastChangeStatusDate = data[i].changeDate;
                			}
                			if(data[i].workRequestStatusDesc){
                				data[i].descStatus = data[i].workRequestStatusDesc;
                			}
                			if(data[i].workRequestCode){
                				data[i].reference = data[i].workRequestCode;
                			}
                		}
                		data = _.sortBy(data, "lastChangeStatusDate", true);
                		
                		this.setState({data: data.reverse()});
                	}
                });
            }
        });
        
    }

    renderItem({item}) {
        return (
            <ListItem column borderDark>
                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex04 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('CODE')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.reference}</Text>
                    </Body>
                </Row>
                <Row style={styles.listItemRow.self}>
                    <Left flex04 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('Status')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal heavy>{item.descStatus}</Text>
                    </Body>
                </Row>
                <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
                    <Left flex04 style={styles.listItemRow.left}>
                        <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('LAST_DATE')}</Text>
                    </Left>
                    <Body>
                    <Text sizeNormal
                          heavy>{( item.lastChangeStatusDate ? formatLocaleDate(item.lastChangeStatusDate) : '-')}</Text>
                    </Body>
                </Row>
            </ListItem>
        )
    }

    _keyExtractor = (item, index) => index.toString();

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer
                                        iconAction={true}/>
                <SubHeader text={I18n.t('SERVICE_REQUESTS')} back={true}
                    {...this.props}/>

                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                <Content padder>
                    <FlatList data={this.state.data}
                              style={sharedStyles.margin('bottom', 5)}
                              renderItem={this.renderItem}
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


Component.propTypes = {};

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(ServiceRequests);
