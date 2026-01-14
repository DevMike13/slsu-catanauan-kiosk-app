import { useEffect, useState, useRef } from 'react';
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
import * as FileSystem from 'expo-file-system';
import { initOrgchartDB, getOrgchartData, updateOrgchartData } from '../../database/orgchart';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ResumableZoom } from 'react-native-zoom-toolkit';

const { width, height } = Dimensions.get('window');

const Orgchart = () => {
  const router = useRouter();
  
  const { user, logout } = useAuthStore();

  const [orgImage, setOrgImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      await initOrgchartDB();
      const uri = await getOrgchartData();
      setOrgImage(uri);
    };
    fetchData();
  }, []);

  const pickAndSaveImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return alert('Permission to access media library is required.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        const fileName = `orgchart_${Date.now()}.jpg`;
        const destPath = `${FileSystem.documentDirectory}${fileName}`;

        // copy image to persistent storage
        await FileSystem.copyAsync({ from: uri, to: destPath });

        // save local URI in SQLite
        await updateOrgchartData(destPath);
        setOrgImage(destPath);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image locally.');
    }
  };
  
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
            <Image 
              source={images.back}
              style={styles.editIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={pickAndSaveImage}
          >
            <Image 
              source={images.edit}
              style={styles.editIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}

      <SafeAreaView style={styles.container}>
          <ScrollView 
            // style={styles.scrollArea} 
            // contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.imageWrapper}>
              {orgImage ? (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setPreviewVisible(true)}
                  style={{ width: 500, height: 500, marginHorizontal: 'auto' }}
                >
                  <Image
                    source={{ uri: orgImage }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : (
                <Text style={{ color: '#999' }}>No org chart uploaded yet.</Text>
              )}
            </View>
          </ScrollView>
      </SafeAreaView>
      <Modal visible={previewVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#000000dd' }}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPreviewVisible(false)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <GestureHandlerRootView style={{flex:1}}>
          {orgImage && (
            <ResumableZoom
              style={{
                width: width,   // explicit width in pixels
                height: height, // explicit height in pixels
                justifyContent: 'center',
                alignItems: 'center',
              }}
              maxScale={4}
            >
              <Image
                source={{ uri: orgImage }}
                style={{ width: width, height: height, resizeMode: 'contain' }}
              />
            </ResumableZoom>
          )}
          </GestureHandlerRootView>
        </View>
      </Modal>
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
    // imageWrapper: {
    //   marginTop: -50,
    //   width: width - 100, // full screen width
    //   paddingHorizontal: 50,
    //   aspectRatio: 1080 / 1623,
    // },
    // image: {
    //   width: '100%',
    //   height: '100%',
    //   resizeMode: 'contain',
    // },
    image: {
      width: 500,
      height: 500,
      resizeMode: 'contain',
      marginHorizontal: 'auto',
      marginTop: 120,
      // backgroundColor: 'yellow'
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
      left: -30,                 
      top: '50%',              
      transform: [{ translateY: -20 }],
      zIndex: 50,
      backgroundColor: '#fff',
      paddingHorizontal: 0,
      paddingVertical: 10,
      borderTopRightRadius: 40,
      borderBottomRightRadius: 40,
      gap: 8
    },
    logoutButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'red',
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
      // backgroundColor: '#fff',
      // paddingHorizontal: 15,
      // paddingVertical: 6,
      borderRadius: 8
    },
  
    editButtonText: {
      color: '#257b3e',
      fontFamily: 'Poppins-Bold'
    },
    buttonIcon: { 
      marginRight: 6 
    },
    editIcon:{
      width: 30,
      height: 30
    },


    // PREVIEW MODAL
    previewContainer: { flex: 1, backgroundColor: '#0000002a' },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  zoomContainer: { flex: 1, width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%' },
    
});