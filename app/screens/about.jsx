import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, 
  ScrollView, Dimensions, Modal, TextInput, Button
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { images } from '../../constants';
import { firestoreDB } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';

const { width } = Dimensions.get('window');

const About = () => {
  const router = useRouter();

  const { user } = useAuthStore();

  const [aboutData, setAboutData] = useState({
    vision: '',
    mission: '',
    core: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, setTempData] = useState({ ...aboutData });

  useEffect(() => {
    const fetchContent = async () => {
      const ref = doc(firestoreDB, 'pages', 'about');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAboutData(snap.data());
      }
    };
    fetchContent();
  }, []);

  const openEditor = () => {
    setTempData(aboutData);
    setModalVisible(true);
  };

  const saveContent = async () => {
    await setDoc(doc(firestoreDB, 'pages', 'about'), tempData);
    setAboutData(tempData);
    setModalVisible(false);
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
            style={styles.editButton}
            onPress={openEditor}
          >
            <Ionicons name="create" size={28} color="#333" style={styles.buttonIcon} />
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
                    <Text style={styles.contentTitleText}>VISION</Text>
                    <Text style={styles.contentText}>{aboutData.vision}</Text>

                    <Text style={styles.contentTitleText}>MISSION</Text>
                    <Text style={styles.contentText}>{aboutData.mission}</Text>

                    <Text style={styles.contentTitleText}>CORE VALUES</Text>
                    <View style={styles.hightlightContainer}>
                      {aboutData.core?.map((item, index) => (
                        <Text key={index} style={styles.contentTextWithHighlight}>
                          <Text style={styles.contentHighlightText}>{item.code}</Text> - {item.text}
                        </Text>
                      ))}
                    </View>
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
            <ScrollView 
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ maxHeight: 370 }}  // optional fixed max height
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
            <Text style={styles.modalTitle}>Edit About Page</Text>

            {/* Make this section scrollable */}
            
              <TextInput
                multiline
                value={tempData.vision}
                onChangeText={(t)=>setTempData({...tempData, vision:t})}
                style={styles.modalInput}
                placeholder="Vision"
              />
              <TextInput
                multiline
                value={tempData.mission}
                onChangeText={(t)=>setTempData({...tempData, mission:t})}
                style={styles.modalInput}
                placeholder="Mission"
              />

              <Text style={{ marginBottom: 10, fontFamily: 'Poppins-SemiBold'}}>Core Values</Text>

              {tempData.core?.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 8, gap: 10 }}>
                  <TextInput
                    value={item.code}
                    onChangeText={(text) => {
                      const updated = [...tempData.core];
                      updated[index].code = text;
                      setTempData({ ...tempData, core: updated });
                    }}
                    placeholder="Code"
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      backgroundColor: '#f9f9f9',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular'
                    }}
                  />
                  <TextInput
                    value={item.text}
                    onChangeText={(text) => {
                      const updated = [...tempData.core];
                      updated[index].text = text;
                      setTempData({ ...tempData, core: updated });
                    }}
                    placeholder="Text"
                    style={{
                      flex: 2,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      backgroundColor: '#f9f9f9',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular'
                    }}
                  />
                </View>
              ))}

              <TouchableOpacity
                style={styles.addCoreButton}
                onPress={() =>
                  setTempData({
                    ...tempData,
                    core: [...(tempData.core || []), { code: '', text: '' }],
                  })
                }
              >
                <Ionicons name="add" size={16} color="#333" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 14, color: '#333', fontFamily: 'Poppins-Regular' }}>Add Core Value</Text>
              </TouchableOpacity>
            </ScrollView>

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
}

export default About

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
      justifyContent: 'center'
    },
  
    backCard: {
      position: 'absolute',
      width: width * 0.5,
      height: 450,
      backgroundColor: '#3dc88c',
      borderRadius: 16,
      zIndex: 0
    },
  
    frontCard: {
      width: width * 0.5,
      height: 450,
      backgroundColor: '#257b3e',
      borderRadius: 16,
      paddingHorizontal: 30,
      paddingVertical: 60,
      transform: [{ rotate: '-10deg' }],
      zIndex: 1,
      elevation: 5,
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

    contentTitleText:{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    contentText:{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: 'white',
        textAlign: 'center'
    },
    contentHighlightText:{
        fontFamily: 'Poppins-Black',
        color: 'white'
    },
    contentTextWithHighlight:{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: 'white',
        textAlign: 'left'
    },
    hightlightContainer: {
        width: '60%',
        marginVertical: 'auto'
    },
    
    funtionButtonContainer: {
      position: 'absolute',
      left: 10,                 
      top: '50%',              
      transform: [{ translateY: -20 }],
      zIndex: 50,
      backgroundColor: '#257b3e',
      padding: 10,
      borderRadius: 20,
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
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      letterSpacing: 0.5
    },
    
    buttonIcon: { 
      marginRight: 6 
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
      height: 100, 
      borderColor: '#e0e0e0', 
      borderWidth: 1, 
      padding: 14, 
      textAlignVertical: 'top', 
      marginBottom: 20, 
      borderRadius: 14,
      backgroundColor: '#fafafa',
      fontFamily: 'Poppins-Regular',
      fontSize: 14
    },
    
    modalActions: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      gap: 12 
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
    
    addCoreButton:{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: '#e5e5e5',
      borderRadius: 8,
      marginVertical: 8,
      marginBottom: 20
    }
  });