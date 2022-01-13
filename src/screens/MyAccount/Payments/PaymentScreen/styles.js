import {platformStyle} from "../../../../theme";
import sharedStyles from '../../../../shared/styles';

export default {
  listItemRow: {
    self: {
      height: 'auto'
    },
    left: {
    	...sharedStyles.alignItems( 'start' ),
        ...sharedStyles.alignSelf( 'left' ),
        marginLeft: 5
    },
    right: {
        ...sharedStyles.alignItems( 'end' ),
        ...sharedStyles.alignSelf( 'right' ),
    }
  },
  
  footer:{
	  padding: 10, 
	  height: 80
  },
  
  flexDirection: {
	  flexDirection: 'row'
  },
  
  row: {
	  marginBottom: 10,
	  height: 30
  }
  

  
};
