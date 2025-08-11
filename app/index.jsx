import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';


import { images } from '../constants';

const Index = () => {
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
          <Text style={styles.headerText}>SCHOOL FEATURES</Text>
          <Image 
            source={images.mainLogo}
            style={styles.imageLogo}
            resizeMode='contain'
          />
        </View>
        <View style={styles.gridButtonContainer}>
          <View style={styles.gridItem}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/screens/history')}
            >
              <LinearGradient
                colors={['#07a751', '#8DC63F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>History of SLSU</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/screens/about')}
            >
              <LinearGradient
                colors={['#07a751', '#8DC63F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>About Us</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/screens/orgchart')}
            >
              <LinearGradient
                colors={['#07a751', '#8DC63F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Organizational Chart</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.gridItem}>
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#07a751', '#8DC63F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Program Offered</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/screens/calendar')}
            >
              <LinearGradient
                colors={['#07a751', '#8DC63F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>SLSU Calendar</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#07a751', '#8DC63F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Student Organization</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonInnerContainer}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/screens/events')}
            >
                <LinearGradient
                  colors={['#07a751', '#8DC63F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                <Text style={styles.buttonText}>University Events</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
                <LinearGradient
                  colors={['#07a751', '#8DC63F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                <Text style={styles.buttonText}>Enrollment Summary</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={() => router.push('/screens/attire')}
            >
                <LinearGradient
                  colors={['#07a751', '#8DC63F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                <Text style={styles.buttonText}>Prescribe Student Attire</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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

  gridButtonContainer:{
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20
  },
  gridItem:{
    flex: 1, 
    paddingHorizontal: 50,
    gap: 20
  },

  buttonContainer:{
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50
  },
  buttonInnerContainer:{
    width: '50%',
    paddingHorizontal: 50,
    gap: 20,
  },

  buttonWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
});
