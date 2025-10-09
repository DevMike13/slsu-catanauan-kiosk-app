import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions, TextInput, Button, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestoreDB } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
import { images } from '../../constants';

const Events = () => {
  const router = useRouter();

  const { user, clearUser } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState('');
  
  useEffect(() => {
    const unsub = onSnapshot(collection(firestoreDB, 'events'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    });
    return () => unsub();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.trim()) return;
    await addDoc(collection(firestoreDB, 'events'), {
      title: newEvent,
      createdAt: new Date(),
    });
    setNewEvent('');
    setModalVisible(false);
  };

  const confirmDeleteEvent = (id) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteEvent(id) }
      ]
    );
  };

  const handleDeleteEvent = async (id) => {
    await deleteDoc(doc(firestoreDB, 'events', id));
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
            onPress={() => setModalVisible(true)}
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
                {events.map((event) => (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={styles.eventInfo}>
                      <Ionicons name="star-half" size={24} color="#ffff" style={styles.pinIcon} />
                      <Text style={styles.eventText}>{event.title}</Text>
                    </View>
                    {user && user.role === 'admin' && (
                      <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={() => confirmDeleteEvent(event.id)}
                      >
                        <Ionicons name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {events.length === 0 && (
                  <Text style={styles.noEventText}>No events yet</Text>
                )}

              </ScrollView>
            </View>
          </View>
        </View>
        {/* Add Event Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add New Event</Text>
              <TextInput
                placeholder="Enter event title"
                value={newEvent}
                onChangeText={setNewEvent}
                style={styles.modalInput}
                placeholderTextColor="#888"
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
                  onPress={handleAddEvent}
                >
                  <Ionicons name="save" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Events

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
      backgroundColor: '#257b3e',
      borderRadius: 16,
      zIndex: 0
    },
  
    frontCard: {
      width: width * 0.5,
      height: 450,
      backgroundColor: 'transparent',
      borderRadius: 16,
      paddingHorizontal: 30,
      paddingVertical: 60,
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
      gap: 20
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
      padding: 10,
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
      // height: 100, 
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
    eventItem: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 12,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    eventText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: "Poppins-SemiBold"
    },
  
    noEventText: {
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
    },
    deleteButton: {
      backgroundColor: '#e53935',    // red
      padding: 8,
      borderRadius: 50,               // fully rounded
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 50
    },
    eventInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
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
  });