import repo from '../database/repository'
import { Alert } from 'react-native';
import RNFirebase from 'react-native-firebase'
//import type { RemoteMessage } from 'react-native-firebase';
import syncService from '../general/syncService';
import { Platform } from "react-native";
import Config from 'react-native-config'
import waterfall from 'async/waterfall';
//import type { Notification } from 'react-native-firebase';
//import PushNotification from 'react-native-push-notification';

const firebaseStarted = RNFirebase.initializeApp({});
import firebase from "react-native-firebase";



const firebaseService = {

  /**
   *
   */
  loadApp() {
    this.startMessaging();
    this.startAnalytics();
    // this.startCrash();

  },

  /**
   *
   */
  startMessaging() {
    firebaseStarted.messaging().getToken()
      .then(fcmToken => {
        if( fcmToken ) {
          //console.log('getToken-res', JSON.stringify(fcmToken));
          console.log('Firebase - token: ' + fcmToken);
          repo.configuration.setField('notificationsToken', fcmToken);
        } else {
          // user doesn't have a device token yet
          console.log('getToken-res: user doesnt have a device token yet');
        }
      });

    firebaseStarted.messaging().hasPermission()
      .then(enabled => {
        if( enabled ) {
          // user has permissions
          console.log('Firebase - User has authorised');
        } else {
          //console.log('hasPermission-res', false);
          firebaseStarted.messaging().requestPermission()
            .then(() => {
              // User has authorised
              console.log('Firebase - User has authorised');
            })
            .catch(error => {
              // User has rejected permissions
              console.log('Firebase - User rejected permissions');
            });
        }
      });
  },
  /**
   *
   */
  onTokenRefreshListener() {
    return firebaseStarted.messaging().onTokenRefresh(fcmToken => {
      // Process your token as required
      console.log('Firebase -  getToken-resfresh', JSON.stringify(fcmToken))
    });
  },

  /**
   *
   */
  onRemoteMessage() {
    return firebaseStarted.messaging().onMessage(( message: RemoteMessage ) => {
      // Process your message as required
      //console.log('Firebase - onRemoteMessage-resfresh', RemoteMessage)
      console.log('Firebase - onRemoteMessage-resfresh');
    });
  },

  /**
   *
   */
  onNotificationDisplayed() {
    return firebaseStarted.notifications().onNotificationDisplayed(( notification: Notification ) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      console.log('Firebase - onNotificationDisplayed', notification)


    });
  },

  /**
   * It was very difficult to show local notification when app status is foreground
   * Important link to solve problem:
   * https://github.com/invertase/react-native-firebase/issues/988
   */
  onNotification(notificationAction) {
    return firebaseStarted.notifications().onNotification(( notification: Notification ) => {
      // Process your notification as required
      //console.log('Firebase - onNotification', notification);

      const channel = new firebase.notifications.Android.Channel(
          'channelId2',
          'Channel Name',
          firebase.notifications.Android.Importance.High
      ).setDescription('A natural description of the channel');
      firebase.notifications().android.createChannel(channel);

      const localNotification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('channelId2') // e.g. the id you chose above
          .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error("errr: " + JSON.stringify(err)));

      notificationAction();
    });
  },

  displayNotification() {
    console.log('Firebase - displayNotification');
    console.log('Firebase - displayNotification: ' + JSON.stringify(this));
  },

  /**
   *
   */
  startAnalytics() {
    firebaseStarted.analytics().setAnalyticsCollectionEnabled(true);
  },

  /**
   *
   */
  startCrash() {
    firebaseStarted.crash().setCrashCollectionEnabled(true);
    firebaseStarted.crash().log('APP-componentDidMount');
  },




  /**
   *
   */
  supervisorAnalytic( view ) {

    switch( view ) {
      case 'APP':
        firebaseStarted.analytics().logEvent('APP_LOAD');
        firebaseStarted.analytics().setCurrentScreen('APP_LOAD');
        break;
      case 'PUBLIC':
        firebaseStarted.analytics().logEvent('PUBLIC_ZONE');
        firebaseStarted.analytics().setCurrentScreen('PUBLIC_ZONE');
        break;
      case 'PRIVATE':
        firebaseStarted.analytics().logEvent('PRIVATE_ZONE');
        firebaseStarted.analytics().setCurrentScreen('PRIVATE_ZONE');
        break;
      case 'ABOUT':
        firebaseStarted.analytics().logEvent('ABOUT');
        firebaseStarted.analytics().setCurrentScreen('ABOUT');
        break;
      case 'SIMULATOR':
        firebaseStarted.analytics().logEvent('BILL_SIMULATOR');
        firebaseStarted.analytics().setCurrentScreen('BILL_SIMULATOR');
        break;
      case 'QUERY':
        firebaseStarted.analytics().logEvent('BILL_QUERY');
        firebaseStarted.analytics().setCurrentScreen('BILL_QUERY');
        break;
      case 'PASSWORD':
        firebaseStarted.analytics().logEvent('CHANGE_PASSWORD');
        firebaseStarted.analytics().setCurrentScreen('CHANGE_PASSWORD');
        break;
      case 'NEWCOMPLAINT':
        firebaseStarted.analytics().logEvent('NEW_COMPLAINT');
        firebaseStarted.analytics().setCurrentScreen('NEW_COMPLAINT');
        break;
      case 'NEWSUGGESTION':
        firebaseStarted.analytics().logEvent('NEW_SUGGESTION');
        firebaseStarted.analytics().setCurrentScreen('NEW_SUGGESTION');
        break;
      case 'CONTACT':
        firebaseStarted.analytics().logEvent('CONTACT');
        firebaseStarted.analytics().setCurrentScreen('CONTACT');
        break;
      case 'FORGOTPASSWORD':
        firebaseStarted.analytics().logEvent('FORGOT_PASSWORD');
        firebaseStarted.analytics().setCurrentScreen('FORGOT_PASSWORD');
        break;
      case 'CHANGEHOLDER':
        firebaseStarted.analytics().logEvent('CHANGE_HOLDER');
        firebaseStarted.analytics().setCurrentScreen('CHANGE_HOLDER');
        break;
      case 'JUAFORSURE':
        firebaseStarted.analytics().logEvent('JUA_FOR_SURE');
        firebaseStarted.analytics().setCurrentScreen('JUA_FOR_SURE');
        break;
      case 'STATEMENT':
        firebaseStarted.analytics().logEvent('STATEMENT');
        firebaseStarted.analytics().setCurrentScreen('STATEMENT');
        break;
      case 'SELFREADING':
        firebaseStarted.analytics().logEvent('SELF_READING');
        firebaseStarted.analytics().setCurrentScreen('SELF_READING');
        break;
      case 'EBILLING':
        firebaseStarted.analytics().logEvent('EBILLING');
        firebaseStarted.analytics().setCurrentScreen('EBILLING');
        break;
      case 'UNITS':
        firebaseStarted.analytics().logEvent('PRE_UNITS');
        firebaseStarted.analytics().setCurrentScreen('PRE_UNITS');
        break;
      case 'BILLGRAPH':
        firebaseStarted.analytics().logEvent('BILL_GRAPH');
        firebaseStarted.analytics().setCurrentScreen('BILL_GRAPH');
        break;
      case 'BILLLIST':
        firebaseStarted.analytics().logEvent('BILL_LIST');
        firebaseStarted.analytics().setCurrentScreen('BILL_LIST');
        break;
      case 'BILLPDF':
        firebaseStarted.analytics().logEvent('BILL_PDF');
        firebaseStarted.analytics().setCurrentScreen('BILL_PDF');
        break;
      case 'MYDATA':
        firebaseStarted.analytics().logEvent('MY_DATA');
        firebaseStarted.analytics().setCurrentScreen('MY_DATA');
        break;
      case 'NEWAPPLICATIONS':
        firebaseStarted.analytics().logEvent('NEW_APPLICATIONS');
        firebaseStarted.analytics().setCurrentScreen('NEW_APPLICATIONS');
        break;
      case 'OUTAGES':
        firebaseStarted.analytics().logEvent('OUTAGES');
        firebaseStarted.analytics().setCurrentScreen('OUTAGES');
        break;
      case 'REGISTER':
        firebaseStarted.analytics().logEvent('NEW_REGISTRATION');
        firebaseStarted.analytics().setCurrentScreen('NEW_REGISTRATION');
        break;
      case 'TIPS':
        firebaseStarted.analytics().logEvent('IMPORTANT_TIPS');
        firebaseStarted.analytics().setCurrentScreen('IMPORTANT_TIPS');
        break;
      case 'STATEMENTPDF':
        firebaseStarted.analytics().logEvent('STATEMENT_PDF');
        firebaseStarted.analytics().setCurrentScreen('STATEMENT_PDF');
        break;
      case 'CORPORATE':
        firebaseStarted.analytics().logEvent('CORPORATE');
        firebaseStarted.analytics().setCurrentScreen('CORPORATE');
        break;
    }

  },

  registerDevice(){
    let userId = repo.configuration.getField('idCustomer');
    let tokenId =repo.configuration.getField('notificationsToken');
    let activatedAlready = repo.configuration.getField('notificationsActivated');
    if(Config.ENABLE_NOTIFICATIONS==='true' && !activatedAlready){
      waterfall([
        (callback ) => {
          this.registerDeviceService(tokenId,userId, callback);
        }
      ], ( err, result ) => {
        if(err){
          console.log("Error on register device: " + err);
        }else{
          console.log("Register device OK ");
          repo.configuration.setField('notificationsActivated', true);
        }
      });
    }else{
      console.log("Trying to register but it is already registered");
    }
  },

  /**
   * Notify alert
   * @param objData
   * @param callbackFinal
   */
  registerDeviceService(tokenIn, userId, callbackFinal) {
      let endPoint = Config.ENDPOINT_PROD_CUSTOMER;
      let params = {
        token: tokenIn,
        platform: Platform.OS
      };
      endPoint = `${endPoint}${userId}` + '/registerDevice';
      syncService.easyUploadData(endPoint, params, callbackFinal);
  }
};

export default firebaseService;