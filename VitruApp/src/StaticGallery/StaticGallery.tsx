import { Image, Dimensions, StyleSheet, TouchableWithoutFeedback, View, TouchableHighlight } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import {ControlBar} from '../globalStyles.js';
import React, { useState, useEffect } from 'react';
import { backButton } from '../DynamicGallery/images';

interface MediaItem {
    value: string
}

interface StaticGalleryProps {
  media : string[],
  backFunction : Function
}

const { width, height } = Dimensions.get('window');

const StaticGallery = ({ media, backFunction } : StaticGalleryProps ) => {
  const [showBar, setShowBar] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setShowBar(false);
    }, 10000);
  }, [showBar]);
  
  return (
    <TouchableWithoutFeedback onPress={() => setShowBar(!showBar)}>
      <View style={styleGalleryStyles.container}>
        <SwiperFlatList
          autoplay
          autoplayDelay={15}
          autoplayLoop
          index={0}
          data={ media }
          renderItem={({ item }) => <Image style={styleGalleryStyles.image} source={{ uri: item }} resizeMode={'contain'} />}
        />
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
}

const styleGalleryStyles = StyleSheet.create({
  text: { fontSize: width * 0.5, textAlign: 'center' },
  image: {
    height: height,
    width: width,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});

export default StaticGallery;