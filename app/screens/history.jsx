import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { images } from '../../constants';

const { width } = Dimensions.get('window');

const History = () => {
  const router = useRouter();

  return (
    <ImageBackground
      // source={images.background}
      style={styles.background}
      resizeMode="cover"
    >
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
            </View>
          </View>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

export default History;

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
  
  contentText: {
    width: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  
});
