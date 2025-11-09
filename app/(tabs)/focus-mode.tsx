import { useLocalSearchParams, Stack, router } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { X, Play, Pause, SkipForward, SkipBack, Repeat, Music } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { Snowfall } from "@/components/Snowfall";

export default function FocusModeScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const duration = parseInt(params.duration as string) || 25;
  
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [repeat, setRepeat] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExit = () => {
    router.back();
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    if (timeLeft > 0) {
      setIsActive(true);
    }
  };

  const openSpotify = () => {
    const spotifyUrl = Platform.select({
      ios: "spotify://",
      android: "spotify://",
      default: "https://open.spotify.com",
    });
    Linking.canOpenURL(spotifyUrl).then((supported) => {
      if (supported) {
        Linking.openURL(spotifyUrl);
      } else {
        Linking.openURL("https://open.spotify.com");
      }
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Snowfall count={60} color="#ffffff" />
        
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
              <X color="#ffffff" size={28} />
            </TouchableOpacity>

            <View style={styles.timerSection}>
              <Text style={styles.focusLabel}>Focus Mode</Text>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.remainingLabel}>
                {timeLeft === 0 ? "Session Complete!" : "Time Remaining"}
              </Text>
            </View>

            <View style={styles.controlsSection}>
              <View style={styles.playbackControls}>
                {isActive && timeLeft > 0 ? (
                  <TouchableOpacity style={styles.mainControl} onPress={handlePause}>
                    <Pause color="#ffffff" size={32} fill="#ffffff" />
                  </TouchableOpacity>
                ) : timeLeft > 0 ? (
                  <TouchableOpacity style={styles.mainControl} onPress={handleResume}>
                    <Play color="#ffffff" size={32} fill="#ffffff" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <View style={styles.spotifySection}>
              <Text style={styles.spotifyLabel}>Music Controls</Text>
              <TouchableOpacity style={styles.spotifyButton} onPress={openSpotify}>
                <Music color="#1DB954" size={24} />
                <Text style={styles.spotifyButtonText}>Open Spotify</Text>
              </TouchableOpacity>

              <View style={styles.musicControls}>
                <TouchableOpacity style={styles.musicControl}>
                  <SkipBack color="#ffffff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.musicControl, repeat && styles.musicControlActive]}
                  onPress={() => setRepeat(!repeat)}
                >
                  <Repeat color="#ffffff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.musicControl}>
                  <SkipForward color="#ffffff" size={24} />
                </TouchableOpacity>
              </View>

              <Text style={styles.musicNote}>
                Music controls work with Spotify app running in background
              </Text>
            </View>
          </View>
        </BlurView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  blurContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  exitButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  timerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  focusLabel: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "700" as const,
    color: "#ffffff",
    letterSpacing: 4,
  },
  remainingLabel: {
    fontSize: 16,
    color: "#999999",
    marginTop: 12,
  },
  controlsSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  playbackControls: {
    alignItems: "center",
  },
  mainControl: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  spotifySection: {
    alignItems: "center",
    gap: 16,
  },
  spotifyLabel: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  spotifyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(29, 185, 84, 0.15)",
    borderWidth: 1,
    borderColor: "#1DB954",
  },
  spotifyButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1DB954",
  },
  musicControls: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  musicControl: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  musicControlActive: {
    backgroundColor: "#1DB954",
  },
  musicNote: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
  },
});
