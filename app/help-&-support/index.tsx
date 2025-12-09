import { useAppTheme } from '@/src/constants/themeHelper';
import supportTopics from '@/src/dumyData/help-and-sport';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CopyrightForm {
  name: string;
  proof: string;
  contentLink: string;
}

const HelpSupportScreen: React.FC = () => {
  const theme = useAppTheme();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showCopyrightForm, setShowCopyrightForm] = useState(false);
  const [copyrightForm, setCopyrightForm] = useState<CopyrightForm>({
    name: '',
    proof: '',
    contentLink: ''
  });

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@example.com?subject=Support Request');
  };

  const handleSubmitCopyright = () => {
    if (!copyrightForm.name || !copyrightForm.proof || !copyrightForm.contentLink) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const emailBody = `Name: ${copyrightForm.name}%0D%0AProof of Ownership: ${copyrightForm.proof}%0D%0AContent Link: ${copyrightForm.contentLink}`;
    Linking.openURL(`mailto:copyright@example.com?subject=Copyright Infringement Report&body=${emailBody}`);
    
    setCopyrightForm({ name: '', proof: '', contentLink: '' });
    setShowCopyrightForm(false);
    Alert.alert('Success', 'Your copyright report has been submitted');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.buttonBg,
      paddingHorizontal: 24,
      paddingVertical: 32,
      alignItems: 'center',
    },
    headerEmoji: {
      fontSize: 40,
      marginBottom: 12,
    },
    headerTitle: {
      color: theme.buttonText,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    headerSubtitle: {
      color: theme.buttonText,
      fontSize: 16,
      opacity: 0.9,
    },
    section: {
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    topicCard: {
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      marginBottom: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.searchBg,
    },
    topicHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    topicHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      backgroundColor: theme.buttonBg,
      borderRadius: 24,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    emoji: {
      fontSize: 24,
    },
    topicTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      flex: 1,
    },
    chevron: {
      fontSize: 12,
      color: theme.subtitle,
    },
    topicDescription: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.searchBg,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.subtitle,
      lineHeight: 22,
    },
    copyrightSection: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      backgroundColor: theme.inputBg,
    },
    copyrightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    copyrightEmoji: {
      fontSize: 24,
      marginRight: 8,
    },
    copyrightTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    copyrightDescription: {
      fontSize: 14,
      color: theme.subtitle,
      lineHeight: 22,
      marginBottom: 16,
    },
    copyrightButton: {
      backgroundColor: theme.googleBg,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    copyrightButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    formContainer: {
      backgroundColor: theme.searchBg,
      borderRadius: 8,
      padding: 16,
    },
    input: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
      fontSize: 14,
      color: theme.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.searchBg,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    cancelButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
    },
    submitButton: {
      flex: 1,
      backgroundColor: theme.googleBg,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    submitButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    contactCard: {
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.searchBg,
    },
    contactLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    mailIcon: {
      backgroundColor: theme.buttonBg,
      borderRadius: 24,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    emailText: {
      fontSize: 14,
      color: theme.link,
    },
    responseTimeCard: {
      backgroundColor: theme.searchBg,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    responseTimeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.buttonBg,
      marginBottom: 4,
    },
    responseTimeText: {
      fontSize: 14,
      color: theme.subtitle,
    },
    bottomPadding: {
      height: 32,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>Need help? We're here for you.</Text>
      </View>

      {/* Support Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Topics We Support</Text>

        {supportTopics.map((topic) => {
          const isExpanded = expandedTopic === topic.id;

          return (
            <TouchableOpacity
              key={topic.id}
              onPress={() => toggleTopic(topic.id)}
              style={styles.topicCard}
              activeOpacity={0.7}
            >
              <View style={styles.topicHeader}>
                <View style={styles.topicHeaderLeft}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>{topic.emoji}</Text>
                  </View>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                </View>
                <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text>
              </View>

              {isExpanded && (
                <View style={styles.topicDescription}>
                  <Text style={styles.descriptionText}>{topic.description}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Copyright Section */}
      <View style={styles.copyrightSection}>
        <View style={styles.copyrightHeader}>
          <Text style={styles.copyrightEmoji}>©️</Text>
          <Text style={styles.copyrightTitle}>Report Copyright Issues</Text>
        </View>

        <Text style={styles.copyrightDescription}>
          If you believe any content violates your copyright, please provide the following information and we will review and remove content if valid.
        </Text>

        {!showCopyrightForm ? (
          <TouchableOpacity
            onPress={() => setShowCopyrightForm(true)}
            style={styles.copyrightButton}
            activeOpacity={0.8}
          >
            <Text style={styles.copyrightButtonText}>Submit Copyright Report</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Your Name"
              value={copyrightForm.name}
              onChangeText={(text) => setCopyrightForm({ ...copyrightForm, name: text })}
              style={styles.input}
              placeholderTextColor={theme.placeholder}
            />
            <TextInput
              placeholder="Proof of Ownership"
              value={copyrightForm.proof}
              onChangeText={(text) => setCopyrightForm({ ...copyrightForm, proof: text })}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholderTextColor={theme.placeholder}
            />
            <TextInput
              placeholder="Link to Content"
              value={copyrightForm.contentLink}
              onChangeText={(text) => setCopyrightForm({ ...copyrightForm, contentLink: text })}
              style={styles.input}
              placeholderTextColor={theme.placeholder}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => {
                  setShowCopyrightForm(false);
                  setCopyrightForm({ name: '', proof: '', contentLink: '' });
                }}
                style={styles.cancelButton}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitCopyright}
                style={styles.submitButton}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Submit ✉️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Contact Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>

        <TouchableOpacity
          onPress={handleEmailSupport}
          style={styles.contactCard}
          activeOpacity={0.7}
        >
          <View style={styles.contactLeft}>
            <View style={styles.mailIcon}>
              <Text style={styles.emoji}>📧</Text>
            </View>
            <View>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.emailText}>support@example.com</Text>
            </View>
          </View>
          <Text style={styles.chevron}>▶</Text>
        </TouchableOpacity>

        <View style={styles.responseTimeCard}>
          <Text style={styles.responseTimeTitle}>Response Time</Text>
          <Text style={styles.responseTimeText}>24–72 business hours</Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

export default HelpSupportScreen;