import {variable} from "../";

export default (variables = variable) => {
	let h1Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH1,
    lineHeight: variables.lineHeightH1
  };

  return h1Theme;
};
