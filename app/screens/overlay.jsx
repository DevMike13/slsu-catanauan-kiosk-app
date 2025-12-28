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

import { initOverlayDB, fetchOverlayVideo, upsertOverlayVideo, saveVideoLocally } from '../../database/overlay';

const Overlay = () => {
    const [videoUri, setVideoUri] = useState(null);
    const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore(); // ✅ get user role
  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  useEffect(() => {
    const init = async () => {
      await initOverlayDB();
      const row = await fetchOverlayVideo();
      if (row) setVideoUri(row.fileUri);
    };
    init();
  }, []);

  const pickAndSaveVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "video/*", copyToCacheDirectory: true });
      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const localUri = await saveVideoLocally(file.uri);
      await upsertOverlayVideo(localUri);

      setVideoUri(localUri);
      setUploading(false);
      alert("Overlay video updated!");
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Upload failed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overlay Video</Text>

      {uploading && <ActivityIndicator size="large" color="blue" />}

        {videoUri ? (
            <Video
                source={{ uri: videoUri }}
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
            <TouchableOpacity style={styles.editButton} onPress={pickAndSaveVideo}>
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
