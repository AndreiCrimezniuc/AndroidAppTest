# Grid App

A React Native Expo application with native library integration.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Android Studio
- Android SDK
- JDK 17 or later

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd gridapp
```

2. Install dependencies:
```bash
npm install
```

3. Install required navigation packages:
```bash
npm install @react-navigation/native @react-navigation/stack expo-linking
```

4. Create Android project:
```bash
npx expo prebuild --platform android
```

5. Run the app:
```bash
npm run android
```

## Troubleshooting

If you encounter build issues:

1. Clean the project:
```bash
cd android && ./gradlew clean && cd ..
```

2. Rebuild:
```bash
cd android && ./gradlew assembleDebug && cd .. && npm run android
```

3. If Gradle issues persist:
```bash
cd android &&
./gradlew --stop &&
cd .. &&
rm -rf ~/.gradle/caches &&
rm -rf android/.gradle &&
npx expo run:android
```

## Project Structure

- `android/app/src/main/jniLibs/arm64-v8a/` - Contains native library files
- `src/` - React Native source code
- `android/` - Android project files

## Dependencies

- React Native 0.79.3
- Expo 53.0.11
- React Navigation
- JNA 5.14.0 (for native library integration) 