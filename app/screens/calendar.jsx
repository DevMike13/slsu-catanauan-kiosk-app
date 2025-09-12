import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
import { images } from '../../constants';

const Calendar = () => {
  const router = useRouter();

  return (
    <ImageBackground
      // source={images.background}
      style={styles.background}
      resizeMode="cover"
    >
        
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Image 
              source={images.calendarOne}
              style={[styles.image, { marginBottom: 30 }]}
              resizeMode="contain"
            />
            <Image 
              source={images.calendarTwo}
              style={styles.image}
              resizeMode="contain"
            />
          </ScrollView>
        </SafeAreaView>
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
      // backgroundColor: 'rgba(0,0,0,0.3)',
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
      fontSize: width * 0.06,
      marginBottom: -20
    },

    scrollArea: {
      flex: 1,
    },
    scrollContent: {
      alignItems: 'center',
      paddingVertical: 20,
      gap: 30,
    },
    
    image: {
      width: width - 40,     // full width minus horizontal padding
      aspectRatio: 1.4,      // adjust this based on your image shape
      height: undefined,
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