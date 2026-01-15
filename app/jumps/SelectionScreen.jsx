import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { images } from '../../constants';

const { width, height } = Dimensions.get('window');

const SelectionScreen = () => {
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
            <Text style={styles.welcomeTextBottom}>WSLSU CATANAUAN</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={() => router.push('/jumps/AdminSelectionScreen')}
              >
                <LinearGradient
                  colors={['#0000006f', '#fffffff1']} 
                  locations={[0, 0.15]}
                  start={{ x: 0, y: 1.2 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Admin</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={() => router.push('/screens/main')}
              >
                <LinearGradient
                  colors={['#0000006f', '#fffffff1']} 
                  locations={[0, 0.15]}
                  start={{ x: 0, y: 1.2 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Student</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default SelectionScreen;

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
    marginTop: height * 0.03,
  },
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
  buttonContainer: {
    marginTop: height * 0.02,
    alignItems: 'center',
    width: '100%',
  },
  buttonWrapper: {
    borderRadius: 50,
    width: width * 0.3,
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: height * 0.04,
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
