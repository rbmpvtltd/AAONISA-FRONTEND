import { useAppTheme } from "@/src/constants/themeHelper";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

import {
  Animated,
  Dimensions,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  onReport: () => void;
  onDelete?: () => void; // NEW: Optional delete callback
  reelUrl: string;
  reelId: string;
  isOwner?: boolean; // NEW: Flag to check if current user is owner
}


const BottomDrawer = ({ visible, onClose, onSave, onReport, onDelete, reelUrl, reelId, isOwner = false }: any) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const theme = useAppTheme();
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [downloading, setDownloading] = useState(false);



  const availablePlatforms = [
    { name: 'WhatsApp', urlScheme: 'whatsapp://send?text=', color: '#25D366', icon: 'logo-whatsapp' },
    { name: 'Telegram', urlScheme: 'tg://msg?text=', color: '#229ED9', icon: 'send-outline' },
    { name: 'Facebook', urlScheme: 'fb://facewebmodal/f?href=', color: '#1877F2', icon: 'logo-facebook' },
    { name: 'Instagram', urlScheme: 'instagram://share?text=', color: '#C13584', icon: 'logo-instagram' },
  ];

  const [activePlatforms, setActivePlatforms] = useState<any[]>([]);
  useEffect(() => {
    const checkApps = async () => {
      const available: any[] = [];
      for (let platform of availablePlatforms) {
        const canOpen = await Linking.canOpenURL(platform.urlScheme);
        if (canOpen) available.push(platform);
      }
      setActivePlatforms(available);
    };

    checkApps();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  // const shareUrl = `https://justsearchapp/(drawer)/(tabs)/reels/${reelId}`;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(reelUrl);
    alert("Link copied successfully!");
  };

  const handleSharePlatform = async (platform: string) => {
    const encodedUrl = encodeURIComponent(reelUrl);

    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `whatsapp://send?text=${encodedUrl}`;
        break;
      case "telegram":
        url = `tg://msg?text=${encodedUrl}`;
        break;
      case "facebook":
        url = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "instagram":
        url = `instagram://share?text=${encodedUrl}`;
        break;
      default:
        await Share.share({
          message: `Check this reel: ${reelUrl}`,
        });
        return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert(`${platform} app is not installed!`);
      }
    } catch (error) {
      console.log("Error opening app:", error);
    }
  };


  // const handleDownloadReel = async () => {
  //   try {
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("Permission to access gallery is required!");
  //       return;
  //     }

  //     const fileUri = FileSystem.documentDirectory + "reel.mp4";
  //     const downloadResumable = FileSystem.createDownloadResumable(
  //       reelUrl,
  //       fileUri
  //     );

  //     const { uri } = (await downloadResumable.downloadAsync())!;
  //     const asset = await MediaLibrary.createAssetAsync(uri);
  //     await MediaLibrary.createAlbumAsync("Download", asset, false);
  //     Alert.alert("Download complete!", "Video saved to gallery 🎉");
  //   } catch (error) {
  //     console.log("Download error:", error);
  //     Alert.alert("Error", "Failed to download the video.");
  //   }
  // };

  const handleDownloadReel = async () => {
    try {

      setDownloading(true); // Loader ON

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Gallery permission is required!");
        return;
      }

      const fileExt = reelUrl.split("?")[0].split(".").pop() || "mp4";

      //  Unique filename (no overwrite)
      const fileName = `reel_${Date.now()}.${fileExt}`;

      const fileUri = FileSystem.cacheDirectory + fileName;

      //  FAST Download (Instagram-like)
      const download = FileSystem.createDownloadResumable(
        reelUrl,
        fileUri,
        { cache: true }
      );

      const result = await download.downloadAsync();

      if (!result?.uri) {
        throw new Error("Download failed");
      }

      // Save to Gallery
      const asset = await MediaLibrary.createAssetAsync(result.uri);

      await MediaLibrary.createAlbumAsync("Reels", asset, false);

      Alert.alert("Success 🎉", "Reel saved to your gallery!");
    } catch (error) {
      console.log("❌ Download Error:", error);
      Alert.alert("Error", "Failed to download reel. Try again.");
    } finally {
      setDownloading(false); // Loader OFF
    }
  };


  const handleDelete = () => {
            onDelete?.();
            onClose();
  };

  return (
    <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />

      <Animated.View
        style={[
          styles.bottomDrawer,
          {
            backgroundColor: theme.background,
            transform: [{ translateY: slideAnim }],
            borderTopColor: theme.inputBorder,
          },
        ]}
      >
        {!showSharePanel ? (
          <>
            <TouchableOpacity style={styles.optionButton} onPress={onSave}>
              <Ionicons name="bookmark-outline" size={22} color={theme.text} />
              <Text style={[styles.optionText, { color: theme.text }]}>
                Save
              </Text>
            </TouchableOpacity>

            {/* NEW: Show Delete button only for owner */}
            {isOwner && onDelete && (
              <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                <Text style={[styles.optionText, { color: "#FF3B30" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.optionButton} onPress={onReport}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={theme.text}
              />
              <Text style={[styles.optionText, { color: theme.text }]}>
                Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setShowSharePanel(true)}
            >
              <Ionicons
                name="share-social-outline"
                size={22}
                color={theme.text}
              />
              <Text style={[styles.optionText, { color: theme.text }]}>
                Share Video
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, }}>
              <TouchableOpacity onPress={() => setShowSharePanel(false)}>
                <Ionicons name="arrow-back" size={24} color={theme.text} style={{ marginRight: 8 }} />
              </TouchableOpacity>

              <Text style={[styles.shareTitle, { color: theme.text }]}>Share Reel</Text>
            </View>


            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleCopyLink}
            >
              <Ionicons name="copy-outline" size={22} color={theme.text} />
              <Text style={[styles.optionText, { color: theme.text }]}>
                Copy Link
              </Text>
            </TouchableOpacity>

            <View style={styles.socialRow}>
              {activePlatforms.map((platform) => (
                <TouchableOpacity
                  key={platform.name}
                  style={styles.socialBtn}
                  onPress={() => Linking.openURL(platform.urlScheme + encodeURIComponent(reelUrl))}
                >
                  <Ionicons name={platform.icon} size={30} color={platform.color} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSharePlatform("other")}
              >
                <Ionicons name="share-outline" size={30} color={theme.text} />
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.optionButton}
                onPress={handleDownloadReel}
              >
                <Ionicons name="arrow-down-circle" size={30} color={theme.text} />
              </TouchableOpacity> */}

              {downloading ? (
                <ActivityIndicator size="large" color={theme.text} />
              ) : (
                <TouchableOpacity style={styles.optionButton} onPress={handleDownloadReel}>
                  <Ionicons name="arrow-down-circle" size={30} color={theme.text} />
                </TouchableOpacity>
              )}

            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 70,
    justifyContent: "flex-end",
    zIndex: 999,
  },
  overlayBackground: { flex: 1 },
  bottomDrawer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.4,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  socialBtn: {
    padding: 10,
  },
  backBtn: {
    alignItems: "center",
  },
});

export default BottomDrawer;



