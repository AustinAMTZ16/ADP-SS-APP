import { Platform, Dimensions } from "react-native";

import {variable} from "../";

const deviceHeight = Dimensions.get("window").height;
export default (variables = variable) => {
	let theme = {
    flex: 1,
    height: Platform.OS === "ios" ? deviceHeight : deviceHeight - 20,
    backgroundColor: 'white'
  };

  return theme;
};
