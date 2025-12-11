import { useAppTheme } from "@/src/constants/themeHelper";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const TermsConditions = () => {
  const theme = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >

      <Text style={[styles.heading, { color: theme.text }]}>
        Terms & Conditions
      </Text>

      <Text style={[styles.updated, { color: theme.text }]}>
        Last updated:
      </Text>

      {/* Content */}
      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>1. User Eligibility</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          You must be at least 18 years old to use this app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>2. User Responsibility</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          You are fully responsible for any content you upload, compliance with copyright laws, and maintaining your account security.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>3. Copyright & Audio Content</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          If you upload music, audio, or media, you confirm you have legal rights to use it. We may remove content upon complaint without notice.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>4. Prohibited Activities</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          You agree NOT to upload illegal or abusive content, harass users, scam, hack, or misuse the platform.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>5. Content Removal</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          We reserve the right to remove any content or suspend accounts that violate these terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>6. Data Usage</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          We may use user data to improve performance, features, and user experience.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>7. Service Availability</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          We do not guarantee uninterrupted service and may modify or discontinue features at any time.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>8. Limitation of Liability</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          We are not responsible for user-generated content, data loss, or copyright disputes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>9. Termination</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Accounts may be suspended or terminated for violating the terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>10. Changes to Terms</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          We may update these terms anytime. Continued use of the app means acceptance of updates.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.text }]}>11. Contact</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          For legal or account issues, contact us at:{"\n"}Email:
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default TermsConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  headerBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  updated: {
    fontSize: 13,
    marginBottom: 15,
  },
  section: {
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
