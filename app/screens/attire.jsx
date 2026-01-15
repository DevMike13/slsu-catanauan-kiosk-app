import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions, Modal } from 'react-native';
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
import { initAttireDB, fetchAttireByTab, upsertAttireImage, saveImageLocally } from '../../database/attire';

import { images } from '../../constants';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ResumableZoom } from 'react-native-zoom-toolkit';

const { width, height } = Dimensions.get('window');

const tabList = ['School Uniform', 'PE Uniform', 'Washday'];

const Attire = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [attireImages, setAttireImages] = useState({}); // { "School Uniform": { boyUrl, girlUrl } }

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const init = async () => {
      await initAttireDB();
      await loadAttire(activeTab);
    };
    init();
  }, []);

  const loadAttire = async (tab) => {
    const rows = await fetchAttireByTab(tab);
    const data = {};
    for (const row of rows) data[row.gender] = row.imageUri;
    setAttireImages(prev => ({ ...prev, [tab]: data }));
  };

  useEffect(() => {
    loadAttire(activeTab);
  }, [activeTab]);

  const pickAndSaveImage = async (tab, gender) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert('Permission required to access media library.');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const pickedUri = result.assets[0].uri;
      const localUri = await saveImageLocally(pickedUri, tab, gender);
      await upsertAttireImage(tab, gender, localUri);
      loadAttire(tab);
    }
  };

  const renderContent = () => {
    const current = attireImages[activeTab] || {};
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 20, width: '100%' }}>
        {['boy', 'girl'].map(gender => (
          <View key={gender} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {current[gender] ? (
              <TouchableOpacity onPress={() => setPreviewImage(current[gender])} activeOpacity={0.9} style={{ width: '100%', height: 400, marginTop: 60}}>
                <Image source={{ uri: current[gender] }} style={{ width: '100%', height: 400 }} resizeMode="contain" />
              </TouchableOpacity>
            ) : (
              <Text style={{
                color: '#fff', fontFamily: 'Poppins-SemiBold', fontStyle: 'italic', fontWeight: '600',
                borderWidth: 2, borderColor: '#fff', borderStyle: 'dashed', padding: 10, borderRadius: 10, textAlign: 'center'
              }}>
                {`No ${gender} attire yet.`}
              </Text>
            )}
            {(user?.role === 'admin' || user?.role === 'super-admin') && (
              <TouchableOpacity style={{ marginTop: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 6, borderRadius: 8 }}
                                onPress={() => pickAndSaveImage(activeTab, gender)}>
                <Ionicons name="create" size={20} color="#257b3e" />
                <Text style={{ color: '#257b3e', fontFamily: 'Poppins-Bold', marginLeft: 6 }}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
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
                        style={[{ marginBottom: 30, backgroundColor: "#fff" }, activeTab === item ? styles.activeTabButton : styles.inactiveTabButton]}
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
      <Modal visible={!!previewImage} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: '#000000dd' }}>
            
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPreviewImage(null)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>

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

export default Attire;

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', position: 'relative' },
  container: { flex: 1, paddingHorizontal: 20 },
  bodyContainer: { flex: 1, flexDirection: 'row' },

  tabContainer: { width: width * 0.3 },
  flatlistContainer: { flexGrow: 1, justifyContent: 'center' },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderRadius: 50,
    alignItems: 'center',
},
activeTabButton: {
  backgroundColor: '#fff'
},
inactiveTabButton: {
    // backgroundColor: '#ffffffc3',
    opacity: 0.5
},
tabText: {
  fontFamily: 'Arial-Bold-1',
  fontSize: 18,
  textAlign: 'center'
},
activeTabText: {
    color: '#215024'
},
inactiveTabText: {
    color: '#215024',
},

  contentWrapper: { flex: 1, paddingHorizontal: 10, marginHorizontal: 20 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 20, width: '100%' },
  imageWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentImage: { width: '100%', height: 400 },
  editButton: { marginTop: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 6, borderRadius: 8 },
  editButtonText: { color: '#257b3e', fontFamily: 'Arial-Bold-1', marginLeft: 6 },

  cardContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 55 },
  backCard: {
    position: 'absolute',
    width: width * 0.3,
    height: 500,
    // backgroundColor: '#257b3e',
    borderRadius: 16,
    zIndex: 0
  },

  frontCard: {
    width: width * 0.3,
    height: 500,
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingHorizontal: 30,
    // paddingVertical: 60,
    transform: [{ rotate: '-10deg' }],
    zIndex: 1,
    // elevation: 5,
    // overflow: 'hidden',
  },
  innerCard: { flex: 1, transform: [{ rotate: '10deg' }], justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
});
