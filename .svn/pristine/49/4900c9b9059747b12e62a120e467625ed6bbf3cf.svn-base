import React, { Component } from "react";
import { Image, FlatList } from "react-native";
import { Container, Text, Content, Row, ListItem, Left, Body } from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";

import PopupDialog from '../../../components/PopupDialog/';
import NoDataFound from '../../../components/NoDataFound/';
import { loadDataFormConsumption } from '../../../actions/general'
import { connect } from 'react-redux';
import Header from '../../../components/Header';
import SubMenu from '../SubMenu';
import DetailTabs from '../DetailTabs/';
import ConsumptionTabs from '../ConsumptionTabs/';
import FormPicker from '../../../components/FormPicker/'
import I18n from 'react-native-i18n';
import styles from './styles';
import sharedStyles from '../../../shared/styles';
import repo from '../../../services/database/repository'
import { formatLocaleDate } from '../../../shared/validations';

import moment from 'moment-timezone';
import _ from "lodash";
import Numeral from "numeral";
import waterfall from "async/waterfall";
import Spinner from '../../../components/Spinner';
import generalService from "../../../services/general/generalService";
import TimerMixin from 'react-timer-mixin';

class AccountConsumptionList extends Component {

  constructor( props ) {
    super(props);

    this.state = {
      dataSource: [],
      meter: null,
      usage: null,
      spinnerVisible: false,
    };

  }

  //clearTimeout

  componentDidMount() {
    let consumptionLoadData = JSON.parse(repo.configuration.getField('consumptionLoadData'));

    let metersData = JSON.parse(repo.configuration.getField('consumptionMeters'));
    let consumptionMeter = repo.configuration.getField('consumptionMeter');
    let meter = _.find(metersData, function( item ) {
      return item.idDevice.toString() === consumptionMeter;
    });
    let meters = [];
    _.map(metersData, function( item ) {
      _.map(item.usages, function( item2 ) {
        meters.push({
          code: `${item.idDevice}-${item2.code}`, val: `${item.serialNum} - ${item2.description}`
        })
      })
    });


    let dataSource = (consumptionLoadData && consumptionLoadData.data
      && consumptionLoadData.data.usages && consumptionLoadData.data.usages.length) ? consumptionLoadData.data.usages : [];

    this.setState({
      dataSource,
      meters,
      meter
    }, function() {

      this.props.loadDataFormConsumption({ meter: repo.configuration.getField('consumptionMeter') });
    }.bind(this));
  }


  componentWillReceiveProps( nextProps ) {

    if( this.props.dataForm !== nextProps.dataForm ) {

      if( this.props.dataForm.meter !== nextProps.dataForm.meter ) {
        if( nextProps.dataForm.meter ) {
          repo.configuration.setField('consumptionMeter', nextProps.dataForm.meter);
          repo.configuration.setField('consumptionLoadData', JSON.stringify({}));
          this.props.loadDataFormConsumption({ meter: repo.configuration.getField('consumptionMeter') });
          let dataMeterUsage = nextProps.dataForm.meter;
          dataMeterUsage = dataMeterUsage.split("-");

          this.LoadUsage(dataMeterUsage[ 0 ], dataMeterUsage[ 1 ]);
        } else {
          this.setState({ dataSource: [], meter: null });
        }
      }


    }

  }

