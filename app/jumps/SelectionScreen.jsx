import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const SelectionScreen = () => {
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
          <Text style={styles.headerText}></Text>
          <Image 
            source={images.mainLogo}
            style={styles.imageLogo}
            resizeMode='contain'
          />
        </View>
        <View>
          <Text style={styles.headerText}>WELCOME TO SLSU CATANAUAN!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={() => router.push('/jumps/AdminSelectionScreen')}
            >
                <LinearGradient
                    colors={['#07a751', '#8DC63F']}
                    start={{ x: 0, y: 0 }}
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
                    colors={['#07a751', '#8DC63F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                <Text style={styles.buttonText}>Student</Text>
                </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: '#ffffff4c',
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
    width: 140,
    height: 140
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 60,
    textAlign: 'center',
    width: '60%',
    marginHorizontal: 'auto'
  },
  buttonContainer:{
    marginTop: 50
  },
  buttonWrapper: {
    borderRadius: 50,
    width: '30%',
    marginHorizontal: 'auto',
    overflow: 'hidden'
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  },
});
