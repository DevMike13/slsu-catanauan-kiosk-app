import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const Calendar = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={images.background}
      style={styles.background}
      resizeMode="cover"
    >
        
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Image 
                    source={images.mainLogo}
                    style={styles.imageLogo}
                    resizeMode='contain'
                />
                <Text style={styles.headerText}>SLSU CALENDAR</Text>
                <Image 
                    source={images.mainLogo}
                    style={styles.imageLogo}
                    resizeMode='contain'
                />
            </View>
        </SafeAreaView>
        <TouchableOpacity 
            style={styles.navButtonContainer}
            onPress={() => router.back()}
        >
            <Image 
                source={images.backIcon}
                style={styles.navButtonImage}
                resizeMode='contain'
            />
        </TouchableOpacity>
    </ImageBackground>
  )
}

export default Calendar

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 20,
    },
  
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 50,
      paddingVertical: 8
    },
    imageLogo: {
      width: 80,
      height: 80
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 70,
      marginBottom: -12
    },

    navButtonContainer:{
        position: 'absolute',
        bottom: 10,
        left: 10
    },
    navButtonImage: {
        width: 50,
        height: 50
    }
});