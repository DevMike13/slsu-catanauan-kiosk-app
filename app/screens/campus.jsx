import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';


import { images } from '../../constants';

const { width } = Dimensions.get('window');

const Campus = () => {
    const [location] = useState({
        latitude:  13.567799,
        longitude: 122.342373, 
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
      

  return (
    <ImageBackground
        // source={images.background}
        style={styles.background}
        resizeMode="cover"
    >
        
        <SafeAreaView style={styles.container}>
            <View style={styles.bodyContainer}>
                <View style={styles.contentContainer}>
                    {/* <Image 
                        source={images.placeholderImage}
                        style={styles.contentImage}
                        resizeMode='contain'
                    /> */}
                    <View style={styles.contentContainer}>
                        <MapView
                            style={styles.map}
                            // initialRegion={location}
                            region={location}
                            provider={PROVIDER_GOOGLE}
                            mapType="satellite"
                        >
                            <Marker
                                coordinate={location}
                                title="SLSU Catanauan"
                                description="This is the campus location"
                            />
                        </MapView>
                    </View>
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
    contentContainer: {
        flex: 1,           // <---- add this
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        width: '70%',
        height: '90%',     // <---- was '80%' before
        borderRadius: 15,
    },
});