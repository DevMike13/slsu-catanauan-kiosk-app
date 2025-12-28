import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { firestoreDB } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';

import {
  initAccountsDB,
  fetchPendingUsers,
  fetchApprovedUsers,
  approveUser,
  rejectUser,
} from '../../database/accounts';

const { width } = Dimensions.get('window');

const Accounts = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);

  // ✅ Fetch users in realtime (exclude super-admin)
  useEffect(() => {
    const init = async () => {
      await initAccountsDB();
      await loadUsers();
    };
    init();
  }, []);
  
  const loadUsers = async () => {
    const pending = await fetchPendingUsers();
    const approved = await fetchApprovedUsers();
    setPendingUsers(pending);
    setApprovedUsers(approved);
  };

  const handleApprove = (id) => {
    Alert.alert('Approve User', 'Approve this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          await approveUser(id);
          loadUsers();
        },
      },
    ]);
  };

  const handleReject = (id) => {
    Alert.alert('Reject User', 'Reject this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          await rejectUser(id);
          loadUsers();
        },
      },
    ]);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  // ✅ Only super-admin can access
  if (user?.role !== 'super-admin') {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <Text style={{ color: '#333', fontSize: 16 }}>Access Denied</Text>
      </View>
    );
  }

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      {(user?.role === 'admin' || user?.role === 'super-admin') && (
        <View style={styles.funtionButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={32} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <SafeAreaView style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.backCard} />
          <View style={styles.frontCard}>
            <View style={styles.innerCard}>
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Pending Users */}
                <Text style={styles.sectionTitle}>Pending Approvals</Text>

                {pendingUsers.length === 0 && (
                  <Text style={styles.noEventText}>No pending users</Text>
                )}

                {pendingUsers.map((u) => (
                  <View key={u.id} style={styles.userItem}>
                    <View>
                      <Text style={styles.userName}>{u.fullName || u.username}</Text>
                      <Text style={styles.userEmail}>{u.email}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleApprove(u.id)}
                      >
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleReject(u.id)}
                      >
                        <Ionicons name="close" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Approved Users */}
                <Text style={styles.sectionTitle}>Approved Users</Text>

                {approvedUsers.length === 0 && (
                  <Text style={styles.noEventText}>No approved users yet</Text>
                )}

                {approvedUsers.map((u) => (
                  <View
                    key={u.id}
                    style={[styles.userItem, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                  >
                    <View>
                      <Text style={styles.userName}>{u.fullName || u.username}</Text>
                      <Text style={styles.userEmail}>{u.email}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Accounts;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    zIndex: 0,
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
    overflow: 'hidden',
  },
  innerCard: {
    flex: 1,
    transform: [{ rotate: '10deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: { flex: 1, width: '100%' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 20,
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
    gap: 20,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  userItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  userEmail: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
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
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#2e7d32',
  },
  rejectButton: {
    backgroundColor: '#e53935',
  },
});
