import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ImageBackground, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { setDoc, doc } from 'firebase/firestore';
import { auth, firestoreDB } from '../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';

import { registerUser } from '../../database/auth';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = Dimensions.get('window').width;

const Register = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+63');
  const [address, setAddress] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isFocused, setIsFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (value) => {
    let cleaned = value.replace(/[^0-9+]/g, '');
    if (!cleaned.startsWith('+63')) {
      cleaned = '+63';
    }
    if (cleaned.length > 13) {
      cleaned = cleaned.slice(0, 13);
    }
    setPhoneNumber(cleaned);
  };

  const role = 'admin';

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !username.trim() ||
      !institutionalEmail.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !phoneNumber.trim() ||
      !address.trim()
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
  
    if (!phoneNumber.startsWith("+63") || phoneNumber.length !== 13) {
      Alert.alert("Error", "Please enter a valid phone number in +63XXXXXXXXXX format.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(institutionalEmail)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }
  
    if (!institutionalEmail.endsWith('@slsu.edu.ph')) {
      Alert.alert('Please use your institutional email (e.g., yourname@slsu.edu.ph).');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Call SQLite registration function
      await registerUser({
        fullName,
        username,
        email: institutionalEmail,
        password,
        phoneNumber,
        address,
        role,
      });
  
      Alert.alert("Success", "Account created successfully!");
      router.push('/auth/login');
  
    } catch (err) {
      console.error(err);
  
      let message = "Registration failed.";
  
      if (err.message === 'EMAIL_EXISTS') {
        message = "This email is already registered.";
      }
  
      Alert.alert("Error", message);
  
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
          <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              enableOnAndroid={true}
              extraScrollHeight={100} // give more space when keyboard is open
              keyboardShouldPersistTaps="handled"
          >
            <View style={styles.userIconWrapper}>
              <Ionicons name="person" size={45} color="#686868" />
              <Text style={styles.titleText}>Sign Up</Text>
            </View>

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Full name:</Text>
              <View>
                <TextInput
                  placeholder="Enter full name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.inputMain}
                  onFocus={() => setIsFocused(prev => ({ ...prev, fullName: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, fullName: false }))}
                />
              </View>
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
                  style={styles.inputMain}
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
                  key={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.inputMain}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 170, top: 6}}>
                  <Ionicons
                    name={!showPassword ? 'eye-off-outline' : "eye-outline"}
                    size={28}
                    color='#284615'
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Confirm Password:</Text>
              <View>
                <TextInput
                  placeholder="Confirm password"
                  onFocus={() => setIsFocused(prev => ({ ...prev, confirmPassword: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, confirmPassword: false }))}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.inputMain}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: 240, top: 6}}>
                  <Ionicons
                    name={!showConfirmPassword ? 'eye-off-outline' : "eye-outline"}
                    size={28}
                    color='#284615'
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Phone Number:</Text>
              <View>
                <TextInput
                  placeholder="+63XXXXXXXXXX"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  style={styles.inputMain}
                  keyboardType="phone-pad"
                  onFocus={() => setIsFocused(prev => ({ ...prev, phoneNumber: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, phoneNumber: false }))}
                  maxLength={13}
                />
              </View>
            </View>

            <View style={styles.inputCnt}>
              <Text style={styles.inputLabel}>Address:</Text>
              <View>
                <TextInput
                  placeholder="Enter address"
                  value={address}
                  onChangeText={setAddress}
                  style={styles.inputMain}
                  multiline
                  onFocus={() => setIsFocused(prev => ({ ...prev, address: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, address: false }))}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={handleRegister}
                disabled={loading}
            >
                <LinearGradient
                    colors={['#0000006f', '#fffffff1']} 
                    locations={[0, 0.15]}
                    start={{ x: 0, y: 1.2 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                  <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
                </LinearGradient>
            </Pressable>

            <Pressable 
                activeOpacity={0.8} 
                style={styles.buttonWrapper}
                onPress={() => router.back()}
                disabled={loading}
            >
                <LinearGradient
                    colors={['#0000006f', '#fffffff1']} 
                    locations={[0, 0.15]}
                    start={{ x: 0, y: 1.2 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </LinearGradient>
            </Pressable>
          </View>

      </SafeAreaView>
      {/* <Pressable 
          style={styles.navButtonContainer}
          onPress={() => router.back()}
      >
          <Image 
              source={images.backIcon}
              style={styles.navButtonImage}
              resizeMode='contain'
          />
      </Pressable> */}
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
    // backgroundColor: '#ffffff4c',
    paddingHorizontal: width * 0.05,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 20,
    // paddingHorizontal: width * 0.0,
    // paddingVertical: height * 0.02,
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

  scrollArea: {
      flex: 1,
      marginTop: -10
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 250,
    paddingTop: 5,
    paddingBottom: 20,
    gap: 10,
    // backgroundColor: 'green',
    // height: 100
  },

 
  label: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 24,
    marginBottom: 8,
    color: '#ffffff',
  },
  inputMainContainer:{
    width: '100%',
    height: 'auto',
    marginVertical: 5,
  },
  input : {
    flex : 1,
    fontFamily: 'Arial-Regular',
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
    fontFamily: 'Arial-Regular',
    color: 'blue'
  },
  buttonContainer:{
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center', // center the row horizontally
    gap: 10,
  },
  buttonWrapper: {
    borderRadius: 50,
    width: '16%', // adjust width so both fit nicely in one row
    height: 50,
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
    fontSize: 20,
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
    alignItems: 'center',
    marginTop: -8
    // marginBottom: -20
  },
  titleText: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 20,
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
    fontSize: 18
  },
  inputMain : {
    width: 400,
    fontFamily: 'Arial-Regular',
    fontSize: 14
  },
});

export default Register;
