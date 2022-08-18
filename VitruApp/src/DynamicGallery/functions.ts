import { registerScreenOnApi } from '../Api/screens';
import { registerScreenOnLocalStorage, getScreenIDFromLocalStorage, deleteScreenFromLocalStorage } from '../Storage/screen';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import axios, { AxiosPromise } from 'axios';

interface TokenRequestResponse {
  sessionToken: string,
  success: boolean,
  errorCode: number
}

export const requestAuthToken = async (screenID: string): Promise<TokenRequestResponse> => {
    var requestTokenResponse = await tryToRequestToken(screenID);

    if (requestTokenResponse.errorCode == 404) {

      // Screen was deleted from DB for some reason
      deleteScreenFromLocalStorage();
      var _screenID = await ensureScreenRegistered();

      if (_screenID) {
        // try to get token again
        requestTokenResponse = await tryToRequestToken(_screenID);
      } else {
        return {
          sessionToken: "",
          success: false,
          errorCode: 500
        }
      }

      
    }

    return requestTokenResponse;
}

async function tryToRequestToken(screenID: string): Promise<TokenRequestResponse> {
  const requestAuthTokenEndpoint = `${Constants.manifest?.extra?.api?.screen?.requestSessionToken}?screen_id=${screenID}`;
  const authKey = Constants.manifest?.extra?.api?.authKey;

  var config = {
    method: 'get',
    url: requestAuthTokenEndpoint,
    headers: { 'Authorization': `Bearer ${authKey}` },
    validateStatus: function (status : number) {
      return status == 201 || status == 404; // Resolve only if the status code is less than 500
    }
  };
  
  try {
  
    const { data, status } = await axios(config);
    
    if (status == 201) {
      return {
        sessionToken: data.session_token,
        success: true,
        errorCode: 201
      }
    }

    return {
      sessionToken: "",
      success: false,
      errorCode: status
    }

  } catch (e) {
    return {
      sessionToken: "",
      success: false,
      errorCode: 500,
    }
  }  
}


export const ensureScreenRegistered = async (): Promise<string|undefined> => {
  var _screenID = await getScreenIDFromLocalStorage();

  if (_screenID == undefined || _screenID == null) {
    var pushNotificationToken = await registerForPushNotificationsAsync();

    if (pushNotificationToken) {
      _screenID = await registerScreenOnApi(pushNotificationToken);

      if (_screenID) {
        await registerScreenOnLocalStorage(_screenID);
      }
    }
  }

  return _screenID;
}

const registerForPushNotificationsAsync = async (): Promise<string|undefined> => {
  let token = "IS_NOT_DEVICE";

  if (Device.isDevice && Platform.OS != 'web') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return undefined;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("using test token for register on web");
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}