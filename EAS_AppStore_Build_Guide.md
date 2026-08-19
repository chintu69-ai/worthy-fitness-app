# 📱 How to Run & Build WORTHY on Windows for Your iPhone

Since you are using a **Windows laptop** and an **iPhone**, the **Expo React Native** stack allows you to test the **WORTHY** app live on your iPhone in **less than 2 minutes** without needing a Mac or Xcode!

---

## 🚀 Part 1: Run & Test Live on Your iPhone (2 Minutes)

### Step 1: Install Expo Go on Your iPhone
1. On your iPhone, open the **Apple App Store**.
2. Search for **Expo Go** and install it (it's completely free).

### Step 2: Start the Local Dev Server on Windows
1. Open PowerShell or Command Prompt on your Windows laptop.
2. Navigate to your project folder:
   ```bash
   cd "c:\Users\Chetan\OneDrive\Desktop\Khusboo pdf\GymFitExpoApp"
   ```
3. Install dependencies (if Node.js is installed):
   ```bash
   npm install
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. A large **QR code** will appear right in your Windows terminal!

### Step 3: Scan & Launch on iPhone
1. Open the **Camera App** on your iPhone and point it at the QR code on your Windows screen.
2. Tap the pop-up notification **"Open in Expo Go"**.
3. **WORTHY** will instantly compile and launch natively on your iPhone screen!
4. Any changes you make to the code on Windows will update on your iPhone in real-time! 🎉

---

## 📦 Part 2: Building the App for the Apple App Store (From Windows!)

You can build the official iOS `.ipa` binary package directly from Windows using **EAS Build** (Expo's free cloud build system).

### Step 1: Install EAS CLI on Windows
In your Windows terminal, run:
```bash
npm install -g eas-cli
```

### Step 2: Log into Expo
Create a free account at [expo.dev](https://expo.dev) and log in:
```bash
eas login
```

### Step 3: Configure & Build for iOS
Run the build command:
```bash
eas build --platform ios
```

- EAS Cloud will handle all Apple iOS compilation on Expo's cloud servers.
- When finished, EAS gives you a download link for your `WORTHY.ipa` file or automatically submits it directly to your **Apple App Store Connect** account!

---

## 🎯 Summary of Features Working in WORTHY on Your iPhone

1. **Dashboard & Stats**: Track total volume lifted, time in gym, and personal record count.
2. **1-Click Workout Routines**: Select pre-loaded routines (**Push**, **Pull**, **Legs**) or build custom templates.
3. **Active Workout Session Logger**: Live timer, volume calculation, and set completion checkboxes.
4. **🎉 Personal Record (PR) Celebration Alert**: Real-time pop-up banner when you break a previous weight or rep max!
5. **📏 Body Measurements & Circumferences**: Log weight, height, body fat %, chest, arms, waist, and thighs over time.
6. **Hevy / Strong Data Importer**: Paste CSV text exported from Hevy or Strong to import past workout history into **WORTHY**.
