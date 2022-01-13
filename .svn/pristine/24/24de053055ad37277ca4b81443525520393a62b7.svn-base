import React, {Component} from 'react';
import { WebView as WebViewIOS } from 'react-native-webview';
import { WebView, Platform,Image } from 'react-native';

import {Container} from "native-base";
import I18n from 'react-native-i18n';

import Config from 'react-native-config'
import Header from '../../components/Header/'
import SubHeader from '../../components/SubHeader';

class ViewHTML extends Component {

    constructor( props ) {
        super(props);
        this.state = {
            htmlToShow: ''
        };
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        this.setState({
            htmlToShow: params.htmlToShow,
            onlyImage: params.onlyImage?params.onlyImage:false,
            title: params.title?params.title:""
        });
    }

    render() {       
        return (
            <Container>
                <Header {...this.props} noDrawer/>
                <SubHeader text={this.state.title} back {...this.props}/>
                
                {this.state.onlyImage?                   
                        <Image source={{ uri: this.state.htmlToShow }} style={{ width: 500, height: 500 }}/>
                    :Platform.OS === 'android' ?
                        <WebView
                            source={{html: this.state.htmlToShow}}
                        /> :
                        <WebViewIOS
                            source={{html: this.state.htmlToShow}}
                        />                
                }
            </Container>
        );
    }
}

export default ViewHTML;