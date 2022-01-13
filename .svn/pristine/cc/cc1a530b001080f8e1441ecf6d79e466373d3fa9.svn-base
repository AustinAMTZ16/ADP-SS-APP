import React, {Component} from "react";
import {Image} from 'react-native';
import {Text, View, Container, Footer, FooterTab, Button, Row} from "native-base";
import {Field} from "redux-form";
import I18n from 'react-native-i18n';
import SignatureCapture from 'react-native-signature-capture';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import {platformStyle} from "../../theme";
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';
import IconFontello from '../../components/IconFontello/';
import DeviceInfo from 'react-native-device-info';
import firebaseService from "../../services/firebase/firebaseService";

class SignatureScreen extends Component {

    constructor() {
        super();
        this.state = {
            signatureAdded: false,
        };
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        firebaseService.supervisorAnalytic('SIGNATURE');
    }


    /**
     *
     * @param result
     * result.encoded - for the base64 encoded png
     * result.pathName - for the file path name
     * @private
     */
    _onSaveEvent(result) {
        this.props.navigation.state.params.onGoBack(result);
        this.props.navigation.goBack();
    }

    /**
     * This callback will be called when the user enters signature
     * @private
     */
    _onDragEvent() {
        this.setState({signatureAdded: true});
    }

    saveSign() {
        this.refs["sign"].saveImage();
    }

    render() {
        return (
            <Container>
                <Header {...this.props} noDrawer iconAction={true}/>
                <SubHeader text={I18n.t('SIGNATURE')} back={true} {...this.props}/>

                <SignatureCapture
                    ref="sign"
                    style={[{flex:1}]}
                    onSaveEvent={(result)=>this._onSaveEvent(result)}
                    onDragEvent={()=>this._onDragEvent()}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"portrait"}
                />

                <Footer noBorders padder>
                    <FooterTab>
                            <Button wide style={{backgroundColor: platformStyle.brandPrimary}}
                                    block
                                    rounded
                                    disabled={!this.state.signatureAdded}
                                    onPress={() =>{
                                        this.saveSign();
                                  }}>
                                <Text sizeNormal> {I18n.t('Submit')}</Text>
                            </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}


Component.propTypes = {};

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(SignatureScreen);
