import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { images } from '../../constants';

const { width, height } = Dimensions.get('window');

const Orgchart = () => {
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
            bounces={false}
          >
            <View style={styles.imageWrapper}>
              <Image 
                source={images.orgChart}
                style={styles.image}
                resizeMode='contain'
              />
            </View>
          </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Orgchart

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
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 50
    },
    imageWrapper: {
      marginTop: -50,
      width: width - 100, // full screen width
      paddingHorizontal: 50,
      aspectRatio: 1080 / 1623,
    },
    image: {
      width: '100%',
      height: '100%',
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