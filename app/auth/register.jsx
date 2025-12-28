import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ImageBackground, ScrollView } from 'react-native';
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
          <KeyboardAwareScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              enableOnAndroid={true}
              extraScrollHeight={100} // give more space when keyboard is open
              keyboardShouldPersistTaps="handled"
          >
            <View style={styles.userIconWrapper}>
              <Ionicons name="person-circle-outline" size={100} color="#a7a6a5" />
              <Text style={styles.titleText}>Sign Up</Text>
            </View>
            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputContainer, isFocused.fullName && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="Enter full name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  onFocus={() => setIsFocused(prev => ({ ...prev, fullName: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, fullName: false }))}
                />
              </View>
            </View>

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

            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputContainer, isFocused.confirmPassword && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="Confirm password"
                  onFocus={() => setIsFocused(prev => ({ ...prev, confirmPassword: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, confirmPassword: false }))}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={!showConfirmPassword ? 'eye-off-outline' : "eye-outline"}
                    size={28}
                    color='blue'
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputContainer, isFocused.phoneNumber && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="+63XXXXXXXXXX"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  style={styles.input}
                  keyboardType="phone-pad"
                  onFocus={() => setIsFocused(prev => ({ ...prev, phoneNumber: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, phoneNumber: false }))}
                  maxLength={13}
                />
              </View>
            </View>

            <View style={styles.inputMainContainer}>
              <Text style={styles.label}>Address</Text>
              <View style={[styles.inputContainer, isFocused.address && styles.inputContainerFocused]}>
                <TextInput
                  placeholder="Enter address"
                  value={address}
                  onChangeText={setAddress}
                  style={styles.input}
                  multiline
                  onFocus={() => setIsFocused(prev => ({ ...prev, address: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, address: false }))}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
          <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.buttonWrapper}
              onPress={handleRegister}
              disabled={loading}
          >
              <LinearGradient
                  colors={['#00000055', '#ffffffdb']} 
                  locations={[0, 0.15]}
                  start={{ x: 0, y: 1.2 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
              >
                <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
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
    fontFamily: 'BaraBara',
    fontSize: width * 0.035,
    color: '#284615',
    textShadowColor: '#3b6620',   
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
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
    marginVertical: 5,
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
    marginBottom: 20
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
  },
  userIconWrapper: {
    alignItems: 'center',
    marginBottom: -20
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: "#284615"
  }
});

export default Register;
