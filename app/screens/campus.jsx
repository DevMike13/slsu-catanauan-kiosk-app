import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const { width } = Dimensions.get('window');

const Campus = () => {
  return (
    <ImageBackground
        // source={images.background}
        style={styles.background}
        resizeMode="cover"
    >
        
        <SafeAreaView style={styles.container}>
            <View style={styles.bodyContainer}>
                <View style={styles.contentContainer}>
                    <Image 
                        source={images.placeholderImage}
                        style={styles.contentImage}
                        resizeMode='contain'
                    />
                </View>
            </View>
        </SafeAreaView>
    </ImageBackground>
  )
}

export default Campus

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    container: {
      flex: 1,
    //   backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 20,
    },
  
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.01,
        paddingVertical: 8
    },
    imageLogo: {
        width: 80,
        height: 80
    },
    headerText: {
        fontFamily: 'Poppins-Bold',
        fontSize: width * 0.05,
        marginBottom: -10
    },

    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
});