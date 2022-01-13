import React, { Component } from "react";
import { TouchableOpacity } from 'react-native';
import { Text, Content, Container, Left, Body, ListItem, Row, View, Icon } from "native-base";
import { FlatList } from 'react-native';
import I18n from 'react-native-i18n';

import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import sharedStyles from '../../../shared/styles';
import styles from './styles'
import waterfall from "async/waterfall";
import generalService from "../../../services/general/generalService";
import repo from '../../../services/database/repository'
import Spinner from '../../../components/Spinner';
import moment from 'moment-timezone';
import NoDataFound from '../../../components/NoDataFound/';
import { formatLocaleDate } from '../../../shared/validations';

class ComplaintsSuggestionsList extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			data: [],
			spinnerVisible: false,
			parent: null,
		}
	}

	
	componentDidMount() {
		this.loadData();
	}

	loadData(){

		const { params } = this.props.navigation.state;

		this.setState({
			parent: (params && params.parent) ? params.parent : 'PUBLIC',
					spinnerVisible: true
		});

		waterfall([
			( callback ) => {
				let idDocument = repo.configuration.getField('idCustomer');
				generalService.getRccAction(idDocument, callback);
			},
			], ( err, result ) => {

				this.setState({
					spinnerVisible: false
				}, function() {
					if( !err ) {
						this.setState({ data: result.data });
					} else {
					}
				}.bind(this));

		});
	}
  
  renderItem( { item } ) {
    return (
      <ListItem column borderDark>
        <Row style={sharedStyles.margin('bottom', 2)}>
          <Left>
            <Text sizeNormal heavy>{item.reference}</Text>
          </Left>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Type')}:</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.descType}</Text>
          </Body>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Status')}:</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.descStatus}</Text>
          </Body>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Last_Change')}:</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{( item.createDate ? formatLocaleDate(item.createDate) : '-')}</Text>
          </Body>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex05 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Description')}:</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.motive}</Text>
          </Body>
        </Row>
          <Row style={styles.listItemRow.self}>
              <Left flex05 style={styles.listItemRow.left}>
                  <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('CustomerName')}:</Text>
              </Left>
              <Body>
              <Text sizeNormal heavy>{item.customer}</Text>
              </Body>
          </Row>
      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => item.idComplaint.toString();

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>

        <SubHeader text={I18n.t('RCCS')} back={true}
                   menu={{
                     icon: 'ios-list-outline', isOpened: true,
                     items:
                       <View>
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.props.navigation.navigate('NewSuggestion', {load: this.loadData.bind(this)})}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('NewSuggestion')}</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.menu.item}
                                           onPress={() => this.props.navigation.navigate('NewComplaint', {load: this.loadData.bind(this)})}>
                           <Icon name="ios-list-outline" style={styles.menu.icon}/>
                           <Text white sizeNormal>{I18n.t('NewComplaint')}</Text>
                         </TouchableOpacity>
                       </View>
                   }} {...this.props} />

        <Content>

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

export default ComplaintsSuggestionsList;
