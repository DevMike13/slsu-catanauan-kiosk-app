import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const { width } = Dimensions.get('window');

const About = () => {
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
                    <Text style={styles.contentTitleText}>VISION</Text>
                    <Text style={styles.contentText}>
                        An inclusive glocal university by 2040, shaping holistic individuals responsive to a sustainable future.
                    </Text>

                    <Text style={styles.contentTitleText}>MISSION</Text>
                    <Text style={styles.contentText}>
                        SLSU is committed to providing global standard and locally responsive education; generating gender-inclusive and sustainable research, extension and innovation programs.
                    </Text>
                    <Text style={styles.contentTitleText}>CORE VALUES</Text>
                    <View style={styles.hightlightContainer}>
                        <Text style={styles.contentTextWithHighlight}><Text style={styles.contentHighlightText}>GO</Text> - God Loving </Text>
                        <Text style={styles.contentTextWithHighlight}><Text style={styles.contentHighlightText}>S</Text> - Service-oriented</Text>
                        <Text style={styles.contentTextWithHighlight}><Text style={styles.contentHighlightText}>L</Text> - Leadership by example,</Text>
                        <Text style={styles.contentTextWithHighlight}><Text style={styles.contentHighlightText}>S</Text> - Sustained passion for excellencec</Text>
                        <Text style={styles.contentTextWithHighlight}><Text style={styles.contentHighlightText}>U</Text> - Undiminished Commitment to Peace and Environmental Advocacy</Text>
                    </View>
                </ScrollView>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

export default About

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

    contentTitleText:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    contentText:{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: 'white',
        textAlign: 'center'
    },
    contentHighlightText:{
        fontFamily: 'Poppins-Black',
        color: 'white'
    },
    contentTextWithHighlight:{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: 'white',
        textAlign: 'left'
    },
    hightlightContainer: {
        width: '60%',
        marginVertical: 'auto'
    }
    
  });