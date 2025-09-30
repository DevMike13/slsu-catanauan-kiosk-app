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

const tabList = ['School Uniform', 'PE Uniform', 'Washday'];

const Attire = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [attireImages, setAttireImages] = useState({}); // { "School Uniform": { boyUrl, girlUrl } }

  useEffect(() => {
    const fetchAttires = async () => {
      const snap = await getDoc(doc(firestoreDB, 'pages', 'attire'));
      if (snap.exists()) {
        setAttireImages(snap.data());
      }
    };
    fetchAttires();
  }, []);

  const pickAndUploadImage = async (tab, gender) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return alert('Permission to access media library is required.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const imageUri = result.assets[0].uri;

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = ref(storage, `attire/${tab}/${gender}-${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        // update firestore
        const updated = {
          ...attireImages,
          [tab]: {
            ...(attireImages[tab] || {}),
            [`${gender}Url`]: downloadURL,
          },
        };
        await setDoc(doc(firestoreDB, 'pages', 'attire'), updated);

        setAttireImages(updated);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image.');
    }
  };

  const renderContent = () => {
    const current = attireImages[activeTab] || {};
    return (
      <View style={styles.rowContainer}>
        {/* BOY */}
        <View style={styles.imageWrapper}>
          {current.boyUrl ? (
            <Image source={{ uri: current.boyUrl }} style={styles.contentImage} resizeMode="contain" />
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
            }}>No boy attire yet.</Text>
          )}
          {user?.role === 'admin' && (
            <TouchableOpacity style={styles.editButton} onPress={() => pickAndUploadImage(activeTab, 'boy')}>
              <Ionicons name="create" size={20} color="#257b3e" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* GIRL */}
        <View style={styles.imageWrapper}>
          {current.girlUrl ? (
            <Image source={{ uri: current.girlUrl }} style={styles.contentImage} resizeMode="contain" />
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
            }}>No girl attire yet.</Text>
          )}
          {user?.role === 'admin' && (
            <TouchableOpacity style={styles.editButton} onPress={() => pickAndUploadImage(activeTab, 'girl')}>
              <Ionicons name="create" size={20} color="#257b3e" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          {/* Tabs */}
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
                              activeTab === item ? styles.activeTabText : styles.inactiveTabText,
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

          {/* Content */}
          <ScrollView
            style={styles.contentWrapper}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Attire;

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', position: 'relative' },
  container: { flex: 1, paddingHorizontal: 20 },
  bodyContainer: { flex: 1, flexDirection: 'row' },

  tabContainer: { width: width * 0.3 },
  flatlistContainer: { flexGrow: 1, justifyContent: 'center' },
  tabButton: { paddingVertical: 10, borderRadius: 30, alignItems: 'center' },
  tabText: { fontFamily: 'Poppins-Bold', fontSize: 14, textAlign: 'center' },
  activeTabText: { color: '#ffffff' },
  inactiveTabText: { color: '#b8b8b8' },

  contentWrapper: { flex: 1, paddingHorizontal: 10, marginHorizontal: 20 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 20, width: '100%' },
  imageWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentImage: { width: '100%', height: 400 },
  editButton: { marginTop: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 6, borderRadius: 8 },
  editButtonText: { color: '#257b3e', fontFamily: 'Poppins-Bold', marginLeft: 6 },

  cardContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  backCard: { position: 'absolute', width: width * 0.3, height: 400, backgroundColor: '#3dc88c', borderRadius: 16, zIndex: 0 },
  frontCard: { width: width * 0.3, height: 400, backgroundColor: '#257b3e', borderRadius: 16, paddingHorizontal: 30, transform: [{ rotate: '-10deg' }], zIndex: 1, elevation: 5, overflow: 'hidden' },
  innerCard: { flex: 1, transform: [{ rotate: '10deg' }], justifyContent: 'center', alignItems: 'center' },
});
