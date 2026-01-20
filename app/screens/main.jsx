import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, 
  BackHandler, NativeModules, Alert, Dimensions, ScrollView, FlatList,
  Animated, Pressable
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
const { RNExitApp } = NativeModules;
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../store/useAuthStore';
import { images } from '../../constants';

const { width, height } = Dimensions.get('window');

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
import Overlay from './overlay';
import Accounts from './accounts';

const tabs = [
  { label: 'Campus Map', key: 'map', icon: 'pin' },
  { label: 'History if SLSU Catanauan', key: 'history', icon: 'history' },
  { label: 'SLSU VMGO', key: 'about', icon: 'vmgo' },
  { label: 'Organizational Chart', key: 'orgchart', icon: 'org' },
  { label: 'Program Offered', key: 'program', icon: 'program' },
  { label: 'SLSU Calendar', key: 'calendar', icon: 'calendar' },
  { label: 'Student Organizations', key: 'studorg', icon: 'org' },
  { label: 'University Events & Announcements', key: 'events', icon: 'events' },
  { label: 'Enrollment Summary', key: 'enroll', icon: 'summary' },
  { label: 'Prescribed Attire', key: 'attire', icon: 'attire' }
];

const adminTabs = [
  { label: 'Overlay Video', key: 'overlay', icon: 'videocam-outline' },
];

const superAdminTabs = [
  { label: 'Admin Controls', key: 'superadmin', icon: 'settings-outline' },
];

const navHeight = 120;

const Main = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const translateY = useRef(new Animated.Value(navHeight)).current;
  const [lastTap, setLastTap] = useState(0);
  const hideTimeout = useRef(null);
  
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      toggleNav();
    } else {
      setLastTap(now);
    }
  };

  const scheduleAutoHide = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  
    hideTimeout.current = setTimeout(() => {
      Animated.spring(translateY, {
        toValue: navHeight,
        useNativeDriver: true,
      }).start();
    }, 5000); // 5 seconds
  };

  const toggleNav = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    scheduleAutoHide();
  };

  useEffect(() => {
    // Cleanup timeout when component unmounts
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

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
              const { logout  } = useAuthStore.getState();
              logout ();
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

  const handleLogout = () => {
    logout();         
    router.replace("/");
  };

  const renderButton = ({ item, index }) => {
    const isActive = activeIndex === index;
  
    return (
      <Pressable
        activeOpacity={0.8}
        style={styles.navButtonWrapper}
        onPress={() => {
          setActiveIndex(index);
          scheduleAutoHide();
        }}
      >
        <LinearGradient
          colors={isActive ? ['#465037', '#465037'] : ['#465037', '#465037']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.navButton, isActive ? styles.activeButton : styles.inactiveButton]}
        >
          {['overlay', 'superadmin'].includes(item.key) ? (
            <Ionicons 
              name={item.icon} 
              size={40}           // bigger icon
              color='#fff'
              style={{ marginBottom: -10}}
            />
          ) : (
            <Image 
              source={images[item.icon]}
              style={[
                styles.imgIcon,
                item.key === 'program' && { width: 55, height: 55 },
                item.key === 'history' && { width: 65, height: 65 },
              ]}
              resizeMode='contain'
            />
          )}
        
          <Text 
            style={[
              styles.navButtonText, 
              isActive && styles.activeButtonText,
              item.key === 'orgchart' && styles.orgChartText,
              item.key === 'program' && { fontSize: 12, marginTop: -10},
              item.key === 'history' && { fontSize: 12, marginTop: -10},
              item.key === 'calendar' && { fontSize: 12},
              item.key === 'studorg' && { fontSize: 12},
              item.key === 'events' && { fontSize: 9},
              item.key === 'enroll' && { fontSize: 12},
              item.key === 'attire' && { fontSize: 13, marginTop: -10},
            ]}
            numberOfLines={2}
          >
            {item.label}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  };
  
  

  const renderContent = () => {
    let allTabs = [...tabs];
  
    if (user?.role === 'admin') {
      allTabs = [...tabs, ...adminTabs];
    } else if (user?.role === 'super-admin') {
      allTabs = [...tabs, ...adminTabs, ...superAdminTabs];
    }
  
    const activeTab = allTabs[activeIndex]?.key;
  
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
      case 'overlay':
        return <Overlay />;
      case 'superadmin':
        return <Accounts />;
      default:
        return null;
    }
  };
  

  return (
    <ImageBackground
      source={images.newBG}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image 
            source={images.mainLogo}
            style={styles.imageLogo}
            resizeMode='contain'
          />
          <Text style={styles.headerText}>SLSU CATANAUAN</Text>
          
          {user?.role !== 'admin' && user?.role !== 'super-admin' && (
            <Pressable 
              style={{ marginLeft: 'auto', width: 40, height: 40, zIndex: 99 }}
              onPress={handleLogout}
            >
              <Image 
                source={images.backIcon}
                style={{ width: 40, height: 40 }}
                resizeMode='contain'
              />
            </Pressable>
          )}
        </View>

        {/* Content */}
        <Pressable style={{ flex: 1 }} onPress={handleDoubleTap}>
          <View style={styles.scrollArea}>
            {renderContent()}
          </View>
        </Pressable>

        {/* <Pressable
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 20,
              backgroundColor: 'transparent',
            },
          ]}
          onPress={handleDoubleTap}
        /> */}

        {/* Bottom horizontal nav buttons */}
        <Animated.View
          style={[
            styles.bottomBar,
            {
              transform: [{ translateY }], 
            },
          ]}
        >
          <View style={styles.navWrapper}>
            
            <View style={[styles.chevron, { left: 0 }]}>
              <Ionicons name="chevron-back" size={40} color="#fff" />
            </View>

            <View
              onTouchStart={scheduleAutoHide}
              onTouchMove={scheduleAutoHide}
            >
              <FlatList
                data={
                  user?.role === 'super-admin'
                    ? [...tabs, ...adminTabs, ...superAdminTabs]
                    : user?.role === 'admin'
                    ? [...tabs, ...adminTabs]
                    : tabs
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderButton}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.navList}
              />
            </View>
            
            <View style={[styles.chevron, { right: 0 }]}>
              <Ionicons name="chevron-forward" size={40} color="#fff" />
            </View>
          </View>
        </Animated.View>
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
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: width * 0.04,
    // paddingVertical: height * 0.02,
  },
  imageLogo: {
    width: 80,
    height: 80
  },
  headerText: {
    fontFamily: 'Arial-Bold-1',
    fontSize: 40,
    color: '#284615',
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
    position: 'absolute',
    bottom: 0
  },
  navList: {
    paddingHorizontal: 10,
    gap: 10,
  },
  navButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 2,
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
    width: 110,         // bigger square
    height: 90,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 6
  },
  
  navButtonText: {
    color: '#fff',
    fontFamily: 'Arial-Bold-1',
    fontSize: 14,
    textAlign: 'center',
  },
  
  activeButton: {
    // borderWidth: 2,
    borderRadius: 30,
    // borderColor: '#fff',
  },

  inactiveButton: {
    opacity: 0.5,
  },

  activeButtonText: {
    color: '#fff',
  },
  
  // NEW STYLES
  orgChartText:{
    color: '#fff',
    fontFamily: 'Arial-Bold-1',
    fontSize: 12,
    textAlign: 'center',
  },
  imgIcon:{
    width: 40,
    height: 40
  }
});
