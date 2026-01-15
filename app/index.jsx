import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { images } from '../constants';

const { width, height } = Dimensions.get('window');

const Index = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={images.newBG}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Image 
              source={images.mainLogo}
              style={styles.imageLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>SOUTHERN LUZON STATE UNIVERSITY</Text>
            {/* <Image 
              source={images.mainLogo}
              style={styles.imageLogo}
              resizeMode="contain"
            /> */}
          </View>

          {/* MAIN CONTENT */}
          <View style={styles.contentWrapper}>
            <Text style={styles.welcomeText}>WELCOME TO</Text>
            <Text style={styles.welcomeTextBottom}>SLSU CATANAUAN</Text>

            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/jumps/SelectionScreen')}
            >
              <LinearGradient
                colors={['#0000006f', '#fffffff1']} 
                locations={[0, 0.15]}
                start={{ x: 0, y: 1.2 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>START</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Index;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    // backgroundColor: '#ffffff4c',
    paddingHorizontal: width * 0.05,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: width * 0.0,
    paddingVertical: height * 0.02,
  },
  // headerText: {
  //   fontFamily: 'BaraBara',
  //   fontSize: width * 0.035,
  //   color: '#284615',
  //   textShadowColor: '#3b6620',   
  //   textShadowOffset: { width: 0, height: 0 },
  //   textShadowRadius: 16,
  // },

  headerText: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 38,
    color: '#284615',
  },

  imageLogo: {
    width: width * 0.10,
    height: undefined,
    aspectRatio: 1,
  },

  contentWrapper: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },

  // welcomeText: {
  //   fontFamily: 'Arial-Bold-1',
  //   fontSize: width * 0.046,
  //   textAlign: 'center',
  //   color: '#284615',
  //   paddingHorizontal: width * 0.05,
  // },

  welcomeText: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 60,
    textAlign: 'center',
    color: '#284615',
    
  },
  welcomeTextBottom: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 60,
    textAlign: 'center',
    color: '#284615',
    marginTop: -10,
  },

  buttonWrapper: {
    borderRadius: 50,
    width: width * 0.3,
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: height * 0.08,
  },
  button: {
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.06,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#284615',
    fontFamily: 'Arial-Bold-1',
    fontSize: 38,
  },
});
