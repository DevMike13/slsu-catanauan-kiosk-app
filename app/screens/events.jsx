import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const Events = () => {
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
                <Text style={styles.headerText}>UNIVERSITY EVENTS</Text>
                <Image 
                    source={images.mainLogo}
                    style={styles.imageLogo}
                    resizeMode='contain'
                />
            </View>
            <ScrollView 
                style={styles.scrollArea} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                
            </ScrollView>
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

export default Events

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

    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 100,
        paddingBottom: 20,
        gap: 20
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