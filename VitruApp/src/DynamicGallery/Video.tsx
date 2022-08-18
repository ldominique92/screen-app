import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Image } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { ControlBar, Landscape } from '../globalStyles.js';
import { backButton, play, pause } from './images';

// TODO: https://docs.expo.dev/versions/latest/sdk/video/#islooping

interface VideoItem {
  backFunction: Function,
  videoURL: string | undefined,
}

const VideoArtWork = ({ videoURL, backFunction } : VideoItem) => {        
    const video = useRef(null);
    const [status, setStatus] = useState<AVPlaybackStatus | undefined>();
    const [showBar, setShowBar] = useState<boolean>(true);

    useEffect(() => {
      setTimeout(() => {
        setShowBar(false);
      }, 10000);
    }, [showBar]);

    return (
      <TouchableWithoutFeedback onPress={() => setShowBar(!showBar)}>
          <View style={styles.container}>
            <Video
                ref={video}
                style={ Landscape ? {
                  alignSelf: 'center',
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                } : {
                  alignSelf: 'center',
                  width: Dimensions.get('window').width,
                }}
                source={{ uri: videoURL }}
                resizeMode="contain"
                isLooping
                shouldPlay
                onPlaybackStatusUpdate={status => setStatus(() => status)}
                volume={1.0}
            />
            { showBar && (
              <View style={ControlBar.bar} >
                <TouchableHighlight onPress={() => backFunction()}>
                  <Image source={backButton} style={ControlBar.button}></Image>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => status?.isPlaying ? video.current.pauseAsync() : video.current.playAsync()}>
                  <Image source={status?.isPlaying ? pause : play} style={ControlBar.playPauseButton}></Image>
                </TouchableHighlight>
              </View>)
            }
          </View>
        </TouchableWithoutFeedback>
    );
};

export default VideoArtWork;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#000000',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  