  LoadUsage ( idDevice, TypeConsumption ) {

    waterfall([
      ( callback ) => {
        this.setState({ spinnerVisible: true, dataSource:[] });

        let idContractedService = JSON.parse(repo.configuration.getField('serviceInfo')).idContractedService;
        if(idContractedService)
          generalService.LoadUsagesAction(idContractedService, idDevice, TypeConsumption, callback);
      },

    ], ( err, result ) => {

      if( !err ) {

        let dataSource = (result && result.data && result.data.usages && result.data.usages.length) ? result.data.usages : [];

        this.setState({
          dataSource,
          spinnerVisible: false
        });

      } else {
        this.setState({ spinnerVisible: false }, function() {
          TimerMixin.setTimeout(() => {
            this.showPopupAlert(I18n.t("INFO"), I18n.t("NO_DATA"));
          }, 1000);
        });

      }
    })
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

  renderItem( { item } ) {
    const { usage, meter } = this.state;
    return (
      <ListItem column borderDark>
        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text light style={styles.listItemRow.text}>{I18n.t('READING_DATE')}</Text>
          </Left>
          <Body>
          <Text
            heavy>{( item.readingDate ? formatLocaleDate(item.readingDate) : '-')}</Text>
          </Body>
        </Row>

        {(meter && meter.serialNum) ?
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('Meter')}</Text>
            </Left>
            <Body>

            <Text heavy>{meter.serialNum}</Text>
            </Body>
          </Row> : null}
        {(usage && usage.description) ?
          <Row style={styles.listItemRow.self}>
            <Left flex04 style={styles.listItemRow.left}>
              <Text light style={styles.listItemRow.text}>{I18n.t('UsageType')}</Text>
            </Left>
            <Body>
            <Text heavy>{usage.description}</Text>
            </Body>
          </Row> : null}

        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text light style={styles.listItemRow.text}>{I18n.t('ConsumptionValue')}</Text>
          </Left>
          <Body>
          <Text heavy>{Numeral(item.consumValue).format("0,000")} {item.descUnits}</Text>
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text light style={styles.listItemRow.text}>{I18n.t('ReadingValue')}</Text>
          </Left>
          <Body>
          <Text heavy>{item.valueReading}</Text>
          </Body>
        </Row>


        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text light style={styles.listItemRow.text}>{I18n.t('SelfReading')}</Text>
          </Left>
          <Body>
          <Text heavy>{item.indSelfRead ? 'Yes' : 'NO'}</Text>
          </Body>
        </Row>

        <Row style={styles.listItemRow.self}>
          <Left flex04 style={styles.listItemRow.left}>
            <Text light style={styles.listItemRow.text}>{I18n.t('RealReading')}</Text>
          </Left>
          <Body>
          <Text heavy>{item.indEstimated ? 'NO' : 'SI'}</Text>
          </Body>
        </Row>
      </ListItem>
    )
  }

  _keyExtractor = ( item, index ) => item.readingDate.toString();

  render() {

    let dataSource = this.state.dataSource;
    let dataSource2 = [];

    _.map(dataSource, function( item ) {
      dataSource2.push({
        readingDate: item.readingDate,
        consumValue: item.consumValue,
        descUnits: item.descUnits,
        valueReading: item.valueReading,
        indSelfRead: item.indSelfRead,
        indEstimated: item.indEstimated
      })
    })

    dataSource2.sort(function (a, b) {
      return b.readingDate - a.readingDate;
    });


    return (
      <Container>
        <Header noDrawer {...this.props} iconAction={'ios-home-outline'}/>
        <SubMenu title={I18n.t('CONSUMPTION_CHARGES')} {...this.props}/>

        <ConsumptionTabs {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />

        <Content padder>
          {this.state.meters && this.state.meters.length ?
            <Field name="meter"
                   contentStyle={sharedStyles.margin('top')}
                   component={FormPicker}
                   inputLabel={I18n.t('METER_USAGE')}
                   borderBottomStyle
                   noSelect={true}
                   dataItems={this.state.meters}
            /> : null}
          <FlatList data={dataSource2}
                    style={sharedStyles.margin('bottom', 5)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={NoDataFound}
          />
        </Content>
        <Spinner visible={this.state.spinnerVisible} textContent={I18n.t('Loading')}
                 overlayColor={`rgba(0, 0, 0, 0.60)`}
                 textStyle={{ color: '#FFF' }}/>
        <DetailTabs {...this.props} />
      </Container>
    );
  }
}

const AccountConsumptionListPage = reduxForm({
  form: "AccountConsumptionListForm"
})(AccountConsumptionList);


function bindAction( dispatch ) {
  return {
    loadDataFormConsumption: ( formData ) => dispatch(loadDataFormConsumption(formData)),
  };
}

const selector = formValueSelector('AccountConsumptionListForm');
const mapStateToProps = state => {
  return {
    dataForm: selector(state, 'meter', 'usageType'),
    initialValues: state.generalReducer.formDataConsumption
  }
};

export default connect(mapStateToProps, bindAction)(AccountConsumptionListPage);
