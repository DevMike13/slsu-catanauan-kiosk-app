import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { images } from '../../constants';

const { width, height } = Dimensions.get('window');

const AdminSelectionScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={images.background}
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
              resizeMode='contain'
            />
            <Text style={styles.headerText}></Text>
            <Image 
              source={images.mainLogo}
              style={styles.imageLogo}
              resizeMode='contain'
            />
          </View>

          {/* CONTENT */}
          <View style={styles.contentWrapper}>
            <Text style={styles.welcomeText}>WELCOME TO SLSU CATANAUAN!</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={() => router.push('/auth/register')}
              >
                <LinearGradient
                  colors={['#07a751', '#8DC63F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={() => router.push('/auth/login')}
              >
                <LinearGradient
                  colors={['#07a751', '#8DC63F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default AdminSelectionScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff4c',
    paddingHorizontal: width * 0.08,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.02,
  },
  imageLogo: {
    width: width * 0.12,
    height: undefined,
    aspectRatio: 1,
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.06,
    textAlign: 'center',
    flexShrink: 1,
    paddingHorizontal: width * 0.02,
  },
  contentWrapper: {
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.05,
    textAlign: 'center',
    paddingHorizontal: width * 0.05,
  },
  buttonContainer: {
    marginTop: height * 0.02,
    alignItems: 'center',
    width: '100%',
  },
  buttonWrapper: {
    borderRadius: 10,
    width: width * 0.3,
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: height * 0.04,
  },
  button: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.02,
  },
});
