# MekoReader

MekoReader is a React Native mobile application for reading digital documents
with Flipbook-style interaction.

## Technology Stack

- React Native 0.87.1
- TypeScript
- React Navigation
- Android SDK
- Java 17

## Prerequisites

Before running the project, install:

- Node.js LTS
- npm
- Java JDK 17
- Android Studio
- Android SDK
- Git

Configure the following environment variables:

### JAVA_HOME

Example:

```text
C:\Program Files\Java\jdk-17
```

Add to PATH:

```text
%JAVA_HOME%\bin
```

### ANDROID_HOME

Example:

```text
C:\Users\<username>\AppData\Local\Android\Sdk
```

Add to PATH:

```text
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd MekoReader
```

Install dependencies:

```bash
npm install
```

## Run on Android

Start an Android Emulator from Android Studio.

Check the connected device:

```bash
adb devices
```

Start Metro:

```bash
npx react-native start
```

Open another terminal and run:

```bash
npx react-native run-android --no-packager
```

## Code Quality

Check TypeScript:

```bash
npx tsc --noEmit
```

Run ESLint:

```bash
npm run lint
```

## Project Structure

```text
src/
├── components/
├── navigation/
├── screens/
├── services/
└── types/
```

- `components`: Reusable UI components
- `navigation`: Application navigation configuration
- `screens`: Application screens
- `services`: API and external service integration
- `types`: Shared TypeScript types

## Current Mobile Base

The current base project includes:

- React Native TypeScript setup
- Android development environment
- Stack Navigation
- Safe Area support
- React Native Screens
- Gesture Handler
- Android Emulator testing

## Development Branch

Development work is maintained on the `develop` branch.