import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, 
  BackHandler, NativeModules, Alert, Dimensions, ScrollView, FlatList
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
const { RNExitApp } = NativeModules;
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../store/useAuthStore';
import { images } from '../../constants';

const { width } = Dimensions.get('window');

// Breakpoints for scaling
const isSmallScreen = width < 380;
const isTablet = width > 768;

import Campus from './campus';
import History from './history';
import About from './about';
import Orgchart from './orgchart';
import Program from './program';
import Calendar from './calendar';
import Studorg from './studorg';
import Events from './events';
import Attire from './attire';
import Enrollment from './enrollment';

const tabs = [
  { label: 'Campus Map', key: 'map', icon: 'location-outline' },
  { label: 'History', key: 'history', icon: 'book-outline' },
  { label: 'SLSU VMGO', key: 'about', icon: 'information-circle-outline' },
  { label: 'Organizational Chart', key: 'orgchart', icon: 'people-outline' },
  { label: 'Program Offered', key: 'program', icon: 'school-outline' },
  { label: 'SLSU Calendar', key: 'calendar', icon: 'calendar-outline' },
  { label: 'Student Organizations', key: 'studorg', icon: 'people-circle-outline' },
  { label: 'University Events', key: 'events', icon: 'volume-high-outline' },
  { label: 'Enrollment Summary', key: 'enroll', icon: 'analytics-outline' },
  { label: 'Prescribed Attire', key: 'attire', icon: 'shirt-outline' },
];

const Main = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              const { clearUser } = useAuthStore.getState();
              clearUser();
              router.replace('/');
              if (RNExitApp?.exitApp) {
                RNExitApp.exitApp();
              } else {
                BackHandler.exitApp();
              }
            },
          },
        ],
        { cancelable: true }
      );
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);  


  const renderButton = ({ item, index }) => {
    const isActive = activeIndex === index;
  
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.navButtonWrapper}
        onPress={() => setActiveIndex(index)}
      >
        <LinearGradient
          colors={isActive ? ['#8DC63F', '#07a751'] : ['#07a751', '#8DC63F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.navButton, isActive && styles.activeButton]}
        >
          <Ionicons 
            name={item.icon} 
            size={46}           // bigger icon
            color={isActive ? '#fff' : '#000'} 
          />
          <Text 
            style={[
              styles.navButtonText, 
              isActive && styles.activeButtonText
            ]}
            numberOfLines={2}
          >
            {item.label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  

  const renderContent = () => {
    const activeTab = tabs[activeIndex].key;
    switch (activeTab) {
      case 'map':
        return <Campus />;
      case 'history':
        return <History />;
      case 'about':
        return <About />;
      case 'orgchart':
        return <Orgchart />;
      case 'program':
        return <Program />;
      case 'calendar':
        return <Calendar />;
      case 'studorg':
        return <Studorg />;
      case 'events':
        return <Events />;
      case 'enroll':
        return <Enrollment />;
      case 'attire':
        return <Attire />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={images.background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image 
            source={images.mainLogo}
            style={styles.imageLogo}
            resizeMode='contain'
          />
          <Text style={styles.headerText}>SCHOOL FEATURES</Text>
        </View>

        {/* Content */}
        <View style={styles.scrollArea}>
          {renderContent()}
        </View>

        {/* Bottom horizontal nav buttons */}
        <View style={styles.bottomBar}>
          <View style={styles.navWrapper}>
            {/* Left Chevron (no function) */}
            <View style={[styles.chevron, { left: 0 }]}>
              <Ionicons name="chevron-back" size={40} color="#fff" />
            </View>

            <FlatList
              data={tabs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderButton}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.navList}
            />

            {/* Right Chevron (no function) */}
            <View style={[styles.chevron, { right: 0 }]}>
              <Ionicons name="chevron-forward" size={40} color="#fff" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Main;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    // padding: 10,
    paddingHorizontal: 20
  },
  imageLogo: {
    width: 100,
    height: 100
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: width * 0.04,
    color: '#fff'
  },
  scrollArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -30
  },
  contentText: {
    color: '#fff',
    fontSize: isTablet ? 20 : 16,
    lineHeight: 24
  },

  bottomBar: {
    paddingVertical: 12,
    // backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navList: {
    paddingHorizontal: 10,
    gap: 10,
  },
  navButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 6,
  },
  navWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  chevron: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 6,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    zIndex: 10,
  },
  
  navButton: {
    width: 120,         // bigger square
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 6
  },
  
  navButtonText: {
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  
  activeButton: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#fff',
  },
  
  activeButtonText: {
    color: '#fff',
  },
  
  
});
