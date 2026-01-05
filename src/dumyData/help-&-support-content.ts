interface TopicItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
}


const supportTopics: TopicItem[] = [
  {
    id: "login",
    title: "Account Login Issues",
    emoji: "🔐",
    description: `Having trouble logging in?

Possible reasons & solutions:

• OTP not received:
  Wait 30 seconds → tap Resend OTP → check your network or spam folder.

• Wrong email/phone:
  Make sure you entered the correct login details.

• Password incorrect:
  Use "Forgot Password" to reset through email/OTP.

• Account blocked or disabled:
  Contact Support for verification and recovery.`
  },

  {
    id: "profile",
    title: "Profile & Content Problems",
    emoji: "👤",
    description: `Facing issues with your profile or posts?

Common fixes:

• Profile not updating:
  Retry after refreshing or checking your internet.

• Unable to upload photo/video:
  Check file size, format, or try switching network/data.

• Bio/username not saving:
  Username may already be taken — try a unique one.

• Content blurry:
  Upload in high resolution; avoid compressed files.`
  },

  {
    id: "report",
    title: "Report Inappropriate Content",
    emoji: "⚠️",
    description: `If you find any harmful, abusive, or misleading content:

How to report:

1. Tap the three dots (⋮) on that post or profile  
2. Select "Report"  
3. Choose reason (Harassment, Spam, Copyright, Fake info, etc.)

Our team will review it within 24–48 hours and take required action.`
  },

  {
    id: "bugs",
    title: "Technical Bugs & Crashes",
    emoji: "🐛",
    description: `If the app crashes or features don’t work properly:

Try these quick solutions:

• Restart the app  
• Clear app cache  
• Update the app to the latest version  
• Ensure device storage & RAM are not full  
• Switch to a stronger internet connection  

If issue continues, send us:

• Screenshot  
• Device model  
• App version  
• Description of the problem  

So we can fix it faster.`
  },

  {
    id: "feedback",
    title: "Feedback & Feature Requests",
    emoji: "💬",
    description: `We love your ideas!

To request a feature or share feedback:

• Go to Settings → Help & Support → Send Feedback  
• Or email us at: hithoy.help@gmail.com

Your suggestions help us improve and add new features.`
  }
];

export default supportTopics;