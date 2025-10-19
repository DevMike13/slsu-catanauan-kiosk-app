import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import QRCode from "react-native-qrcode-svg";

import { firestoreDB, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '../../store/useAuthStore';
import { images } from '../../constants';

const { width } = Dimensions.get('window');

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
  const { user, clearUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [orgImages, setOrgImages] = useState({}); // store all tab images
  const [loading, setLoading] = useState(false);
  const [qrLinks, setQrLinks] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [tempQrLink, setTempQrLink] = useState("");
  const [emails, setEmails] = useState({});
  const [tempEmail, setTempEmail] = useState("");


  // 🔹 Fetch images for all tabs on mount
  useEffect(() => {
    const fetchData = async () => {
      let imagesData = {};
      let qrData = {};
      let emailData = {};
      for (let tab of tabList) {
        const snap = await getDoc(doc(firestoreDB, "studorg", tab));
        if (snap.exists()) {
          const data = snap.data();
          imagesData[tab] = data.url;
          qrData[tab] = data.qrLink || "";
          emailData[tab] = data.email || "";
        }
      }
      setOrgImages(imagesData);
      setQrLinks(qrData);
      setEmails(emailData);
    };
    fetchData();
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

        const storageRef = ref(storage, `studorg/${activeTab}_${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        await setDoc(doc(firestoreDB, 'studorg', activeTab), { 
          url: downloadURL, 
          qrLink: qrLinks[activeTab] || "" 
        });

        setOrgImages((prev) => ({ ...prev, [activeTab]: downloadURL }));
        setLoading(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
      alert('Failed to upload image.');
    }
  };

  const openQrEditor = () => {
    setTempQrLink(qrLinks[activeTab] || "");
    setTempEmail(emails[activeTab] || "");
    setModalVisible(true);
  };

  const saveQrLink = async () => {
    try {
      await setDoc(doc(firestoreDB, "studorg", activeTab), {
        url: orgImages[activeTab] || "",
        qrLink: tempQrLink,
        email: tempEmail,
      });
      setQrLinks((prev) => ({ ...prev, [activeTab]: tempQrLink }));
      setEmails((prev) => ({ ...prev, [activeTab]: tempEmail }));
      setModalVisible(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save QR code link.");
    }
  };

  const handleLogout = () => {
    clearUser();         
    router.replace("/");
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {orgImages[activeTab] ? (
          <Image 
            source={{ uri: orgImages[activeTab] }}
            style={styles.contentImage}
            resizeMode="contain"
          />
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
            textAlign: 'center'
          }}>No image uploaded yet.</Text>
        )}
      </View>
    );
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
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
                <Ionicons name="create" size={28} color="#333" style={styles.buttonIcon} />
                <Text style={styles.editButtonText}>{loading ? 'Uploading...' : 'Edit Image'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.editButton}
                onPress={openQrEditor}
            >
                <Ionicons name="qr-code" size={22} color="#333" style={styles.buttonIcon} />
                <Text style={styles.editButtonText}>Edit Info</Text>
            </TouchableOpacity>
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
                  <FlatList
                    data={tabList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setActiveTab(item)}
                        activeOpacity={0.8}
                        style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden' }}
                      >
                        <LinearGradient
                          colors={['transparent', 'transparent']}
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
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 🔹 Content */}
          <ScrollView 
            style={styles.contentWrapper} 
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
            {qrLinks[activeTab] && (
              <View style={styles.qrContainer}>
                <Text style={styles.qrTitle}>Scan to visit our Facebook page</Text>
                <QRCode
                  value={qrLinks[activeTab]}
                  size={160}
                  bgColor="black"
                  fgColor="white"
                />
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
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={18} color="#333" />
                <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={saveQrLink}>
                <Ionicons name="save" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  tabButton: { paddingVertical: 10, borderRadius: 30, alignItems: 'center' },
  tabText: { fontFamily: 'Poppins-Bold', fontSize: 12, textAlign: 'center' },
  activeTabText: { color: '#ffffff' },
  inactiveTabText: { color: '#b8b8b8' },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { flex: 1, paddingHorizontal: 20 },
  contentImage: { 
    width: '100%', 
    height: undefined,      // ✅ let height adjust automatically
    aspectRatio: 1.5,       // ✅ adjust this based on your images (e.g. 16:10)
    resizeMode: 'contain',  // ✅ keeps aspect ratio
    marginBottom: 20,
  },
  

  cardContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 55 },
  backCard: {
    position: 'absolute', width: width * 0.3, height: 330,
    backgroundColor: '#257b3e', borderRadius: 16, zIndex: 0
  },
  frontCard: {
    width: width * 0.3, height: 330,
    backgroundColor: 'transparent', borderRadius: 16, paddingHorizontal: 30,
    transform: [{ rotate: '-10deg' }], zIndex: 1, overflow: 'hidden',
  },
  innerCard: { flex: 1, transform: [{ rotate: '10deg' }], justifyContent: 'center', alignItems: 'center' },

  funtionButtonContainer: {
    position: 'absolute',
    right: 10,                 
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
});
