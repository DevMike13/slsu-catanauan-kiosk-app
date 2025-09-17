import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions, TextInput, Modal, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { firestoreDB } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '../../store/useAuthStore';

import { images } from '../../constants';

const { width } = Dimensions.get('window');

const tabList = [
    'Bachelor of Elementary Education Major in General Education', 
    'Bachelor of Industrial Technology Major in Computer Technology', 
    'Bachelor of Industrial Technology Major in Mechanical Technology',
    'Bachelor of Science in Agriculture Major in Crop Science'
];

const Program = () => {
    const router = useRouter();
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState(tabList[0]);
    const [tabContent, setTabContent] = useState({ objectives: '', goals: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const [tempContent, setTempContent] = useState({ objectives: '', goals: '' });
    
    useEffect(() => {
        const fetchTabContent = async () => {
          const ref = doc(firestoreDB, 'program_texts', activeTab);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setTabContent(snap.data());
          } else {
            setTabContent({ objectives: '', goals: '' });
          }
        };
        fetchTabContent();
      }, [activeTab]);

    const openEditor = () => {
        setTempContent(tabContent);
        setModalVisible(true);
    };

    const saveContent = async () => {
        await setDoc(doc(firestoreDB, 'program_texts', activeTab), tempContent);
        setTabContent(tempContent);
        setModalVisible(false);
    };

    const renderContent = () => {
      if (activeTab === 'Bachelor of Elementary Education Major in General Education') {
        return (
          <View style={styles.contentContainer}>
            <View style={styles.contentInner}>
                <View style={styles.column}>
                    <Text style={styles.heading}>Proposed Objectives</Text>
                    <Text style={styles.paragraph}>
                        {tabContent.objectives}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.heading}>Proposed Goals</Text>
                    <Text style={styles.paragraph}>
                        {tabContent.goals}
                    </Text>
                </View>
            </View>
          </View>
        );
      }
  
      if (activeTab === 'Bachelor of Industrial Technology Major in Computer Technology') {
        return (
            <View style={styles.contentContainer}>
                <View style={styles.contentInner}>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Objectives</Text>
                        <Text style={styles.paragraph}>
                            {tabContent.objectives}
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Goals</Text>
                        <Text style={styles.paragraph}>
                            {tabContent.goals}
                        </Text>
                    </View>
                </View>
            </View>
        );
      }
  
      if (activeTab === 'Bachelor of Industrial Technology Major in Mechanical Technology') {
          return (
            <View style={styles.contentContainer}>
                <View style={styles.contentInner}>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Objectives</Text>
                        <Text style={styles.paragraph}>
                            {tabContent.objectives}
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Goals</Text>
                        <Text style={styles.paragraph}>
                            {tabContent.goals}
                        </Text>
                    </View>
                </View>
            </View>
          );
      }
      
      if (activeTab === 'Bachelor of Science in Agriculture Major in Crop Science') {
        return (
            <View style={styles.contentContainer}>
                <View style={styles.contentInner}>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Objectives</Text>
                        <Text style={styles.paragraph}>
                            {tabContent.objectives}
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Goals</Text>
                        <Text style={styles.paragraph}>
                            {tabContent.goals}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
    
      return null;
    };
    return (
      <ImageBackground
        //   source={images.background}
          style={styles.background}
          resizeMode="cover"
      >
            {user?.role === 'admin' && (
                <View style={styles.funtionButtonContainer}>
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
              <View style={styles.bodyContainer}>
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
                                                colors={
                                                    activeTab === item
                                                    ? ['transparent', 'transparent']
                                                    : ['transparent', 'transparent']
                                                }
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
  
                  <ScrollView style={styles.contentWrapper} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                      {renderContent()}
                  </ScrollView>
              </View>
          </SafeAreaView>
            {/* Modal Editor */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text style={styles.modalTitle}>Edit {activeTab}</Text>
                            <Text style={styles.modalLabel}>Proposed Objectives</Text>
                            <TextInput
                                multiline
                                value={tempContent.objectives}
                                onChangeText={(text) => setTempContent({ ...tempContent, objectives: text })}
                                style={styles.modalInput}
                            />
                            <Text style={styles.modalLabel}>Proposed Goals</Text>
                            <TextInput
                                multiline
                                value={tempContent.goals}
                                onChangeText={(text) => setTempContent({ ...tempContent, goals: text })}
                                style={styles.modalInput}
                            />
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={18} color="#333" style={styles.buttonIcon} />
                                <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={saveContent}>
                                <Ionicons name="save" size={18} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.actionButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
            </Modal>
      </ImageBackground>
    )
}

export default Program

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    container: {
      flex: 1,
    //   backgroundColor: '#b0b0b071',
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

    bodyContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    tabContainer: {
        width: width * 0.3,
        // paddingVertical: 10,
    },
    flatlistContainer:{
        flexGrow: 1,
        justifyContent: 'center',
        // gap: 20
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
    },
    activeTabButton: {
        // backgroundColor: '#07a751'
    },
    inactiveTabButton: {
        // backgroundColor: '#ffffffc3',
    },
    tabText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
        textAlign: 'center'
    },
    activeTabText: {
        color: '#ffffff'
    },
    inactiveTabText: {
        color: '#b8b8b8',
    },

    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        
    },
    contentContainer: {
        marginVertical: 'auto',
        paddingHorizontal: 20,
    },
    contentInner:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        borderWidth: 4,
        borderRadius: 20,
        minHeight: 400,
    },
    column: {
        width: '45%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        marginBottom: 4,
        color: 'white'
    },
    paragraph: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'justify',
        color: 'white'
    },

    navButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10
    },
    navButtonImage: {
        width: 50,
        height: 50
    },
    cardContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
      },
    
      backCard: {
        position: 'absolute',
        width: width * 0.3,
        height: 400,
        backgroundColor: '#3dc88c',
        borderRadius: 16,
        zIndex: 0
      },
    
      frontCard: {
        width: width * 0.3,
        height: 400,
        backgroundColor: '#257b3e',
        borderRadius: 16,
        paddingHorizontal: 30,
        // paddingVertical: 60,
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
      modalLabel: {
        fontFamily: 'Poppins-SemiBold',
      },
      modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20
      },
      actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
      },
      
      cancelButton: {
        backgroundColor: '#eee',
      },
      
      saveButton: {
        backgroundColor: '#257b3e',
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