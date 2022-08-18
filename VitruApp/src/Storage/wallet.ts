import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_ADDRESS = "WALLET_ADDRESS";

export async function getWalletAddressFromLocalStorage() : Promise<string|null> {
  return "0xfae46f94ee7b2acb497cecaff6cff17f621c693d";  
    
  try {
      const value = await AsyncStorage.getItem(WALLET_ADDRESS)
      if(value !== null) {
        return value;
      }
    } catch(e) {
      console.log("error fetching wallet address");
    }

    return null;
  };
  

export async function saveWalletAddressOnLocalStorage(address : string) {
    try {
        await AsyncStorage.setItem(WALLET_ADDRESS, address)
    } catch (e) {
        console.log("error persisting wallet address");
    }
};
