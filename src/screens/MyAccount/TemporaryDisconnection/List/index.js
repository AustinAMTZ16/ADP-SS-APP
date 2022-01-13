import React, { Component } from "react";
import { TouchableOpacity } from 'react-native';
import { Text, Content, Container, Left, Body, ListItem, Row, View, Icon } from "native-base";
import { FlatList } from 'react-native';
import I18n from 'react-native-i18n';

import Header from '../../../../components/Header';
import SubHeader from '../../../../components/SubHeader';
import sharedStyles from '../../../../shared/styles';
import styles from './styles'
import generalService from "../../../../services/general/generalService";
import repo from '../../../../services/database/repository'
import Spinner from '../../../../components/Spinner';
import moment from 'moment-timezone';
import NoDataFound from '../../../../components/NoDataFound/';
import { formatLocaleDate } from '../../../../shared/validations';

class TemporaryDisconnectionList extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: [],
      spinnerVisible: false,
      timeZone: repo.configuration.getField("timeZone"),
      reload: false,
      indActive: false,
      indMain: false,
      disconnectionActive: false
    }
    
  }

  
  componentDidMount() {	  
	 	
    this.setState({
      spinnerVisible: true
    });

    let serviceInfo = JSON.parse(repo.configuration.getField('serviceInfo'));
    let idContractedService = serviceInfo.idContractedService;
    let AdditionalData = JSON.parse(repo.configuration.getField('accountAdditionalData'));
	this.setState({indActive: AdditionalData.indActive, indMain: AdditionalData.indMain});
    
    generalService.getDisconnectionList(idContractedService, function(err, response){
    	
    	if(!err){
        	this.setState({data: response.data})
        	for (var i = 0; i < response.data.length; i++) {
	            if (response.data[i].indActive==1) {
	            	this.setState({disconnectionActive: true});
	                break;
	            }
	        }
    	}
    	this.setState({spinnerVisible: false});
    	
    }.bind(this));
    
    
  }

  renderItem( { item } ) {
    return (
      <ListItem column borderDark>
        <Row style={sharedStyles.margin('bottom', 2)}>
          <Left>
            	<Text sizeNormal heavy>{item.reference}</Text>
          </Left>
        </Row>
        <Row>
          <Left>
            	<Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Account')}:</Text>
          </Left>
          <Body>
          		<Text sizeNormal heavy>{item.accountNumber}</Text>
          </Body>
        </Row>
        <Row>
	        <Left>
	          	<Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Status')}:</Text>
	        </Left>
	        <Body>
	        	<Text sizeNormal heavy>{item.descStatus}</Text>
	        </Body>
        </Row>
        <Row>
          <Left>
            	<Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('CREATION_DATE')}:</Text>
          </Left>
          <Body>
          		<Text sizeNormal heavy>{( item.creationDate ? formatLocaleDate(item.creationDate) : '-')}</Text>
          </Body>
        </Row>
        <Row>
	        <Left>
	          	<Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('DISCONNECTION_DATE')}:</Text>
	        </Left>
	        <Body>
	        	<Text sizeNormal heavy>{( item.disconnectionDate ? formatLocaleDate(item.disconnectionDate) : '-')}</Text>
	        </Body>
        </Row>
	    <Row>
	      <Left>
	        	<Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('RECONNECTION_DATE')}:</Text>
	      </Left>
	      <Body>
	      		<Text sizeNormal heavy>{( item.reconnectionDate ? formatLocaleDate(item.reconnectionDate) : '-')}</Text>
	      </Body>
	    </Row>
      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => item.idComplaint.toString();

  render() {
	  let menu = ({items:null});
	  if((this.state.indActive && this.state.indMain) && !this.state.disconnectionActive){

			menu = ({

        		icon: 'ios-list-outline', isOpened: true,
        		items:
			            <View>
			              <TouchableOpacity style={styles.menu.item}
			                                onPress={() => this.props.navigation.navigate('NewDisconnection', {reload:this.componentDidMount.bind(this)})}>
			                <Icon name="ios-list-outline" style={styles.menu.icon}/>
			                <Text white sizeNormal>{I18n.t('NEW_DISCONNECTION')}</Text>
			              </TouchableOpacity>
			            </View>
			});  
		  
	  }
		
	return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>
      
        <SubHeader text={I18n.t('TEMPORARY_DISCONNECTION')} back={true}
        	menu={menu} {...this.props} />
        <Content>

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

export default TemporaryDisconnectionList;
