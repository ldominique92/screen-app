import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_ID = "SCREEN_ID";

export async function getScreenIDFromLocalStorage() : Promise<string|undefined> {
  try {
      const value = await AsyncStorage.getItem(SCREEN_ID)
      if(value !== null) {
        return value;
      }
    } catch(e) {
      console.log("error fetching screen ID");
    }

    return undefined;
  };
  

export async function registerScreenOnLocalStorage(screenID : string) {
    try {
        await AsyncStorage.setItem(SCREEN_ID, screenID)
    } catch (e) {
        console.log("error persisting screen ID");
    }
};

export async function deleteScreenFromLocalStorage() {
  try {
      await AsyncStorage.removeItem(SCREEN_ID);
  } catch (e) {
      console.log("error deleting screen ID");
  }
};