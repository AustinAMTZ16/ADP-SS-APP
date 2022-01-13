import React, { Component } from "react";
import { Image, FlatList } from 'react-native';
import { Text, Content, Container, Left, Body, ListItem, Row } from "native-base";
import { Field } from "redux-form";
import I18n from 'react-native-i18n';

import NoDataFound from '../../components/NoDataFound/';
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import sharedStyles from '../../shared/styles';
import styles from './styles'
import { connect } from 'react-redux';
import generalService from "../../services/general/generalService";
import waterfall from "async/waterfall";
import repo from "../../services/database/repository";
import moment from 'moment-timezone';
import Spinner from '../../components/Spinner';
import firebaseService from "../../services/firebase/firebaseService";
import { formatLocaleDate } from '../../shared/validations';



class NewApplications extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      spinnerVisible: false,
      parent: null
    }

}

  componentDidMount() {
    const { params } = this.props.navigation.state;

    firebaseService.supervisorAnalytic('NEWAPPLICATIONS');

    this.setState({
      parent: (params && params.parent) ? params.parent : 'PUBLIC', spinnerVisible: true
    });

    waterfall([
      ( callback ) => {
        let idDocument = repo.configuration.getField('idCustomer');
        generalService.getWRAction(idDocument, callback);
      },
    ], ( err, result ) => {

      this.setState({
        spinnerVisible: false
      }, function() {
        if( !err ) {
          this.setState({ data: result });
        } else {
          //console.log("GDI-ERROORRRRR", err)
        }
      }.bind(this));

    });

  }

  renderItem( { item } ) {

    return (
      <ListItem column borderDark>
        <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
          <Left flex03 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('CODE')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.workRequestCode}</Text>
          </Body>
        </Row>
        <Row style={styles.listItemRow.self}>
          <Left flex03 style={styles.listItemRow.left}>
            <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('Status')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{item.workRequestStatusDesc}</Text>
          </Body>
        </Row>
        <Row style={{ ...styles.listItemRow.self, ...sharedStyles.margin('top', 2) }}>
          <Left flex03 style={styles.listItemRow.left}>
          <Text sizeNormal light style={styles.publicItemRow.text}>{I18n.t('LAST_DATE')}</Text>
          </Left>
          <Body>
          <Text sizeNormal heavy>{( item.lastChangeStatusDate ? formatLocaleDate(item.lastChangeStatusDate) : '-')}</Text>
          </Body>
        </Row>
      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => item.idWorkRequest.toString();

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer
                iconAction={true}/>

        <SubHeader text={I18n.t('NewApplications')} back={true}
                   {...this.props}/>

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

function bindAction( dispatch ) {
  return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(NewApplications);
