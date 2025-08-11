import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const About = () => {
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
                <Text style={styles.headerText}>ABOUT US</Text>
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
                <Text style={styles.contentTitleText}>VISION</Text>
                <Text style={styles.contentText}>
                    An inclusive glocal university by 2040, shaping holistic individuals responsive to a sustainable future.
                </Text>

                <Text style={styles.contentTitleText}>MISSION</Text>
                <Text style={styles.contentText}>
                    SLSU is committed to providing global standard and locally responsive education; generating gender-inclusive and sustainable research, extension and innovation programs.
                </Text>
                <Text style={styles.contentTitleText}>CORE VALUES</Text>
                <Text style={styles.contentText}><Text style={styles.contentHighlightText}>GO</Text>d Loving </Text>
                <Text style={styles.contentText}><Text style={styles.contentHighlightText}>S</Text>ervice-oriented</Text>
                <Text style={styles.contentText}><Text style={styles.contentHighlightText}>L</Text>eadership by example,</Text>
                <Text style={styles.contentText}><Text style={styles.contentHighlightText}>S</Text>ustained passion for excellencec</Text>
                <Text style={styles.contentText}><Text style={styles.contentHighlightText}>U</Text>ndiminished Commitment to Peace and Environmental Advocacy</Text>
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
    contentTitleText:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 28,
        textAlign: 'center'
    },
    contentText:{
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    contentHighlightText:{
        fontFamily: 'Poppins-Black',
        color: 'black'
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