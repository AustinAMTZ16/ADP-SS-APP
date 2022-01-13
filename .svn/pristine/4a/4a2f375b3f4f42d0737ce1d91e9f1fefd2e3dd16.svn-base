import React, {Component} from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { View, Text } from "native-base";
import { Svg } from "react-native-svg";
import {
	  VictoryChart,
	  VictoryBar,
	  VictoryAxis
} from 'victory-native';




export default class ScrollChart extends Component {
		
	constructor( props ) {
		super(props);
		
		this.state = { chartHeight: 300, resized: false };
	}
	

	getMinMax(data){
		let min = 0, max = 0;
		for(var i=0; i< data.length;i++){
			if(data[i].y < min)min = data[i].y;
			if(data[i].y > max)max = data[i].y;
		}
		return {min, max};
	}
	
	onRenderView(event){
		var { height } = event.nativeEvent.layout;
		if(!this.state.resized){
			this.setState({chartHeight: height, resized: true});
		}
	}
	
	onPressIn(event, data){
		const {onPress} = this.props;

		if(onPress){
			onPress(event, data);
		}
	}
	
	render(){

		const {data} = this.props;
		let width = data.length * 50;
		let minMax = this.getMinMax(data);

		return (
			
			<SafeAreaView style={{flex: 1, flexDirection: "row", backgroundColor: 'transparent'}} onLayout={this.onRenderView.bind(this)}>
		        
				{
					this.state.resized && data.length ?
							<View style={{ flex: 1, flexDirection: "row" }}>
					        	<View style={{ width: 50 }}>
				            		<VictoryAxis style={{parent:{backgroundColor: "transparent"}}} 
				            			minDomain={{ y: minMax.min }} 
				            			maxDomain={{ y: minMax.max }} 
				            			height={this.state.chartHeight} 
				            			dependentAxis />
					        	</View>
					        	
						        <ScrollView horizontal={true} style={{ flex: 1 }} ref={(c) => this.scrollview_ref = c}
						        onContentSizeChange={(event)=>{
						        	if(this.props.scrollToEnd){
						        		this.scrollview_ref.scrollToEnd({animated: false});
						        	}
						        }}>
						        
							        <Svg width={width} height={this.state.chartHeight} style={{ width: "100%", height: "auto" }}>
								        <VictoryChart 
								        	standalone={false} 
								        	width={width} 
								        	height={this.state.chartHeight} 
								        	padding={{top: 50, bottom: 50, left: 20, right: 25}}>
										        <VictoryBar
										          
										          style={{ labels: { fontSize: 20 }}}
										          data={data}
										          events={[
										            {
										              target: "data",
										              eventHandlers: {
										                 onPressIn: this.onPressIn.bind(this)
										              }
										            }
										          ]}
										        />
								        		<VictoryAxis  />
								        </VictoryChart>
							        </Svg>
						        
						        </ScrollView>
							</View>
					: null
				}
	        </SafeAreaView>
		);
	}
	
}