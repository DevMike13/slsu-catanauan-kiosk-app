import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


import { images } from '../../constants';

const History = () => {
  const router = useRouter();
  
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
            <Text style={styles.headerText}>HISTORY OF SLSU</Text>
            <Image 
            source={images.mainLogo}
            style={styles.imageLogo}
            resizeMode='contain'
            />
        </View>
        <ScrollView 
          style={styles.scrollArea} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.contentText}>
            The Southern Luzon State University (SLSU) Catanauan campus is one of
            the extension campuses of SLSU, which originated from the Lucban
            Municipal Junior High School in 1964. While the main campus is in
            Lucban, Quezon, SLSU has expanded to include several satellite campuses,
            including Catanauan. The university's history is rooted in the vision of
            providing quality education and contributing to the development of Quezon
            province and the CALABARZON region.
          </Text>
          <Text style={styles.contentText}>
            It was June 2011 when SLSU Catanauan Extension was instituted thru the
            strong determination of the former SLSU University President, Dr. Cecilia
            N. Gascon. The establishment of the campus was made in collaboration
            with the former Quezon Governor, now Congressman David C. Suarez,
            Catanauan Mayor Atty. Ramon Orfanel and Sangguniang Bayan. The
            school was initially located in Luna cor. Mabini Sts. in the town proper of
            Catanauan, Quezon. It was originally designed to provide extension classes
            for agriculture, education, and technology programs.
          </Text>
        </ScrollView>
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

export default History

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
      fontSize: 70,
      marginBottom: -12
    },

    scrollArea: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 100,
      paddingBottom: 20,
      gap: 20
    },
    contentText:{
      fontFamily: 'Poppins-Regular',
      fontSize: 20,
      color: 'white',
      textAlign: 'center'
    },

    navButtonContainer:{
      position: 'absolute',
      bottom: 10,
      left: 10
    },
    navButtonImage: {
      width: 50,
      height: 50
    }
});