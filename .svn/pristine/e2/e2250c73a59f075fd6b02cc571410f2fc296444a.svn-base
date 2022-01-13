import React, { Component } from "react";
import { Image } from 'react-native';
import { Text, Content, Container } from "native-base";
import { Field } from "redux-form";
import I18n from 'react-native-i18n';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import { connect } from 'react-redux';

class Setting extends Component {

  constructor() {
    super();

    this.state = {
      parent: null,
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;

    this.setState({
      parent: (params && params.parent) ? params.parent : 'PUBLIC',
    });

  }

  render() {
    return (
      <Container>
        <Header {...this.props} noDrawer={this.state.parent === 'PUBLIC'}
                iconAction={this.state.parent === 'PUBLIC'}/>
        <SubHeader text={I18n.t('Setting')} back={this.state.parent === 'PUBLIC'}
                   {...this.props}/>

        <Content padder>


        </Content>
      </Container>
    );
  }
}


Component.propTypes = {};

function bindAction( dispatch ) {
  return {};
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, bindAction)(Setting);
