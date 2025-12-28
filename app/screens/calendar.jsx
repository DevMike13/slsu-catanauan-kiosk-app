import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Dimensions, Modal, Button, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { firestoreDB, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '../../store/useAuthStore';
import { initCalendarDB, getCalendarImages, addCalendarImage, updateCalendarImage, deleteCalendarImage } from '../../database/calendar';

const { width } = Dimensions.get('window');
import { images } from '../../constants';

const Calendar = () => {
  const router = useRouter();

  const { user, logout } = useAuthStore();

  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const initDB = async () => {
      await initCalendarDB();
      const images = await getCalendarImages();
      setImagesList(images);
    };
    initDB();
  }, []);

  const pickImage = async (index) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return alert('Permission required to access photos.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const assetUri = result.assets?.[0]?.uri;
      if (!assetUri) return alert('No image selected.');

      const localUri = `${FileSystem.documentDirectory}calendar_${Date.now()}.jpg`;

      // Copy file
      await FileSystem.copyAsync({ from: assetUri, to: localUri });

      if (index !== undefined) {
        await updateCalendarImage(imagesList[index].id, localUri);
      } else {
        await addCalendarImage(localUri);
      }

      const updatedImages = await getCalendarImages();
      setImagesList(updatedImages);
    } catch (err) {
      console.log('File pick/save error:', err);
      alert('Failed to pick or save image. Check console.');
    }
  };
  

  const removeImage = (index) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          const newImages = await deleteCalendarImage(imagesList[index].id);
          setImagesList(newImages);
        }},
      ]
    );
  };

  // const addImage = () => pickAndUploadImage();
  
  const handleLogout = () => {
    logout();         
    router.replace("/");
  };

  return (
    <ImageBackground
      // source={images.background}
      style={styles.background}
      resizeMode="cover"
    >
        {(user?.role === 'admin' || user?.role === 'super-admin') && (
          <View style={styles.funtionButtonContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={32} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => pickImage()}>
              <Ionicons name="images" size={32} color="#333" style={styles.buttonIcon} />
              <Text style={styles.editButtonText}>Add Image</Text>
            </TouchableOpacity>
          </View>
        )}
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {imagesList.length === 0 && (
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Poppins-SemiBold',
                  fontStyle: 'italic',
                  fontWeight: '600',
                  borderWidth: 2,
                  borderColor: '#fff',
                  borderStyle: 'dashed',
                  padding: 10,
                  borderRadius: 10,
                  textAlign: 'center'
                }}
              >
                No calendar images uploaded yet.
              </Text>
            )}


            {imagesList.map((img, index) => (
              <View key={index} style={styles.imageRow}>
                <Image source={{ uri: img.uri }} style={styles.image} resizeMode="contain" />
                {(user?.role === 'admin' || user?.role === 'super-admin') && (
                  <View style={styles.imageButtons}>
                    <TouchableOpacity style={styles.editButtonOnImage} onPress={() => pickImage(index)}>
                      <Ionicons name="create" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButtonOnImage} onPress={() => removeImage(index)}>
                      <Ionicons name="trash" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
    </ImageBackground>
  )
}

export default Calendar

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative'
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
    },
    scrollContent: {
      alignItems: 'center',
      paddingVertical: 20,
      gap: 30,
    },

    imageRow: {
      width: width - 100,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative'
    },
    image: {
      width: width - 120, // leave space for buttons
      height: (width - 120) * 0.7,
      borderRadius: 16,
    },
    imageButtons: {
      position: 'absolute',
      right: 20,
      flexDirection: 'column',
      gap: 10,
    },
    editButtonOnImage: {
      backgroundColor: '#257b3e',
      padding: 8,
      borderRadius: 50,
    },
    deleteButtonOnImage: {
      backgroundColor: 'red',
      padding: 8,
      borderRadius: 50,
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
    editButton: {
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
    editButtonOnImage: {
      position: 'absolute',
      top: 10,
      right: 20,
      backgroundColor: '#257b3e',
      padding: 8,
      borderRadius: 50,
      zIndex: 10,
    },
    buttonIcon: {
      marginRight: 6
    },
    editButtonOnImage: { backgroundColor: '#257b3e', padding: 8, borderRadius: 50 },
    deleteButtonOnImage: { backgroundColor: 'red', padding: 8, borderRadius: 50 },
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
});