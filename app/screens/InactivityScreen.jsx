import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  AppState,
  ActivityIndicator,
  Keyboard,
  TextInput,
  TextInputState,
} from "react-native";
import { useRouter } from "expo-router";
import { ref, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { storage } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export default function InactivityWrapper({ children }) {
  const [inactive, setInactive] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const timeoutRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  const clearUser = useAuthStore((state) => state.clearUser);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInactive(false);
    timeoutRef.current = setTimeout(
      () => setInactive(true),
      INACTIVITY_TIMEOUT
    );
  };

  useEffect(() => {
    resetTimer();

    const fetchVideo = async () => {
      try {
        const videoRef = ref(storage, "videos/ScreenSaver.mp4");
        const url = await getDownloadURL(videoRef);
        setVideoUrl(url);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();

    // Reset when app comes foreground
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        resetTimer();
      }
      appState.current = nextAppState;
    });

    // Reset on keyboard events
    const keyboardShow = Keyboard.addListener("keyboardDidShow", resetTimer);
    const keyboardHide = Keyboard.addListener("keyboardDidHide", resetTimer);

    // 👇 Poll active text input (detect typing)
    const typingInterval = setInterval(() => {
      const currentlyFocused = TextInput.State.currentlyFocusedInput
        ? TextInput.State.currentlyFocusedInput()
        : TextInputState.currentlyFocusedField?.();
      if (currentlyFocused) {
        resetTimer();
      }
    }, 500); // check twice a second

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      subscription.remove();
      keyboardShow.remove();
      keyboardHide.remove();
      clearInterval(typingInterval);
    };
  }, []);

  if (inactive) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          clearUser();
          resetTimer();
          router.replace("/");
        }}
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          {videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={{ flex: 1 }}
              resizeMode="cover"
              shouldPlay
              isLooping
              isMuted={true}
            />
          ) : (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ flex: 1, justifyContent: "center" }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={{ flex: 1 }} onTouchStart={resetTimer}>
      {children}
    </View>
  );
}
