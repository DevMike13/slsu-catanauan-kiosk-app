import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions, TextInput, Button, Modal, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { images } from '../../constants';
import { firestoreDB, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const { width, height } = Dimensions.get('window');

const Orgchart = () => {
  const router = useRouter();

  const { user, clearUser } = useAuthStore();

  const [orgImage, setOrgImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgchart = async () => {
      const snap = await getDoc(doc(firestoreDB, 'pages', 'orgchart'));
      if (snap.exists()) {
        setOrgImage(snap.data().url);
      }
    };
    fetchOrgchart();
  }, []);

  const pickAndUploadImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return alert('Permission to access media library is required.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setLoading(true);
        const imageUri = result.assets[0].uri;

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = ref(storage, `orgchart/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        await setDoc(doc(firestoreDB, 'pages', 'orgchart'), { url: downloadURL });

        setOrgImage(downloadURL);
        setLoading(false);
      }
    } catch (error) {
      // console.error('Upload failed:', error);
      setLoading(false);
      alert('Failed to upload image.');
    }
  };
  
  const handleLogout = () => {
    clearUser();         
    router.replace("/");
  };

  return (
    <ImageBackground
        // source={images.background}
        style={styles.background}
        resizeMode="cover"
    >
      {user?.role === 'admin' && (
        <View style={styles.funtionButtonContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={32} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={pickAndUploadImage}
          >
            <Ionicons name="create" size={32} color="#333" style={styles.buttonIcon} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      <SafeAreaView style={styles.container}>
          <ScrollView 
            style={styles.scrollArea} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.imageWrapper}>
              {orgImage ? (
                <Image 
                  source={{ uri: orgImage }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ color: '#999' }}>No org chart uploaded yet.</Text>
              )}
            </View>
          </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Orgchart

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    container: {
      flex: 1,
      // backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 20,
    },
  
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.01,
      paddingVertical: 8
    },
    imageLogo: {
      width: 80,
      height: 80
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      fontSize: width * 0.06,
      marginBottom: -20
    },

    scrollArea: {
      flex: 1,
      marginTop: 20,
      height: '100%',
      // backgroundColor: 'red'
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 50,
    },
    imageWrapper: {
      marginTop: -50,
      width: width - 100, // full screen width
      paddingHorizontal: 50,
      aspectRatio: 1080 / 1623,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
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

    funtionButtonContainer: {
      position: 'absolute',
      left: 10,                 
      top: '50%',              
      transform: [{ translateY: -20 }],
      zIndex: 50,
      backgroundColor: '#257b3e',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 20,
      gap: 20
    },
    logoutButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'red',
      paddingHorizontal: 15,
      paddingVertical: 6,
      borderRadius: 8
    },
  
    logoutButtonText: {
      color: 'white',
      fontFamily: 'Poppins-Bold'
    },
  
    editButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 6,
      borderRadius: 8
    },
  
    editButtonText: {
      color: '#257b3e',
      fontFamily: 'Poppins-Bold'
    },
    buttonIcon: { 
      marginRight: 6 
    },
});