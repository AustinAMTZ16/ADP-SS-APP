import React, { Component } from "react";
import { Text, Content, Container, Button } from "native-base";
import I18n from 'react-native-i18n';
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from 'react-redux';

import Tabs from '../EditTabs';
import Header from '../../../components/Header';
import SubHeader from '../../../components/SubHeader';
import FormFieldPress from '../../../components/FormFieldPress/';
import {platformStyle} from "../../../theme";
import { required } from '../../../shared/validations';
import ImagePicker from 'react-native-image-picker';
import {
  loadDataFormHolderDocumentation
} from '../../../actions/general';
import PopupDialog from '../../../components/PopupDialog/';

class Documentation extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      data: {},
      messageAlert: {},
    };
  }


  componentDidMount() {
    const { params } = this.props.navigation.state;

    this.setState({
      params
    });

  }

  submit( values ) {
    this.props.navigation.navigate("HolderRequestResumen", {
      step1: this.state.params.step1,
      step2: this.state.params.step2,
      step3: this.state.data,
    });
  }

  selectPhotoTapped( type ) {
    this.showPopupAlert(I18n.t("MSG016"), null, null,
      {
        1: {
          key: 'button1',
          text: `${I18n.t('TakePhoto')}`,
          action: () => this.pickerPhoto(type, 'launchCamera'),
          align: ''
        },
        2: {
          key: 'button2',
          text: `${I18n.t('SelectPhoto')}`,
          action: () => this.pickerPhoto(type, 'launchImageLibrary'),
          align: ''
        }
      });
  }


  pickerPhoto( type, actionType ) {

    const options = {
      title: null,
      takePhotoButtonTitle: I18n.t('TakePhoto'),
      chooseFromLibraryButtonTitle: I18n.t('SelectPhoto'),
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    if( actionType === 'launchCamera' ) {
      ImagePicker.launchCamera(options, ( response ) => {

        if( response.didCancel ) {
          //console.log('User cancelled photo picker');
        }
        else if( response.error ) {
          //console.log('ImagePicker Error: ', response.error);
        }
        else if( response.customButton ) {
          //console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let forms = _.cloneDeep(this.props.dataForm);
          forms[ type ] = response.fileName;
          this.props.loadDataFormHolderDocumentation(forms);
          let data1 = _.cloneDeep(this.state.data);
          data1[ type ] = { name: response.fileName, uri: response.uri, origURL: response.origURL };
          this.setState({ data: data1 });
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, ( response ) => {

        if( response.didCancel ) {
          //console.log('User cancelled photo picker');
        }
        else if( response.error ) {
          //console.log('ImagePicker Error: ', response.error);
        }
        else if( response.customButton ) {
          //console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let forms = _.cloneDeep(this.props.dataForm);
          forms[ type ] = response.fileName;
          this.props.loadDataFormHolderDocumentation(forms);
          let data1 = _.cloneDeep(this.state.data);
          data1[ type ] = { name: response.fileName, uri: response.uri, origURL: response.origURL };
          this.setState({ data: data1 });
        }
      });
    }
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
        outside: true,
        title: title,
        height: 190,
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
        <Header {...this.props} noDrawer/>
        <SubHeader text={I18n.t('Change_Account_Holder')} back {...this.props}/>
        <Tabs {...this.props}/>
        <PopupDialog
          refModal={this.state.messageAlert}
        />
        <Content padder>

          <Field name="nationalId"
                 component={FormFieldPress}
                 label={I18n.t('National ID')}
                 placeholder={I18n.t('Select File')}
                 validate={[ required ]}
                 onPress={() => { this.selectPhotoTapped('nationalId')}} //DT00002
          />

          <Field name="documentLease"
                 component={FormFieldPress}
                 label={I18n.t('Document of Lease')}
                 placeholder={I18n.t('Select File')}
                 onPress={() => { this.selectPhotoTapped('documentLease')}} //DT0028
          />

          <Field name="ownershipDocument"
                 component={FormFieldPress}
                 label={I18n.t('Ownership Document')}
                 placeholder={I18n.t('Select File')}
                 onPress={() => { this.selectPhotoTapped('ownershipDocument')}} //DT0060
          />

          <Button block rounded style={{ backgroundColor: platformStyle.brandPrimary}} onPress={this.props.handleSubmit(this.submit.bind(this))}>
            <Text sizeNormal>{I18n.t('Save')}</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}

const DocumentationPage = reduxForm({
  form: "DocumentationForm",
  enableReinitialize: true,
})(Documentation);


function bindAction( dispatch ) {
  return {
    loadDataFormHolderDocumentation: ( formData ) => dispatch(loadDataFormHolderDocumentation(formData)),
  };
}

// const mapStateToProps = state => {
//   return {
//   }
// };

const selector = formValueSelector('DocumentationForm');
const mapStateToProps = state => {
  return {
    dataForm: selector(state, 'nationalId', 'documentLease', 'ownershipDocument'),
    initialValues: state.generalReducer.formDataHolderDocumentation
  }
};


export default connect(mapStateToProps, bindAction)(DocumentationPage);

