import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions, Modal, TextInput, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import QRCode from "react-native-qrcode-svg";

import { firestoreDB, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '../../store/useAuthStore';
import { initStudorgDB, fetchAllTabs, updateImage, updateQrEmail, deleteImage } from '../../database/studorg';
import { images } from '../../constants';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ResumableZoom } from 'react-native-zoom-toolkit';

const { width, height } = Dimensions.get('window');

const tabList = [
  'Supreme Student Council', 
  'Campus Emergency Response Team', 
  'Canislatran', 
  'Commission on Election',
  'Indayaw Dance Troupe',
  'Reserve Officers Training Corps'
];

const Studorg = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [orgImages, setOrgImages] = useState({}); // store all tab images
  const [loading, setLoading] = useState(false);
  const [qrLinks, setQrLinks] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [tempQrLink, setTempQrLink] = useState("");
  const [emails, setEmails] = useState({});
  const [tempEmail, setTempEmail] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  // 🔹 Fetch images for all tabs on mount
  useEffect(() => {
    const initDB = async () => {
      await initStudorgDB(tabList);
      const { imagesData, qrData, emailData } = await fetchAllTabs(tabList);
      setOrgImages(imagesData);
      setQrLinks(qrData);
      setEmails(emailData);
    };
    initDB();
  }, []);
  
  // const pickAndUploadImage = async () => {
  //   try {
  //     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!permission.granted) return alert('Permission to access media library is required.');

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       quality: 0.8,
  //     });

  //     if (!result.canceled && result.assets?.length > 0) {
  //       setLoading(true);
  //       const imageUri = result.assets[0].uri;

  //       // Upload to Firebase Storage
  //       const response = await fetch(imageUri);
  //       const blob = await response.blob();
  //       const storageRef = ref(storage, `studorg/${activeTab}_${Date.now()}.jpg`);
  //       await uploadBytes(storageRef, blob);
  //       const downloadURL = await getDownloadURL(storageRef);

  //       // Update SQLite DB
  //       await updateImage(activeTab, downloadURL);
  //       setOrgImages((prev) => ({ ...prev, [activeTab]: downloadURL }));

  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //     setLoading(false);
  //     alert("Failed to upload image.");
  //   }
  // };
  const saveImageLocally = async (uri, tab) => {
    try {
      const fileName = `${tab}_${Date.now()}.jpg`;
      const localPath = FileSystem.documentDirectory + fileName;
  
      await FileSystem.copyAsync({
        from: uri,
        to: localPath,
      });
  
      return localPath;
    } catch (err) {
      console.error("Failed to save locally:", err);
      return uri; // fallback
    }
  };
  
  const pickAndUploadImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Permission required');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
  
      if (result.canceled) return;
  
      setLoading(true);
  
      const pickedUri = result.assets[0].uri;
  
      // 🔹 Copy image into app storage
      const localUri = await saveImageLocally(pickedUri);
  
      // 🔹 Save LOCAL path to SQLite
      await updateImage(activeTab, localUri);
  
      setOrgImages(prev => ({
        ...prev,
        [activeTab]: localUri,
      }));
  
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Failed to save image offline');
    }
  };
  
  const openQrEditor = () => {
    setTempQrLink(qrLinks[activeTab] || "");
    setTempEmail(emails[activeTab] || "");
    setModalVisible(true);
  };

  const saveQrLink = async () => {
    try {
      await updateQrEmail(activeTab, tempQrLink, tempEmail);
      setQrLinks((prev) => ({ ...prev, [activeTab]: tempQrLink }));
      setEmails((prev) => ({ ...prev, [activeTab]: tempEmail }));
      setModalVisible(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save QR code or email.");
    }
  };

  const handleLogout = () => {
    logout();         
    router.replace("/");
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {orgImages[activeTab] ? (
          <Pressable onPress={() => setPreviewImage(orgImages[activeTab])} activeOpacity={0.9} >
            <Image 
              source={{ uri: orgImages[activeTab] }}
              style={styles.contentImage}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <Text style={{
            color: '#fff',
            fontFamily: 'Poppins-SemiBold',
            fontStyle: 'italic',
            fontWeight: '600',
            borderWidth: 2,
            borderColor: '#fff',
            borderStyle: 'dashed',
            padding: 10,
            borderRadius: 10,
            textAlign: 'center',
            marginTop: 200
          }}>No image uploaded yet.</Text>
        )}
      </View>
    );
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      {(user?.role === 'admin' || user?.role === 'super-admin') && (
        <View style={styles.funtionButtonContainer}>
            <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
            >
              <Image 
                source={images.back}
                style={styles.editIcon}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable
                style={styles.editButton}
                onPress={pickAndUploadImage}
            >
              <Image 
                source={images.edit}
                style={styles.editIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
                style={styles.editButton}
                onPress={openQrEditor}
            >
                <Ionicons name="qr-code" size={30} color="#333" style={[styles.buttonIcon, { marginTop: 10 }]} />
                {/* <Text style={styles.editButtonText}>Edit Info</Text> */}
            </Pressable>
        </View>
      )}

      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          {/* 🔹 Sidebar Tabs */}
          <View style={styles.cardContainer}>
            <View style={styles.backCard} />
            <View style={styles.frontCard}>
              <View style={styles.innerCard}>
                <View style={styles.tabContainer}>
                  {/* <FlatList
                    data={tabList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setActiveTab(item)}
                        activeOpacity={0.8}
                        style={[{ marginBottom: 15, overflow: 'hidden', backgroundColor: "#fff" }, activeTab === item ? styles.activeTabButton : styles.inactiveTabButton]}
                      >
                        <LinearGradient
                          colors={['#fff', '#fff']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.tabButton}
                        >
                          <Text
                            style={[
                              styles.tabText,
                              activeTab === item ? styles.activeTabText : styles.inactiveTabText
                            ]}
                          >
                            {item}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatlistContainer}
                  /> */}
                  <FlatList
                    data={tabList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                      const isActive = activeTab === item;

                      return (
                        <Pressable
                          onPress={() => setActiveTab(item)}
                          style={({ pressed }) => [
                            {
                              marginBottom: 15,
                              overflow: 'hidden',
                              backgroundColor: '#fff',
                              opacity: pressed ? 0.7 : 1, // visual feedback on press
                            },
                            isActive ? styles.activeTabButton : styles.inactiveTabButton,
                          ]}
                        >
                          <LinearGradient
                            colors={['#fff', '#fff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.tabButton}
                          >
                            <Text
                              style={[
                                styles.tabText,
                                isActive ? styles.activeTabText : styles.inactiveTabText,
                              ]}
                            >
                              {item}
                            </Text>
                          </LinearGradient>
                        </Pressable>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatlistContainer}
                  />

                </View>
              </View>
            </View>
          </View>

          {/* 🔹 Content */}
          <ScrollView 
            style={styles.contentWrapper} 
            contentContainerStyle={{ paddingBottom: 0 }}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
            {qrLinks[activeTab] && (
              <View style={styles.qrContainer}>
                {/* <Text style={styles.qrTitle}>Scan to visit our Facebook page</Text> */}
                <View style={{ padding: 10, backgroundColor: "#fff", marginTop: -50}}>
                  <QRCode
                    value={qrLinks[activeTab]}
                    size={100}
                    bgColor="black"
                    fgColor="white"
                  />
                </View>
                {emails[activeTab] ? (
                  <Text style={styles.emailText}>
                    📧 {emails[activeTab]}
                  </Text>
                ) : null}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* 🔹 QR Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit QR Code & Email</Text>
            <Text style={styles.modalLabel}>QR Link</Text>
            <TextInput
              value={tempQrLink}
              onChangeText={setTempQrLink}
              placeholder="Enter QR link..."
              style={styles.modalInput}
            />
            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              value={tempEmail}
              onChangeText={setTempEmail}
              placeholder="Enter email..."
              style={styles.modalInput}
              keyboardType="email-address"
            />
            <View style={styles.modalActions}>
              <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={18} color="#333" />
                <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.saveButton]} onPress={saveQrLink}>
                <Ionicons name="save" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!previewImage} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: '#000000dd' }}>
            
            {/* Close button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setPreviewImage(null)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </Pressable>

            <GestureHandlerRootView style={{ flex: 1 }}>
              {previewImage && (
                <ResumableZoom
                  style={{
                    width: width,
                    height: height,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  maxScale={4}
                >
                  <Image
                    source={{ uri: previewImage }}
                    style={{
                      width: width,
                      height: height,
                      resizeMode: 'contain',
                    }}
                  />
                </ResumableZoom>
              )}
            </GestureHandlerRootView>
          </View>
      </Modal>
    </ImageBackground>
  );
};

export default Studorg;

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: 20 },
  bodyContainer: { flex: 1, flexDirection: 'row' },
  tabContainer: { width: width * 0.3 },
  flatlistContainer: { flexGrow: 1, justifyContent: 'center' },
  tabButton: { paddingVertical: 10, alignItems: 'center' },
  tabText: { fontFamily: 'Arial-Bold-1', fontSize: 14, textAlign: 'center' },
  activeTabText: {
    color: '#215024'
  },
  inactiveTabText: {
      color: '#215024',
  },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { flex: 1, paddingHorizontal: 20, marginTop: 40 },
  // contentImage: { 
  //   width: '100%', 
  //   height: undefined,     
  //   aspectRatio: 1.5,       
  //   resizeMode: 'contain',  
  //   marginBottom: 20,
  // },
  contentImage: { 
    width: 330, 
    height: 330,          
    resizeMode: 'contain',  
    marginBottom: 0,
    marginHorizontal: 'auto',
    // marginTop: 30
  },

  cardContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 55, marginLeft: 50 },
  backCard: {
    position: 'absolute', width: width * 0.3, height: 400,
    // backgroundColor: '#257b3e', 
    borderRadius: 16, zIndex: 0
  },
  frontCard: {
    width: width * 0.3, height: 400,
    backgroundColor: 'transparent', borderRadius: 16, paddingHorizontal: 30,
    transform: [{ rotate: '-10deg' }], zIndex: 1, 
    // overflow: 'hidden',
  },
  innerCard: { flex: 1, transform: [{ rotate: '10deg' }], justifyContent: 'center', alignItems: 'center' },

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
  buttonIcon: { marginRight: 4 },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrTitle: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  modalContainer: { 
    backgroundColor: '#fff', 
    width: '85%', 
    borderRadius: 20, 
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10
  },
  
  modalTitle: { 
    fontSize: 20, 
    fontFamily: 'Poppins-Bold', 
    marginBottom: 16, 
    color: '#257b3e',
    textAlign: 'center'
  },

  modalInput: {
    // height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderRadius: 10,
    
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 12, 
    flex: 1 
  },
  
  cancelButton: { 
    backgroundColor: '#f1f1f1' 
  },
  
  saveButton: { 
    backgroundColor: '#257b3e' 
  },
  
  actionButtonText: { 
    fontWeight: '600', 
    fontSize: 16, 
    color: 'white', 
    fontFamily: 'Poppins-SemiBold'
  },
  
  cancelText: { 
    color: '#333', 
    fontFamily: 'Poppins-SemiBold' 
  },  
  
  buttonIcon: {
    marginRight: 6,
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
    color: '#257b3e',
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  
  cancelText: {
    color: '#333',
  },
  emailText: {
    marginTop: 12,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  editIcon:{
    width: 30,
    height: 30
  },
  activeTabButton: {
    backgroundColor: '#fff'
  },
  inactiveTabButton: {
      // backgroundColor: '#ffffffc3',
      opacity: 0.5
  },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
});
