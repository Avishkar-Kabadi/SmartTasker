# SmartTasker 📋✨

> An offline-first, AI-powered task manager built with **Expo SDK 54** and **React Native**. Designed for people who take their productivity seriously.

---

## 🚀 Features

### 🧠 Smart Natural Language Input
Type tasks the way you think — SmartTasker uses **chrono-node** to parse natural language into structured task data automatically.

- `"Submit report tomorrow at 3pm"` → sets due date & time  
- `"Buy groceries every week"` → creates a recurring task  
- Priority and category are auto-detected from keywords

### 👤 Personalized Onboarding
On first launch, SmartTasker greets you with a setup form asking for:
- **Name** — used in personalized greetings
- **Occupation** — Student or Working Professional
- **Job Role / Designation** — for professionals
- **Date of Birth** — to celebrate your birthday 🎉

The app uses this to generate dynamic contextual greetings like:
> *"Let's crush those Software Engineer goals today!"*

### 🔔 Background Notifications (OS-Level)
Reminders are scheduled **directly with the Android/iOS OS** via `expo-notifications`. This means:
- Notifications fire even when the app is fully closed/killed
- By default, reminders fire **30 minutes before** the task's due time
- If no time is set, reminder defaults to **9:00 AM** on the due date

### 🔒 Biometric Lock Screen
Protect your tasks with fingerprint / face unlock using `expo-local-authentication`. The app automatically re-locks after 30 seconds in the background.

### 📊 Productivity Insights
A dedicated Insights tab shows charts and analytics:
- Task completion rates
- Priority distribution
- Category breakdown
- Weekly completion trends

Built with **react-native-gifted-charts** for smooth, native chart rendering.

### 🌗 Theme Support
Full support for **Light**, **Dark**, and **System** themes, persisted across restarts via `AsyncStorage`.

### ⚡ High-Performance List
Uses **@shopify/flash-list** instead of FlatList for buttery-smooth scrolling, even with hundreds of tasks.

### 🔄 Recurring Tasks
Set tasks to repeat **daily, weekly, or monthly**. When you mark a recurring task as complete, the next occurrence is automatically scheduled.

---

## 🛠️ Tech Stack

| Category | Library | Purpose |
|---|---|---|
| **Framework** | [Expo SDK 54](https://expo.dev) | Cross-platform React Native toolchain |
| **Navigation** | [expo-router v6](https://expo.github.io/router) | File-based routing with deep linking |
| **Database** | [expo-sqlite v16](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Local SQLite for offline-first persistence |
| **NLP Parsing** | [chrono-node](https://github.com/wanasit/chrono) | Natural language date/time extraction |
| **Notifications** | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | OS-level scheduled push notifications |
| **Auth** | [expo-local-authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/) | Biometric / device credential lock |
| **Charts** | [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) | Native data visualization |
| **List** | [@shopify/flash-list](https://shopify.github.io/flash-list/) | High-performance virtualized list |
| **Animations** | [react-native-reanimated v4](https://docs.swmansion.com/react-native-reanimated/) | Smooth UI animations |
| **Icons** | [lucide-react-native](https://lucide.dev) | Clean, consistent icon set |
| **Gradients** | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | Premium gradient UI elements |
| **Storage** | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | Lightweight key-value persistence |
| **Date Utils** | [date-fns](https://date-fns.org) | Date formatting and manipulation |
| **Date Picker** | [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker) | Native Android/iOS date picker |

---

## 🏗️ Architecture

```
SmartTasker/
├── src/
│   ├── app/                    # Expo Router screens (file-based routing)
│   │   ├── _layout.tsx         # Root layout, auth & DB init
│   │   ├── index.tsx           # Entry point (lock screen / onboarding gate)
│   │   ├── onboarding.tsx      # First-time profile setup
│   │   └── (tabs)/
│   │       ├── _layout.tsx     # Bottom tab bar config
│   │       ├── home.tsx        # Today's tasks + personalized greeting
│   │       ├── add.tsx         # Smart task input form
│   │       ├── insights.tsx    # Analytics & charts
│   │       └── settings.tsx    # Theme, auth, data management
│   ├── components/             # Reusable UI components
│   │   ├── TaskCard.tsx        # Individual task display
│   │   ├── SmartInput.tsx      # NLP-powered input with chrono parsing
│   │   └── EmptyState.tsx      # Empty list placeholder
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTheme.tsx        # Theme context provider + toggle
│   │   ├── useTasks.ts         # Task CRUD + notification scheduling
│   │   ├── useProfile.ts       # User profile management
│   │   ├── useAuth.ts          # Biometric authentication
│   │   ├── useNotifications.ts # Notification permission management
│   │   └── useInsights.ts      # Analytics data aggregation
│   ├── db/
│   │   └── database.ts         # SQLite schema + all DB operations
│   ├── utils/
│   │   └── notificationScheduler.ts  # Expo notification scheduling logic
│   ├── constants/
│   │   ├── theme.ts            # Design tokens (colors, spacing, typography)
│   │   └── categories.ts       # Task category definitions
│   └── types/
│       └── index.ts            # TypeScript interfaces (Task, Category, etc.)
├── assets/images/              # App icons and splash screen assets
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
├── babel.config.js             # Babel with reanimated plugin
├── metro.config.js             # Metro bundler config
└── package.json
```

---

## 🔔 How Notifications Work

SmartTasker uses **OS-level local notifications** — no server required.

1. When you add a task with a due date + time, the app calls `Notifications.scheduleNotificationAsync()` with a `DATE` trigger.
2. Android / iOS registers this alarm directly in the system scheduler.
3. The OS delivers the notification **even if the app is killed** — it is handled at the OS level, not by the app process.
4. **Trigger timing:**
   - Task with due time → fires **30 minutes before**
   - Task with only date (no time) → fires at **9:00 AM** on that day
5. When you complete or delete a task, the scheduled notification is automatically cancelled.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- [Expo Go](https://expo.dev/go) app on Android (SDK 54 compatible)
- Or: [EAS CLI](https://docs.expo.dev/eas/) for production builds

### Installation
```bash
git clone https://github.com/yourusername/SmartTasker.git
cd SmartTasker
npm install --legacy-peer-deps
```

### Run Locally
```bash
npx expo start --clear
```
Scan the QR code in **Expo Go** to launch on your device.

### Build with EAS
```bash
# Internal preview APK
npx eas build --platform android --profile preview

# Production build
npx eas build --platform android --profile production
```

---

## 🎨 Design System

The app uses a cohesive design system defined in `src/constants/theme.ts`:

- **Dark Mode:** Deep `#0A0A14` background with elevated surfaces
- **Accent Colors:** Electric blue primary, amber warning, emerald success
- **Typography:** Scaled system (xs → xxxl) with bold weights for hierarchy
- **Spacing:** 4pt base grid (xs=4, sm=8, md=12, lg=16, xl=24, xxl=32)
- **Glassmorphism:** Semi-transparent surface layers for a premium feel

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ using Expo & React Native By Avishkar Kabadi*

