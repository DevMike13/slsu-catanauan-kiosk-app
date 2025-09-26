import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [orgImages, setOrgImages] = useState({}); // store all tab images
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch images for all tabs on mount
  useEffect(() => {
    const fetchImages = async () => {
      let imagesData = {};
      for (let tab of tabList) {
        const snap = await getDoc(doc(firestoreDB, 'studorg', tab));
        if (snap.exists()) {
          imagesData[tab] = snap.data().url;
        }
      }
      setOrgImages(imagesData);
    };
    fetchImages();
  }, []);

  // 🔹 Upload image for current tab
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

        await setDoc(doc(firestoreDB, 'studorg', activeTab), { url: downloadURL });

        setOrgImages((prev) => ({ ...prev, [activeTab]: downloadURL }));
        setLoading(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
      alert('Failed to upload image.');
    }
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
                // onPress={pickAndUploadImage}
            >
                <Ionicons name="log-out" size={32} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.editButton}
                onPress={pickAndUploadImage}
            >
                <Ionicons name="create" size={28} color="#333" style={styles.buttonIcon} />
                <Text style={styles.editButtonText}>{loading ? 'Uploading...' : 'Edit'}</Text>
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
            contentContainerStyle={{ flex: 1 }} 
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
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
  contentImage: { width: '100%', height: '100%' },

  cardContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  backCard: {
    position: 'absolute', width: width * 0.3, height: 400,
    backgroundColor: '#3dc88c', borderRadius: 16, zIndex: 0
  },
  frontCard: {
    width: width * 0.3, height: 400,
    backgroundColor: '#257b3e', borderRadius: 16, paddingHorizontal: 30,
    transform: [{ rotate: '-10deg' }], zIndex: 1, elevation: 5, overflow: 'hidden',
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
});
