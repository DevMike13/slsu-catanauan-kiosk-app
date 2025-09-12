import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ImageBackground, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestoreDB } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';

import { useAuthStore } from '../../store/useAuthStore';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({});
  const [loading, setLoading] = useState(false);
  
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!username || !institutionalEmail || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, institutionalEmail, password);
      const userId = userCredential.user.uid;

      const docRef = doc(firestoreDB, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (userData.username !== username) {
          Alert.alert('Error', 'Username does not match');
          return;
        }

        setUser(userData);
  
        console.log("User logged in:", userData);

        router.push("/screens/main");
      } else {
        Alert.alert('Error', 'No user profile found');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

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
              <Text style={styles.headerText}>SIGN IN</Text>
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
            

            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputContainer, isFocused.username && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="Enter username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                />
              </View>
            </View>

            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Institutional Email</Text>
              <View style={[styles.inputContainer, isFocused.institutionalEmail && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="Enter institutional email"
                  value={institutionalEmail}
                  onChangeText={setInstitutionalEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  onFocus={() => setIsFocused(prev => ({ ...prev, institutionalEmail: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, institutionalEmail: false }))}
                />
              </View>
            </View>

            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputContainer, isFocused.password && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="Enter password"
                  onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={!showPassword ? 'eye-off-outline' : "eye-outline"}
                    size={28}
                    color='blue'
                  />
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
          <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={handleLogin}
              disabled={loading}
          >
              <LinearGradient
                  colors={['#07a751', '#8DC63F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
              >
                <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
              </LinearGradient>
          </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative'
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
    paddingHorizontal: width * 0.02,
    paddingVertical: 8
  },
  imageLogo: {
    width: 80,
    height: 80
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.06,
    marginBottom: -12
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width * 0.2,
    paddingBottom: 20,
    gap: 20
  },

 
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 8,
    color: '#333',
  },
  inputMainContainer:{
    width: '100%',
    height: 'auto',
    marginVertical: 10,
  },
  input : {
    flex : 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16
  },
  inputContainer: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff82',
    borderWidth: 2,
    borderColor: '#07a751',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainerFocused: {
    borderColor: '#d0f58d',
  },
  forgetText: {
    fontFamily: 'Poppins-Light',
    color: 'blue'
  },
  buttonContainer:{
    marginTop: 50
  },
  buttonWrapper: {
    borderRadius: 50,
    width: '30%',
    alignSelf: 'center'
  },
  button: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.02,
  },

  registerContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  registerText: {
    fontFamily: 'Poppins-Light'
  },
  registerButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'blue'
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

export default Login;
