import React, { Component } from "react";
import { Alert,BackHandler } from 'react-native';
import {Text,View,Left, Body, Row, Button} from "native-base";
import IconFontello from '../../components/IconFontello/';
import {platformStyle} from "../../theme";
import sharedStyles from '../../shared/styles';
import styles from "./styles";
import DocumentPicker from 'react-native-document-picker';
import repo from '../../services/database/repository';

export default class DocPicker extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            fileArray: []
        };
    }

    componentWillMount() {
        this.setState({
            fileArray: this.props.fileArray            
        });
    }

    componentWillReceiveProps( nextProps ) {
        if( this.props.entitiyType !== nextProps.entitiyType) {
            this.loadData(nextProps.entitiyType);
        }
    }

    componentDidMount(){
        this.loadData();
    }

    loadData(entityTypeParam,freeEntityParam){
        //console.log("DocPicker - loadData: " + entityTypeParam);
        //OPTION 1: Get List of documents from ENTITY TYPE
        let entityType = entityTypeParam?entityTypeParam:this.props.entitiyType;
        let freeEntity = freeEntityParam?freeEntityParam:this.props.freeEntity;
        let list = this.state.fileArray;
        list.splice(0, list.length);
        if(entityType){
            let mandatoryList = JSON.parse(repo.configuration.getField('documMandatoryList'));
            mandatoryList.map((item,idx)=>{
                if(item.entityType==entityType){
                    item.key=idx;
                    list.push(item);
                }
            });    
        }else if(freeEntity && freeEntity.length){
            this.props.freeEntity.map((item,idx)=>{
                    item.key=idx;
                    list.push(item);
            });
        }else{
            console.error("Development error: It should have entityType or freeEntity");
        }
        
        this.setState({fileArray: list});
    }

    /* Types:allFiles audio csv doc docx images pdf plainText ppt pptx video xls xlsx zip */
    pickDocument = async (file) => {
        let fileType = DocumentPicker.types.allFiles;
        if(file.fileType=="IMG"){
            fileType = DocumentPicker.types.images;
        }

        // Pick multiple files
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [fileType],
            });
            // for (const res of results) {
                // console.log(
                //     res.uri,
                //     res.type, // mime type
                //     res.name,
                //     res.size
                // );
            // }
            let list = this.state.fileArray;
            for(let i=0;i<list.length;i++){
                if(file.codDocum==list[i].codDocum){
                    list[i].attached=results;
                    break;
                }
            }
            this.setState({fileArray: list});
            // if(this.props.onDocsPicked){
            //     this.props.onDocsPicked(res);
            // }            
        } catch (err) {
            if (DocumentPicker.isCancel(err)){
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                Alert.alert("Error DocPicker",JSON.stringify(err));
            }
        }
    }   

    render() {
         return this.state.fileArray.map(file => {
                let nameType = file.nameType;
                return (
                    <Row style={{...sharedStyles.margin('top')}} key={file.key}>
                        <Left>
                            <View>
                                <Text sizeNormal>{nameType}</Text>
                            </View>
                        </Left>
                        <Body>
                        <Button roundedCircleSmall
                                style={{ ...sharedStyles.alignSelf('end'), ...sharedStyles.margin('left', 2), backgroundColor: (file.attached?'green':'#0000CD') }}
                                onPress={() => {
                                this.pickDocument(file);
                                // if(this.props.pickDocument) {
                                //     this.props.pickDocument(file);
                                // }
                            }}>
                            <IconFontello name={'search'} size={24}
                                          style={{ color: platformStyle.brandWhite}}/>
                        </Button>
                        </Body>
                    </Row>
                )
            })
    }
}