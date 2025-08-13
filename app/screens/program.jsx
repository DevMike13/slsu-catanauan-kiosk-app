import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


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
    const [activeTab, setActiveTab] = useState(tabList[0]);
    
    const renderContent = () => {
      if (activeTab === 'Bachelor of Elementary Education Major in General Education') {
        return (
          <View style={styles.contentContainer}>
            <View style={styles.contentInner}>
                <View style={styles.column}>
                    <Text style={styles.heading}>Proposed Objectives</Text>
                    <Text style={styles.paragraph}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.heading}>Proposed Goals</Text>
                    <Text style={styles.paragraph}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
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
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Goals</Text>
                        <Text style={styles.paragraph}>
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
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
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Goals</Text>
                        <Text style={styles.paragraph}>
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
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
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.heading}>Proposed Goals</Text>
                        <Text style={styles.paragraph}>
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
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
                  <Text style={styles.headerText}>PROGRAM OFFERED</Text>
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
  
                  <ScrollView style={styles.contentWrapper} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
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
      backgroundColor: '#b0b0b071',
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
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
    },
    activeTabButton: {
        backgroundColor: '#07a751'
    },
    inactiveTabButton: {
        backgroundColor: '#ffffffc3',
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
        color: '#000',
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
    },
    paragraph: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'justify',
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