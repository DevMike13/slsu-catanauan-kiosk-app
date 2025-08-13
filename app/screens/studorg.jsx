import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const { width } = Dimensions.get('window');

const tabList = [
    'Supreme Student Council', 
    'Campus Emergency Response Team', 
    'Canislatran', 
    'Commission on Election',
    'Indayaw Dance Troupe',
    'Reserve Officers Training Corps'
];

const Studorg = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(tabList[0]);
    
    const renderContent = () => {
      if (activeTab === 'Supreme Student Council') {
        return (
          <View style={styles.contentContainer}>
              <Image 
                  source={images.studentCouncil}
                  style={styles.contentImage}
                  resizeMode='contain'
              />
          </View>
        );
      }
  
      if (activeTab === 'Campus Emergency Response Team') {
        return (
          <View style={styles.contentContainer}>
              <Image 
                  source={images.emergencyTeam}
                  style={styles.contentImage}
                  resizeMode='contain'
              />
          </View>
        );
      }
  
      if (activeTab === 'Canislatran') {
          return (
            <View style={styles.contentContainer}>
                <Image 
                    source={images.placeholderImage}
                    style={styles.contentImage}
                    resizeMode='contain'
                />
            </View>
          );
      }

      if (activeTab === 'Commission on Election') {
        return (
          <View style={styles.contentContainer}>
            
          </View>
        );
    }

    if (activeTab === 'Indayaw Dance Troupe') {
        return (
          <View style={styles.contentContainer}>
            
          </View>
        );
    }

    if (activeTab === 'Reserve Officers Training Corps') {
        return (
          <View style={styles.contentContainer}>
            
          </View>
        );
    }
  
      return null;
    };
    return (
      <ImageBackground
          source={images.background}
          style={styles.background}
          resizeMode="cover"
      >
          
          <SafeAreaView style={styles.container}>
              <View style={styles.headerContainer}>
                  <Image 
                      source={images.mainLogo}
                      style={styles.imageLogo}
                      resizeMode='contain'
                  />
                  <Text style={styles.headerText}>STUDENT ORGANIZATIONS</Text>
                  <Image 
                      source={images.mainLogo}
                      style={styles.imageLogo}
                      resizeMode='contain'
                  />
              </View>
              <View style={styles.bodyContainer}>
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
                                      ? ['#07a751', '#8DC63F']
                                      : ['#ffffffbb', '#ffffff58']
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
  
                  <ScrollView style={styles.contentWrapper} contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                      {renderContent()}
                  </ScrollView>
              </View>
          </SafeAreaView>
          <TouchableOpacity 
              style={styles.navButtonContainer}
              onPress={() => router.back()}
          >
              <Image 
                  source={images.backIcon}
                  style={styles.navButtonImage}
                  resizeMode='contain'
              />
          </TouchableOpacity>
      </ImageBackground>
    )
}

export default Studorg

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 20,
    },
  
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 50,
      paddingVertical: 8
    },
    imageLogo: {
      width: 80,
      height: 80
    },
    headerText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 50,
      marginBottom: -12
    },

    bodyContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    tabContainer: {
        width: width * 0.3,
        paddingVertical: 10,
    },
    flatlistContainer:{
        flexGrow: 1,
        justifyContent: 'center',
        gap: 20
    },
    tabButton: {
        paddingVertical: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    activeTabButton: {
        backgroundColor: '#07a751'
    },
    inactiveTabButton: {
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    tabText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        textAlign: 'center'
    },
    activeTabText: {
        color: '#fff'
    },
    inactiveTabText: {
        color: '#000'
    },

    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    contentImage: {
        width: '100%',
        height: '100%',
    },


    navButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10
    },
    navButtonImage: {
        width: 50,
        height: 50
    }
});