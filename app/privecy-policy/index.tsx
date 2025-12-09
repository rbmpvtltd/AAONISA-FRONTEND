// import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// PrivacyPolicyScreen.tsx
// React Native + Expo + TypeScript single-file screen component
// Usage: place this screen in your navigation stack or show as a modal.

type Section = {
  id: string;
  title: string;
  body: string | React.ReactNode;
};

const DEFAULT_LAST_UPDATED = "December 9, 2025"; // replace dynamically as needed

const PrivacyPolicyScreen: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  const openEmail = (email: string) => {
    const url = `mailto:${email}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
    });
  };

  const sections: Section[] = [
    {
      id: "info",
      title: "1. Information We Collect",
      body:
        "Name, username, email\nProfile photo and content you upload (photos, videos, audio)\nDevice information and basic usage data\nMessages and interaction data (likes, comments, follows)",
    },
    {
      id: "use",
      title: "2. How We Use Your Information",
      body:
        "Provide and improve our services\nPersonalize user experience\nMaintain security and prevent misuse\nAnalyze app performance and improve features",
    },
    {
      id: "content",
      title: "3. User Content",
      body:
        "Any content you upload is your responsibility. You retain ownership of your content.",
    },
    {
      id: "copyright",
      title: "4. Copyright & Audio Content",
      body:
        "Users are solely responsible for any copyrighted audio or media they upload. We are not liable for copyright violations by users. Upon valid complaint, we reserve the right to remove such content immediately.",
    },
    {
      id: "sharing",
      title: "5. Data Sharing",
      body:
        "We do not sell your personal data. Data may be shared only: To comply with legal obligations; To protect users and the platform; With trusted service providers for app functionality.",
    },
    {
      id: "security",
      title: "6. Data Security",
      body:
        "We use reasonable security measures to protect your data but cannot guarantee absolute security.",
    },
    {
      id: "rights",
      title: "7. Your Rights",
      body:
        "You may: Edit or delete your account; Request data removal; Contact us for privacy concerns.",
    },
    {
      id: "changes",
      title: "8. Changes to Policy",
      body: "We may update this policy at any time. Continued use of the app means acceptance of changes.",
    },
    {
      id: "contact",
      title: "9. Contact Us",
      body: (
        <View>
          <Text style={styles.paragraph}>
            For privacy concerns, contact us at:
          </Text>
          <TouchableOpacity
            onPress={() => openEmail("support@yourapp.com")}
            accessibilityRole="link"
          >
            <Text style={[styles.paragraph, styles.link]}>support@yourapp.com</Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: {DEFAULT_LAST_UPDATED}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>We value your privacy.</Text>
          <Text style={styles.introText}>
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our application ("App").
          </Text>
        </View>

        {sections.map((s) => {
          const isOpen = !!expanded[s.id];
          return (
            <View key={s.id} style={styles.sectionCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.sectionHeader}
                onPress={() => toggle(s.id)}
                accessibilityRole="button"
                accessibilityLabel={`${s.title} ${isOpen ? "collapse" : "expand"}`}
              >
                <Text style={styles.sectionTitle}>{s.title}</Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  style={styles.icon}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.sectionBody}>
                  {typeof s.body === "string" ? (
                    s.body.split("\n").map((line, i) => (
                      <Text key={i} style={styles.paragraph}>
                        {line}
                      </Text>
                    ))
                  ) : (
                    s.body
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.termsLink}
            onPress={() => {
              // Open Terms screen or external link
              // Replace with navigation action if using react-navigation
              Linking.openURL("https://yourapp.com/terms");
            }}
          >
            <Text style={styles.termsText}>View Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => {
              // In signup flow you might call a callback or navigation pop
              // Placeholder behaviour: open a short message using mail client
              const mailto = `mailto:support@yourapp.com?subject=Privacy%20Policy%20Acknowledgement&body=I%20have%20read%20the%20privacy%20policy.`;
              Linking.openURL(mailto);
            }}
          >
            <Text style={styles.acceptText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 18 : 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  updated: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  introBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  introText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ececec",
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    flex: 1,
  },
  icon: {
    color: "#666",
    marginLeft: 8,
  },
  sectionBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 6,
  },
  link: {
    color: "#1a73e8",
    textDecorationLine: "underline",
  },
  actions: {
    marginTop: 10,
    alignItems: "center",
  },
  termsLink: {
    marginBottom: 12,
  },
  termsText: {
    fontSize: 14,
    color: "#1a73e8",
  },
  acceptButton: {
    backgroundColor: "#111",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  acceptText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
