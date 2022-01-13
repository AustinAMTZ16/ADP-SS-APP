import React, { Component } from "react";
import { Image } from "react-native";
import { Text, Content, Container, Left, Body, Row } from "native-base";
import I18n from 'react-native-i18n';

import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import YellowSubHeader from '../../../components/YellowSubHeader/';
import Tabs from '../Tabs';
import Map from '../../Map/';
import styles from './styles'
import repo from '../../../services/database/repository'
import {platformStyle} from "../../../theme";
import waterfall from "async/waterfall";
import generalService from "../../../services/general/generalService";
import Spinner from '../../../components/Spinner';
import TimerMixin from "react-timer-mixin";


class MyDataPhysicalAddress extends Component {
  constructor() {
    super();

    this.state = {
      markers: [],
      AddressList: [],
      data: null,
      spinnerVisible: false,
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
  }


  loadData() {

    this.setState({ AddressList: null, spinnerVisible: true });
    let idCustomer = repo.configuration.getField('idCustomer');

    waterfall([
      ( callback ) => {
        generalService.CoordsListAction(idCustomer, callback);
      },
    ], ( err, result ) => {

      if( !err ) {
        if( result.data && result.data.length ) {
          this.setState({ AddressList: result.data, spinnerVisible: false });
          let cont = 1;

          let markers = [];

          _.map(result.data, function( item ) {
            
            if(item.longitudeDegrees!=""){
              markers.push({
                "type": "Feature",
                "coordenates_type": "origin",
                "title": item.accountNumber,
                "description": item.completeAddress,
                "geometry": {
                  "type": "Point",
                  "coordinates": [ item.longitudeDegrees.toString(), item.latitudeDegrees.toString() ]
                },
                "properties": {
                  'icon': 'monument',
                  "itemID": `${cont}`
                }
              });
              cont++;
            }
          });
          
          this.setState({ markers, data: JSON.parse(repo.configuration.getField('customerData')) })

        } else {
          this.setState({
            AddressList: null,
            spinnerVisible: false,
            data: JSON.parse(repo.configuration.getField('customerData'))
          });
        }
      } else {
        this.setState({
          spinnerVisible: false,
        }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
          }, 1000);
        });

      }
    });
  }


  /**
   *
   * @param title
   * @param text
   * @param content
   * @param options
   */
  showPopupAlert( title, text, content, options ) {
    this.setState({
      messageAlert: {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: 300,
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


  render() {
    return (
      <Container>
        <Header {...this.props}
                noDrawer
                iconAction={true}/>
        <SubHeader text={I18n.t('MyData')} back={true} {...this.props}/>
        <Tabs {...this.props}/>

        <Content>
          <Row style={{...styles.listItemRow.self, backgroundColor: platformStyle.brandYellowLight}}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text sizeNormal light style={styles.listItemRow.text}>{I18n.t('Customer_Address')}</Text>
            </Left>
            <Body>
            <Text heavy sizeNormal>
              {this.state.data ? this.state.data.completeAddress : ''}
            </Text>
            <Text/>
            </Body>

          </Row>

          {this.state.markers.length?
            <YellowSubHeader text={I18n.t('MY_SUPPLIES')}/>
          :null}

          {this.state.markers.length?
            <Map
              renderclusters={false}
              markers={this.state.markers}
            />
           :null}
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
      </Container>
    );
  }
}

export default MyDataPhysicalAddress;
