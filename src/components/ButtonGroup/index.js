import React, {Component} from 'react';
import { View, TouchableOpacity  } from 'react-native';
import { Text } from "native-base";


export default class ButtonGroup extends Component {
	
	
	constructor( props ) {
		super(props);
		
	}
	
	onPressFunction(index, button){

		let { onPress } = this.props;
				
		if(onPress){
			onPress(index, button);
		}
	}

	renderButtons(){
		let myButtons = [];
		let { buttons, selectedIndex } = this.props;
		
		for(var i=0; i<buttons.length; i++){
		
			let color = "transparent";
			if(selectedIndex == i){
				color = "#E6E3E2";
			}
			
			myButtons.push(
				<TouchableOpacity 
					style={{flex: 1, padding: 5, backgroundColor: color, alignItems: 'center'}} 
					onPress={this.onPressFunction.bind(this, i, buttons[i])} 
					key={i}>
						<Text style={{fontSize: 16, fontWeight: 'bold'}}>{buttons[i]}</Text>
				</TouchableOpacity>
			)
		}
		return myButtons;
	}
	
	render(){
		return (
			<View style={{flex: 1, flexDirection: "row", padding: 5}}>
				{ this.renderButtons() }
			</View>
		);
	}
}