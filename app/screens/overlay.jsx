import React, { useEffect, useState } from "react";
import { 
  View, 
  ActivityIndicator, 
  Button, 
  Alert, 
  Text, 
  StyleSheet ,
  TouchableOpacity 
} from "react-native";
import { Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { MaterialIcons } from "@expo/vector-icons";

const Overlay = () => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore(); // ✅ get user role
  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoRef = ref(storage, "videos/ScreenSaver.mp4");
        const url = await getDownloadURL(videoRef);
        setVideoUrl(url);
      } catch (error) {
        console.log("No overlay video found yet:", error.message);
      }
    };
    fetchVideo();
  }, []);

  const pickAndUploadVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const storageRef = ref(storage, "videos/ScreenSaver.mp4"); // overwrite same file
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          Alert.alert("Error", "Upload failed. Please try again.");
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setVideoUrl(url);
          setUploading(false);
          Alert.alert("Success", "Overlay video updated!");
        }
      );
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overlay Video</Text>

      {uploading && <ActivityIndicator size="large" color="blue" />}

        {videoUrl ? (
            <Video
                source={{ uri: videoUrl }}
                resizeMode="cover" 
                shouldPlay
                isLooping               
                useNativeControls
                usePoster={true} 
                isMuted={true}
                style={styles.video}
            />
            ) : (
            <Text
                style={{
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
                }}
            >
                No overlay video found
            </Text>
        )}


        {isAdmin && (
            <TouchableOpacity style={styles.editButton} onPress={pickAndUploadVideo}>
                <MaterialIcons name="edit" size={20} color="#257b3e" />
                <Text style={styles.editText}> Edit Overlay Video</Text>
            </TouchableOpacity>
        )}
    </View>
  );
};

export default Overlay;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    title: {
      fontSize: 18,
      marginBottom: 12,
      fontFamily: 'Poppins-Bold',
    },
    video: {
        width: 500,
        height: 250,
        backgroundColor: "#000",
        marginBottom: 20,
        borderRadius: 20
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
      },
    editText: {
        color: '#257b3e', 
        fontFamily: 'Poppins-Bold',
        marginLeft: 6,
    },
  });
