import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { ControlBar } from '../globalStyles.js';
import { backButton } from './images';

interface MediaItem {
  backFunction: Function,
  imageURL: string | undefined,
}

const ImageArtwork = ({ imageURL, backFunction } : MediaItem) => {        
  const [showBar, setShowBar] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setShowBar(false);
    }, 10000);
  }, [showBar]);
  
  return (
      <TouchableWithoutFeedback onPress={() => setShowBar(!showBar)}>
          <View style={styles.container}>
            <Image source={{ uri: imageURL }} style={ styles.artwork } resizeMode={'contain'} />
            { showBar && (
              <View style={ControlBar.bar} >
                <TouchableHighlight onPress={() => backFunction()}>
                  <Image source={backButton} style={ControlBar.button}></Image>
                </TouchableHighlight>
              </View>)
            }
          </View>
      </TouchableWithoutFeedback>
    );
};

export default ImageArtwork;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#000000',
    },
    artwork: {
      flex: 1,
      alignSelf: 'stretch',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }
  });
  // TODO: autohide control bars
  