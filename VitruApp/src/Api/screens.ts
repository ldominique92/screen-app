import Constants from 'expo-constants';
import axios from 'axios';

const addScreensEndpoint = Constants.manifest?.extra?.api?.screen?.add;
const authKey = Constants.manifest?.extra?.api?.authKey;

export async function registerScreenOnApi(pushNotificationToken: string): Promise<string | undefined> {
    var screenID = undefined;
    var requestBody = JSON.stringify({ "push_notification_token": pushNotificationToken });

    var config = {
        headers: { 'Authorization': `Bearer ${authKey}`, 'Content-Type': 'application/json' }
    };

    await axios.post(addScreensEndpoint, requestBody, config)
        .then(({ data, status }) => {
            if (status == 200) {
                screenID = data.id;
            }
        });

    return screenID;
};