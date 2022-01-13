import React, { Component } from "react";
import {
  Text,
  View,
} from "native-base";
import {platformStyle} from "../../theme";
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
// import Spinner from 'react-native-loading-spinner-overlay';
import Spinner from '../../components/Spinner';

Component.propTypes = {};

class loading extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      show: false,
      showBlock: false
    };
  }

  componentDidMount() {
    this.setState({
      show: this.props.appToggleLoading !== null ? this.props.appToggleLoading : false,
      showBlock: this.props.appToggleLoadingBlock !== null ? this.props.appToggleLoadingBlock : false,
    })
  }

  componentWillReceiveProps( nextProps ) {
    if( this.props.appToggleLoading !== nextProps.appToggleLoading ) {
      this.setState({
        show: nextProps.appToggleLoading,
      })
    }
    if( this.props.appToggleLoadingBlock !== nextProps.appToggleLoadingBlock ) {
      this.setState({
        showBlock: nextProps.appToggleLoadingBlock,
      })
    }
  }

  render() {

    return (
      <View style={this.props.styleProp}>
        <Spinner visible={this.state.showBlock} textContent={I18n.t('Loading')} overlayColor={`rgba(0, 0, 0, 0.90)`}
                 textStyle={{ color: '#FFF' }}/>
      </View>
    );
  }
}

function bindAction( dispatch ) {
  return {};
}

const mapStateToProps = state => ({
  appToggleLoading: state.syncReducer.appToggleLoading,
  appToggleLoadingBlock: state.syncReducer.appToggleLoadingBlock,
});

export default connect(mapStateToProps, bindAction)(loading);


