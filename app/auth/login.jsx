import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ImageBackground, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestoreDB } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuthStore } from '../../store/useAuthStore';

import { db, prepopulateUsers, initDB, showAllUsers, deleteAllUsers } from '../../database/db';


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

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!username || !institutionalEmail || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      await login(username, institutionalEmail, password);

      router.push('/screens/main');

    } catch (error) {
      let message = 'Something went wrong';

      switch (error.message) {
        case 'INVALID_CREDENTIALS':
          message = 'Invalid email or password.';
          break;
        case 'USERNAME_MISMATCH':
          message = 'Username does not match.';
          break;
        case 'REJECTED':
          message = 'Your account has been rejected by admin.';
          break;
        case 'PENDING':
          message = 'Your account is pending approval.';
          break;
      }

      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
        source={images.newBG}
        style={styles.background}
        resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
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
            <KeyboardAwareScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              enableOnAndroid={true}
              extraScrollHeight={50} // give more space when keyboard is open
              keyboardShouldPersistTaps="handled"
            >
            <View style={styles.userIconWrapper}>
              <Ionicons name="person" size={70} color="#686868" />
              <Text style={styles.titleText}>Log In</Text>
            </View>

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Username:</Text>
              <View>
                <TextInput
                  placeholder="Enter username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.inputMain}
                  onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                />
              </View>
            </View>

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Institutional Email:</Text>
              <View>
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

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Password:</Text>
              <View>
                <TextInput
                  placeholder="Enter password"
                  onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.inputMain}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, top: 10}}>
                  <Ionicons
                    name={!showPassword ? 'eye-off-outline' : "eye-outline"}
                    size={28}
                    color='#284615'
                  />
                </TouchableOpacity>
              </View>
            </View>

          </KeyboardAwareScrollView>
          <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={handleLogin}
              disabled={loading}
          >
              <LinearGradient
                  colors={['#00000055', '#ffffffdb']} 
                  locations={[0, 0.15]}
                  start={{ x: 0, y: 1.2 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
              >
                <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Log In'}</Text>
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
    paddingHorizontal: width * 0.05,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 40,
    paddingHorizontal: width * 0.0,
    paddingVertical: height * 0.02,
  },
  headerText: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 45,
    color: '#284615',
  },
  imageLogo: {
    width: width * 0.10,
    height: undefined,
    aspectRatio: 1,
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
    fontSize: 24,
    marginBottom: 8,
    color: '#ffffff',
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
    width: '18%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    right: 40
  },
  button: {
    // paddingVertical: height * 0.015,
    // paddingHorizontal: width * 0.06,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#284615',
    fontFamily: 'Arial-Bold-1',
    fontSize: 26,
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
  },
  userIconWrapper: {
    alignItems: 'center'
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: "#284615"
  },

  // NEW INPUT
  inputCnt:{
    width: 'auto',
    flexDirection: 'row',
    // justifyContent: 'between',
    alignItems: 'center',
    backgroundColor: '#ffffffce',
    borderRadius: 50,
    paddingHorizontal: 20,
    overflow: 'hidden',
    gap: 5,
    position: 'relative'
  },
  inputLabel:{
    color: '#284615',
    fontFamily: 'Arial-Bold-1',
    fontSize: 26
  },
  inputMain : {
    width: 400,
    fontFamily: 'Arial-Regular',
    fontSize: 20
  },
});

export default Login;
