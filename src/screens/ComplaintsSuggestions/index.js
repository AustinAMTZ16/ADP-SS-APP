import React from 'react';
import {StackNavigator} from 'react-navigation'

import ComplaintsSuggestionsList from "./List";
import NewSuggestion from "./NewSuggestion";
import NewComplaint from "./NewComplaint";
import Accounts from "./Accounts";

export default StackNavigator(
  {
    ComplaintsSuggestionsList: { screen: ComplaintsSuggestionsList },
    NewSuggestion: { screen: NewSuggestion },
    NewComplaint: { screen: NewComplaint },
    Accounts: { screen: Accounts },
  },
  {
    index: 0,
    initialRouteName: 'ComplaintsSuggestionsList',
    headerMode: "none",
    mode: 'card'
  }
);
