import React, { Component } from 'react';
import { View, Text, StyleSheet, Navigator, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';
import styles from "./styles";
import { connect } from 'react-redux';
import {platformStyle} from "../../theme";

const slideAnimation = new SlideAnimation({ slideFrom: 'top' });
const scaleAnimation = new ScaleAnimation();
const fadeAnimation = new FadeAnimation({ animationDuration: 150 });
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;


class PopupModal extends Component {
  constructor( props ) {
    super(props);

    this.state = {
      dialogShow: false,
      title: 'Alerta'
    };
  }


  componentWillReceiveProps( nextProps ) {

    if( this.props.dismiss !== nextProps.dismiss ) {
      this.setState({
        content: null,
      }, this.currentPopupModal.dismiss());
    }
    if( nextProps.refModal && !this.props.refModal ||
      (nextProps.refModal && this.props.refModal.refresh !== nextProps.refModal.refresh ) ) {

      let actions = _.map(nextProps.refModal.options, function( item ) {
        return ( <DialogButton
          text={item.text.toUpperCase()}
          onPress={() => {
            this.currentPopupModal.dismiss();
            if( item.action ) {
              if( item.actionParameter )
                item.action(item.actionParameter);
              else
                item.action();
            }
          }}
          align={item.align ? item.align : 'center'}
          key={item.key}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
          textContainerStyle={styles.buttonTextContainerStyle}
        />)
      }.bind(this));


      this.setState({
        outside: nextProps.refModal ? nextProps.refModal.outside : true,
        title: nextProps.refModal.title ? nextProps.refModal.title : this.state.title,
        dialogAnimation: nextProps.refModal.animation === 2 ? 2 : 1,
        Height: nextProps.refModal.height ? nextProps.refModal.height : null,
        contentText: nextProps.refModal.contentText ? nextProps.refModal.contentText : '',
        content: nextProps.refModal.content ? nextProps.refModal.content : null,
        actions
      }, this.currentPopupModal.show())

    }
  }

  
  
  render() {
    return (
      <PopupDialog
        ref={( popupDialog ) => {
          this.currentPopupModal = popupDialog;
        }}
        dismissOnTouchOutside={this.state.outside}
        width={deviceWidth - 40}
        height={this.state.Height}
        dialogStyle={styles.dialogGeneral}
        dialogAnimation={slideAnimation}
        dialogTitle={<DialogTitle
          titleTextStyle={styles.titleTextStyle}
          titleStyle={{...styles.titleStyle, backgroundColor: platformStyle.brandPrimary}}
          title={this.state.title}/>}
        actions={this.state.actions}
      >
        <View style={styles.dialogContentView}>
          {this.state.content ? this.state.content : null}
          {this.state.contentText ?
            <Text style={styles.contentText}>{this.state.contentText}</Text> : null}
        </View>
      </PopupDialog>
    );
  }
}


function bindAction( dispatch ) {
  return {
    // loadDataFormLogin: ( formData ) => dispatch(loadDataFormLogin(formData))
  };
}


const mapStateToProps = state => {
  return {
    popupDismiss: state.drawerReducer.popupDismiss,
  };
};


export default connect(mapStateToProps, bindAction)(PopupModal);