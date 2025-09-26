import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, ScrollView, 
  Dimensions, TextInput, Modal, TouchableOpacity, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import { firestoreDB } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '../../store/useAuthStore';

const { width } = Dimensions.get('window');
import { images } from '../../constants';

const tabList = [
  'Bachelor of Elementary Education Major in General Education', 
  'Bachelor of Industrial Technology Major in Computer Technology', 
  'Bachelor of Industrial Technology Major in Mechanical Technology',
  'Bachelor of Science in Agriculture Major in Crop Science'
];

const SemiCircle = ({ value, max = 100, color, label }) => {
  const radius = 50;
  const strokeWidth = 20;
  const center = radius + strokeWidth;
  const circumference = Math.PI * radius;

  const percentage = Math.min(value / max, 1);
  const arcLength = circumference * percentage;
  const dashArray = `${arcLength}, ${circumference}`;

  return (
    <View style={{ alignItems: "center", margin: 6 }}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius + strokeWidth * 2}
        viewBox={`0 0 ${center * 2} ${center}`}
      >
        {/* Background arc */}
        <Path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${
            center * 2 - strokeWidth
          } ${center}`}
          stroke="#ccc"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress arc */}
        <Path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${
            center * 2 - strokeWidth
          } ${center}`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={dashArray}
        />
      </Svg>
      <Text style={{ fontWeight: "bold", color: "white" }}>{value}</Text>
      <Text style={{ color: "white" }}>{label}</Text>
    </View>
  );
};

const Enrollment = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [enrollmentData, setEnrollmentData] = useState({});
  const [tempData, setTempData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Fetch data
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const ref = doc(firestoreDB, "enrollment", activeTab);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setEnrollmentData(snap.data());
        } else {
          const initialData = {
            name: activeTab,
            yearStats: [
              { year: "1st Year", male: 0, female: 0 },
              { year: "2nd Year", male: 0, female: 0 },
              { year: "3rd Year", male: 0, female: 0 },
              { year: "4th Year", male: 0, female: 0 },
            ],
          };
          setEnrollmentData(initialData);
        }
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetchEnrollment();
  }, [activeTab]);

  const openYearEditor = (programName, year) => {
    const yearData = enrollmentData?.yearStats?.find((y) => y.year === year);
    setTempData({
      programName,
      year,
      male: yearData?.male ?? 0,
      female: yearData?.female ?? 0,
    });
    setModalVisible(true);
  };

  const saveData = async () => {
    try {
      const updated = { ...enrollmentData };
      updated.yearStats = updated.yearStats.map((y) =>
        y.year === tempData.year
          ? { ...y, male: tempData.male, female: tempData.female }
          : y
      );
      await setDoc(doc(firestoreDB, "enrollment", activeTab), updated);
      setEnrollmentData(updated);
      setModalVisible(false);
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  const renderYearBlock = (yearIndex, yearLabel) => {
    const male = enrollmentData?.yearStats?.[yearIndex]?.male ?? 0;
    const female = enrollmentData?.yearStats?.[yearIndex]?.female ?? 0;

    return (
      <View style={styles.column}>
        <Text style={styles.heading}>{yearLabel}</Text>
        <View style={{ flexDirection: "row" }}>
          <SemiCircle value={female} color="#ff6ec7" label="Female" />
          <SemiCircle value={male} color="#4facfe" label="Male" />
        </View>
        {user?.role === "admin" && (
          <TouchableOpacity
            style={styles.yearEditButton}
            onPress={() => openYearEditor(activeTab, yearLabel)}
          >
            <Ionicons name="create" size={20} color="#257b3e" />
            <Text style={styles.yearEditText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          {/* Sidebar tabs */}
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
                        style={{ marginBottom: 10, borderRadius: 8, overflow: "hidden" }}
                      >
                        <LinearGradient
                          colors={["transparent", "transparent"]}
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
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              // paddingBottom: 20,
              // backgroundColor: 'green'
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              <View style={styles.section}>
                {renderYearBlock(0, "1st Year")}
                {renderYearBlock(1, "2nd Year")}
              </View>
              <View style={styles.section}>
                {renderYearBlock(2, "3rd Year")}
                {renderYearBlock(3, "4th Year")}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Modal for editing */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Edit {tempData?.year} ({activeTab})
            </Text>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 10, fontFamily: 'Poppins-SemiBold'}}>Male</Text>
              <TextInput
                style={styles.modalInput}
                value={String(tempData?.male ?? 0)}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setTempData({ ...tempData, male: parseInt(text) || 0 })
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 10, fontFamily: 'Poppins-SemiBold'}}>Female</Text>
              <TextInput
                style={styles.modalInput}
                value={String(tempData?.female ?? 0)}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setTempData({ ...tempData, female: parseInt(text) || 0 })
                }
              />
            </View>

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
                onPress={saveData}
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

export default Enrollment;

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
      // paddingHorizontal: 20,
      backgroundColor: '#257b3d59',
      borderRadius: 20
  },
  contentInner:{
      flexDirection: 'col',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      borderWidth: 4,
      borderRadius: 20,
      minHeight: 400,
  },
  section:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  column: {
      width: '45%',
      paddingHorizontal: 10,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20
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
  
    yearEditButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 6,
      borderRadius: 8
    },
  
    yearEditText: {
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
      fontWeight: '600', 
      fontSize: 16, 
      color: 'white', 
      fontFamily: 'Poppins-SemiBold'
    },
    
    cancelText: {
      color: '#333',
    },
});