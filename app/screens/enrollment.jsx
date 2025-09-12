import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
import { images } from '../../constants';

const Enrollment = () => {
    const router = useRouter();

    return (
      <ImageBackground
        // source={images.background}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
  
          <View style={styles.cardContainer}>
            {/* BACK CARD */}
            <View style={styles.backCard} />
  
            {/* FRONT ROTATED CARD */}
            <View style={styles.frontCard}>
              {/* Counter-rotated content */}
              <View style={styles.innerCard}>
                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  
                </ScrollView>
              </View>
            </View>
          </View>
  
        </SafeAreaView>
      </ImageBackground>
    );
}

export default Enrollment

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    cardContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    backCard: {
      position: 'absolute',
      width: width * 0.5,
      height: 450,
      backgroundColor: '#3dc88c',
      borderRadius: 16,
      zIndex: 0
    },
  
    frontCard: {
      width: width * 0.5,
      height: 450,
      backgroundColor: '#257b3e',
      borderRadius: 16,
      paddingHorizontal: 30,
      paddingVertical: 60,
      transform: [{ rotate: '-10deg' }],
      zIndex: 1,
      elevation: 5,
      overflow: 'hidden',
    },
    
    innerCard: {
      flex: 1,
      transform: [{ rotate: '10deg' }],  // counter-rotate
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    scrollArea: {
      flex: 1,
      width: '100%',
    },
    
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    
    contentText: {
      width: '100%',
      fontFamily: 'Poppins-Regular',
      fontSize: 15,
      color: 'white',
      textAlign: 'center',
    },
    
  });