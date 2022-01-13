import React, {Component} from "react";
import {TouchableOpacity} from "react-native";
import {Icon, Text, Row, View, Left, Right, Body, Button} from "native-base";
import {NavigationActions} from 'react-navigation';
import waterfall from "async/waterfall";
import TimerMixin from "react-timer-mixin";

import {createAlert} from '../../components/ScreenUtils';
import subHeaderStyles from '../../components/SubHeader/styles';
import PopupDialog from '../../components/PopupDialog/';
import I18n from 'react-native-i18n';
import styles from './styles';
import sharedStyles from '../../shared/styles'
import IconFontello from '../../components/IconFontello/';
import {platformStyle} from "../../theme";
import {CurrencyText} from '../../components/CurrencyText/'
import repo from '../../services/database/repository'
import {connect} from 'react-redux';


const backAction = NavigationActions.back({
    key: null
});

class ContractSubMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false
        };
    }

    onLinkContract(){
        console.log("Excecuted onLinkContract ContractSubMenu");
        if(this.props.onLinkContract){
            this.props.onLinkContract();
        }
    } 

    render() {
        const {leftIcon, noMenu, title, navigation} = this.props;

        return (

            <View>
                <PopupDialog
                    refModal={this.state.messageAlert}
                />
                {leftIcon ?
                    <Row style={{...subHeaderStyles.subHeader.self, backgroundColor: platformStyle.brandPrimary}}>
                        <Left flex02>
                            <Button backButtom onPress={() => {
                navigation.dispatch(backAction)
              }}>
                                <Icon name={leftIcon} style={subHeaderStyles.subHeader.backIcon}
                                />
                            </Button>
                        </Left>
                        <Body>
                        <Text white heavy sizeNormal uppercase>{title}</Text>
                        </Body>

                        <Right flex02>
                            {!noMenu ?
                                <TouchableOpacity onPress={() => this.setState({ menuOpen: !this.state.menuOpen })}>
                                    {this.state.menuOpen ?
                                        <Icon name="ios-create" style={subHeaderStyles.subHeader.backIcon}/> :
                                        <Icon name="ios-create-outline" style={subHeaderStyles.subHeader.backIcon}/>
                                    }
                                </TouchableOpacity>
                                : null
                            }
                        </Right>
                    </Row>
                    :
                    <Row
                        style={{ ...subHeaderStyles.subHeader.self, ...sharedStyles.padding('horizontal'), backgroundColor: platformStyle.brandPrimary }}>
                        <Left>
                            <Text white heavy sizeNormal uppercase>{title}</Text>
                        </Left>
                        <Right flex02>
                            {!noMenu ?
                                <Button menuSubHeader
                                        style={{ height: undefined, backgroundColor: platformStyle.brandPrimary }}
                                        onPress={() => this.setState({ menuOpen: !this.state.menuOpen })}>
                                    {this.state.menuOpen ?
                                        <Icon name="ios-more-outline"
                                              style={subHeaderStyles.subHeader.menuIconSelected}/> :
                                        <Icon name="ios-more" style={subHeaderStyles.subHeader.menuIconSelected}/>
                                    }
                                </Button> : null
                            }
                        </Right>
                    </Row>
                }

                {this.state.menuOpen ?
                    <View style={{...styles.menu.self, backgroundColor: platformStyle.brandPrimary}}>
                        <TouchableOpacity style={styles.menu.item}
                                          onPress={() => navigation.navigate('LinkContractScreen', {onLinkContract: this.props.onLinkContract.bind(this)})}>
                            <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                                <IconFontello name="marker" size={18} style={{ color: platformStyle.brandPrimary }}/>
                            </View>
                            <Text white sizeNormal> {I18n.t('LINK_CONTRACT')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menu.item}
                                          onPress={() => this.props.unlinkContractConfirmation()}>
                            <View roundedCircleSmall style={{backgroundColor: platformStyle.brandYellow}}>
                                <IconFontello name="outages" size={15} style={{ color: platformStyle.brandPrimary }}/>
                            </View>
                            <Text white sizeNormal> {I18n.t('UNLINK_CONTRACT')}</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                }

            </View>
        );


    }
}

function bindAction(dispatch) {
    return {};
}

const mapStateToProps = state => {
    return {
        reloadContractSubMenu: state.generalReducer.reloadContractSubMenu
    }
};

export default connect(mapStateToProps, bindAction)(ContractSubMenu);
