import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput, Platform } from "react-native";
import { Container, Text, Button } from "native-base";
import I18n from 'react-native-i18n';
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import Spinner from '../../components/Spinner';
import PopupDialog from '../../components/PopupDialog/';
import waterfall from "async/waterfall";
import generalService from "../../services/general/generalService";
import styles from "./style";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

class ValidateDocuments extends Component  {
  constructor (props) {
    super(props)

    this.state = {
      spinnerVisible: false,
      messageAlert: null,
      numLetter: null,
      letterData: null,
      showHelp: true
    }
  }

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

  submit() {
    let letter = this.state.numLetter

    if (letter && letter.length) {
      letter = letter.toUpperCase()

      this.setState({ spinnerVisible: true, letterData: null })

      waterfall([
        ( callback ) => {
          generalService.validateDocumentsAction({ numLetter: letter }, callback)
        }
      ], ( err, result ) => {
        let letterData = null
         
        if (!err) {
          if (result && result.data) {
            letterData = result.data
          } else {
            err = I18n.t('data_not_fount')
          }
        }

        this.setState({ spinnerVisible: false }, () => {
          setTimeout(function () {
            if (err)
              this.showPopupAlert("Error", err)
            else
              this.setState({ letterData: letterData })
          }.bind(this), 1000);
        });
      })
    }
  }

  async openScanner() {
    this.props.navigation.navigate('QRCodeScanner', { onScanResult: this.onScanResult.bind(this) })
  }

  onScanResult(data) {
    if (data && data.length) {
      this.setState({ numLetter: data }, () => {
        setTimeout(this.submit.bind(this), 500)
      })
    }
  }

  render() {
    let letterData = this.state.letterData
    let numLetter = this.state.numLetter
    let showHelp = this.state.showHelp

    return (
      <Container>
        <Header {...this.props} noDrawer iconAction={true} />
        <SubHeader text={I18n.t("VALIDATE_DOC")} back={true} {...this.props} />
        <PopupDialog refModal={this.state.messageAlert} />
        { letterData && 
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text large>{`${I18n.t('DOC_SERIAL')} ${letterData.numSerie ? letterData.numSerie : '-'}`}</Text>
              <Text large>{`${I18n.t('DOC_CODE')} ${letterData.proCode ? letterData.proCode : '-'}`}</Text>
              <Text large>{`${I18n.t('DOC_PROCESS_NAME')} ${letterData.proName ? letterData.proName : '-'}`}</Text>
              <Text large>{`${I18n.t('DOC_ADDRESS')} ${letterData.address ? letterData.address : '-'}`}</Text>
              <Text large>{`${I18n.t('DOC_PROCESS_STATUS')} ${letterData.status ? letterData.status : '-'}`}</Text>
              <Text large>{`${I18n.t('DOC_ISSUE_DATE')} ${letterData.genDate ? new Date(letterData.genDate).toLocaleDateString() : '-'}`}</Text>
              <Text large>{`${I18n.t('DOC_EXP_DATE')} ${letterData.expDate ? new Date(letterData.expDate).toLocaleDateString() : '-'}`}</Text>

              <TouchableOpacity style={styles.closeModal} onPress={() => { this.setState({ letterData: null }) }}>
                <Text large style={{ color: 'white' }}>{I18n.t("close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        <View style={styles.mainContainer}>
          <View style={styles.mainView}>
            <TextInput
              style={styles.input()}
              autoCapitalize='characters'
              autoCorrect={false}
              secureTextEntry={false}
              blurOnSubmit={false}
              placeholder={I18n.t('VALIDATION_CODE')}
              placeholderTextColor="#979797"
              onSubmitEditing={() => { this.submit() }}
              onChangeText={(text) => { 
                if (text && text.length)
                  text = text.toUpperCase()
                this.setState({ numLetter: text }) 
              }}
              onEndEditing={() => { this.submit() }}
              onKeyPress={(event) => { 
                if (event && event.key && event.key === 'Enter') {
                  this.submit()
                }
              }}
              value={numLetter}
            />

            <TouchableOpacity onPress={this.openScanner.bind(this)}>
              <MaterialCommunityIcons name={'qrcode-scan'} size={30} style={{ color: 'black' }}/>
            </TouchableOpacity>
          </View>

          <Button block rounded wide style={styles.search} onPress={() => { this.submit() }}>
            <Text>{I18n.t("Search")}</Text>
          </Button>

          <View style={{ alignContent: 'center' }}>
            <TouchableOpacity onPress={() => { this.setState({ showHelp: !showHelp}) }}>
              <View style={styles.helperContainer}>  
                <Text large> {I18n.t('INFO')} </Text>
                <MaterialIcons 
                  name={showHelp ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                  size={20} 
                  style={{ color: 'black' }}
                />
              </View>
            </TouchableOpacity>

            {showHelp && 
              <View style={{...styles.helperMessage, }}>
                <Text large> {I18n.t('DOC_SCREEN_CONTENT')} </Text>
              </View> 
            }            
          </View>
        </View>

        <Spinner visible={this.state.spinnerVisible} textContent="..."/>
      </Container>
    )
  }
}

export default ValidateDocuments;