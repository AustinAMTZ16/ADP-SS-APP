import { VictoryLabel } from 'victory-native';
import React, { Component } from "react";
export default class NegativeAwareTickLabel extends Component {

  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
	  const {
		    datum, // Bar's specific data object
		    y, // Calculated y data value IN SVG SPACE (from top-right corner)
		    dy, // Distance from data's y value to label's y value
		    scale, // Function that converts from data-space to svg-space
		    ...rest // Other props passed to label from Bar
	  } = this.props;
	  
	  return (
			    <VictoryLabel
			    	datum={datum} // Shove `datum` back into label. We destructured it from `props` so we'd have it available for a future step
			      	y={scale.y(0) + (Math.sign(datum.y) >= 0 ? +25:-25)} // Set y to the svg-space location of the axis
			      	dy={5 * Math.sign(datum.y)} // Change direction of offset based on the datum value
			      	{...rest} // Shove the rest of the props into the label
			    />
	  );
  }
}
