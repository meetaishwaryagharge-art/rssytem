# Firebase setup: enquiry popups + admin dashboard

Files added: `assets/firebase-config.js`, `admin/login.html`, `admin/dashboard.html`, `firestore.rules`.
Website popups save each enquiry to Firestore (`enquiries` collection). Admin sees them live at `/admin/login.html`.

## 1. Create the project
1. Go to https://console.firebase.google.com, click **Add project**, name it (e.g. `rs-systems`), skip Google Analytics, **Create**.

## 2. Register the web app and copy the config
1. Project home, click the **</>** (Web) icon, nickname `rs-systems-web`. Do NOT tick Firebase Hosting unless you want it. **Register app**.
2. Copy the `firebaseConfig` values and paste them into `assets/firebase-config.js` (replace every `YOUR_...`).

## 3. Create the Firestore database
1. **Build > Firestore Database > Create database**.
2. Location: **asia-south1 (Mumbai)**. Start in **production mode**, **Enable**.

## 4. Publish the security rules
1. Open `firestore.rules`. Replace `admin@rssystems.in` with the real admin email(s) (comma separated, in quotes).
2. Firestore Database > **Rules** tab, paste the whole file, click **Publish**.
   (Visitors may only create valid enquiries; only the listed admin emails can read, update or delete.)

## 5. Create the admin login
1. **Build > Authentication > Get started > Sign-in method > Email/Password > Enable > Save**.
2. **Users** tab > **Add user**: enter the SAME email you put in the rules, and a strong password.
3. Add more team members the same way, and add their emails to the rules list.

## 6. Allow your domain
Authentication > **Settings > Authorized domains** > **Add domain**: your live domain (e.g. `rssystems.in`). `localhost` is there by default.

## 7. Upload and test
1. Upload the whole site (including `admin/` and `assets/`) to your hosting. It must be served over http(s); opening the files directly (file://) will not work with Firebase.
2. Open any page, click a "Get a Quote" button, submit the popup form.
3. Go to `yourdomain/admin/login.html`, sign in, and the enquiry should appear within a second.

## Optional: host on Firebase Hosting
```
npm i -g firebase-tools
firebase login
firebase init hosting     # public directory: . (this folder), single-page app: No
firebase deploy
```

## Notes
- If Firebase is not configured or is unreachable, the popup falls back to WhatsApp (or email), so no lead is lost.
- The Firebase config values are public by design. Security comes from `firestore.rules`, so always publish them (step 4).
- Spam: a hidden honeypot field blocks simple bots. For stronger protection later, enable Firebase App Check (reCAPTCHA v3).
- The contact page's own form still uses email (mailto). Ask if you want it saved to Firestore too.
- Dashboard: live list, status (New / Contacted / Closed), search, filter by button name, WhatsApp/call links, delete, CSV export.
