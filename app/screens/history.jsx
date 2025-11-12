import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { images } from '../../constants';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestoreDB } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const History = () => {
  const router = useRouter();

  const { user, clearUser } = useAuthStore();

  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tempContent, setTempContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      const ref = doc(firestoreDB, 'pages', 'history');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setContent(snap.data().text || '');
      }
    };
    fetchContent();
  }, []);

  const openEditor = () => {
    setTempContent(content);
    setModalVisible(true);
  };

  const saveContent = async () => {
    await setDoc(doc(firestoreDB, 'pages', 'history'), {
      text: tempContent,
    });
    setContent(tempContent);
    setModalVisible(false);
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
      {(user?.role === 'admin' || user?.role === 'super-admin') && (
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
            onPress={openEditor}
          >
            <Ionicons name="create" size={32} color="#333" style={styles.buttonIcon} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
      <SafeAreaView style={styles.container}>

        <View style={styles.cardContainer}>
          {/* BACK CARD */}
          <View style={styles.backCard} />

          {/* FRONT ROTATED CARD */}
          <View style={styles.frontCard}>
            {/* Counter-rotated content */}
            <View style={styles.innerCard}>
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.contentText}>{content}</Text>
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
      {/* MODAL EDITOR */}
      <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit History Page</Text>
              <TextInput
                multiline
                value={tempContent}
                onChangeText={setTempContent}
                style={styles.modalInput}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={18} color="#333" style={styles.buttonIcon} />
                  <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={saveContent}
                >
                  <Ionicons name="save" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
    </ImageBackground>
  );
};

export default History;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  cardContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  backCard: {
    position: 'absolute',
    width: width * 0.5,
    height: 330,
    backgroundColor: '#257b3e',
    borderRadius: 16,
    zIndex: 0
  },

  frontCard: {
    width: width * 0.5,
    height: 330,
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingHorizontal: 30,
    paddingVertical: 30,
    transform: [{ rotate: '-10deg' }],
    zIndex: 1,
    // elevation: 5,
    overflow: 'hidden',
  },
  
  innerCard: {
    flex: 1,
    transform: [{ rotate: '10deg' }],  // counter-rotate
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  
  contentText: {
    width: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
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
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderRadius: 20
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
  
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  
  cancelText: {
    color: '#333',
  },
});
