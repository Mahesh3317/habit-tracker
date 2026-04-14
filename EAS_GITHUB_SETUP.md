# 🚀 GitHub Actions + EAS Updates Setup

**Status:** ✅ Setup Complete!

## **Dono Features Ab Active Hain:**

### **1. EAS Updates** 📲 (Instant App Updates)
- Phone mein app automatically update hoga
- No reinstall needed
- Just `npx eas update` run karo and app updates on all phones instantly!

### **2. GitHub Actions APK Build** 🤖 (Automatic Builds)
- Har push pe automatically APK build hoga
- APK release section mein save hoga
- Phone se direct download karke install kar sakta

---

## **⚙️ Setup EXPO_TOKEN (5 minutes)**

### **Step 1: Expo Login Terminal**
```bash
npx expo login
# Enter your Expo credentials:
# Username: maheshcreation
# Password: (enter your password)
```

### **Step 2: Get Your Token**
```bash
npx expo auth:token
# Copy the token that appears
```

### **Step 3: Add to GitHub Secrets**

1. **Go to GitHub:** https://github.com/Mahesh3317/habit-tracker
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. **Name:** `EXPO_TOKEN`
6. **Value:** Paste your token (from Step 2)
7. Click **Add secret**

---

## **🎯 Now It Works Like This:**

### **For Instant Updates (No Rebuild):**
```bash
# Make code changes
git add .
git commit -m "New feature"
git push

# Then run (on your laptop):
npx eas update

# Phone app automatically updates in 5-10 seconds!
```

### **For Full APK Builds:**
```bash
# Make code changes
git add .
git commit -m "New feature"
git push

# GitHub automatically:
# 1. Builds APK
# 2. Uploads to Releases
# 3. Generates download link

# Then download and install on phone
```

---

## **📱 How to Get Updates on Phone:**

### **Method 1: EAS Updates (Fastest)**
- Just call `npx eas update`
- App updates in seconds
- No download needed

### **Method 2: APK Download**
- Go to: https://github.com/Mahesh3317/habit-tracker/releases
- Download latest APK
- Install on phone

---

## **✅ Checklist:**

- [ ] Run `npx expo login`
- [ ] Get token with `npx expo auth:token`
- [ ] Add EXPO_TOKEN to GitHub Secrets
- [ ] Make a test commit and push
- [ ] Check GitHub Actions (Settings → Actions) - should be running
- [ ] Wait for build to complete
- [ ] Check Releases tab for APK

---

## **Troubleshooting:**

**Q: GitHub Actions showing error?**
A: Check if EXPO_TOKEN is added correctly in Secrets.

**Q: App not updating on phone?**
A: Make sure app is running Expo Go and connected to internet.

**Q: Build taking too long?**
A: First build takes 10-15 minutes. Subsequent builds are faster.

---

**Done! Ab har git push pe automatically build hoga!** 🎉
