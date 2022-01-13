import Reactotron from 'reactotron-react-native'
import Config from 'react-native-config'


if (Config.DEV === "true" || 1 == 1) {
  Reactotron
    .configure({
      name: 'React Native Self Service',
      // host: '10.6.100.59'
      host: '10.0.2.2'
    })
    .useReactNative()
    .connect();
  Reactotron.clear();
  Reactotron.log('Hello Reactotron');
  console = Reactotron;
} else {
  //console.log("Development false. Reactotron is not activated " + Config.DEV);
  console = new Object();
  console.log = function () { };
  console.error = function () { };
  console.warn = function () { };
}

