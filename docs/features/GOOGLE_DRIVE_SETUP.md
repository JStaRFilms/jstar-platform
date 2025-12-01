# Google Drive Integration Setup Guide

Follow these steps to generate the necessary credentials for connecting JohnGPT to Google Drive.

## Step 1: Create a Project in Google Cloud Console

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click on the project dropdown in the top navigation bar.
3.  Click **"New Project"**.
4.  **Project Name**: Enter `jstar-platform` (or similar).
5.  Click **"Create"**.
6.  Wait for the project to be created, then **select it** from the notification or dropdown.

## Step 2: Enable Google Drive API

1.  In the left sidebar, go to **"APIs & Services" > "Library"**.
2.  Search for **"Google Drive API"**.
3.  Click on **"Google Drive API"** in the results.
4.  Click **"Enable"**.

## Step 3: Configure OAuth Consent Screen

1.  In the left sidebar, go to **"APIs & Services" > "OAuth consent screen"**.
2.  **User Type**: Select **"External"**.
3.  Click **"Create"**.
4.  **App Information**:
    *   **App name**: `J StaR Platform`
    *   **User support email**: Select your email.
    *   **Developer contact information**: Enter your email.
5.  Click **"Save and Continue"**.
6.  **Scopes**:
    *   Click **"Add or Remove Scopes"**.
    *   Search for `drive.file` (Recommended for security - only accesses files created by the app) OR `drive` (Full access).
    *   Select `.../auth/drive.file`.
    *   Click **"Update"**.
    *   Click **"Save and Continue"**.
7.  **Test Users**:
    *   Click **"Add Users"**.
    *   Enter your own Google email address (so you can test it).
    *   Click **"Add"**.
    *   Click **"Save and Continue"**.
8.  Review the summary and click **"Back to Dashboard"**.

## Step 4: Create Credentials

1.  In the left sidebar, go to **"APIs & Services" > "Credentials"**.
2.  Click **"Create Credentials"** (top of page) and select **"OAuth client ID"**.
3.  **Application type**: Select **"Web application"**.
4.  **Name**: `JohnGPT Web Client`.
5.  **Authorized JavaScript origins**:
    *   Click **"Add URI"**.
    *   Enter: `http://localhost:3000`
6.  **Authorized redirect URIs**:
    *   Click **"Add URI"**.
    *   Enter: `http://localhost:3000/api/auth/google/callback`
    *   *(Note: This must match exactly what we set in the code)*
7.  Click **"Create"**.

## Step 5: Get Your Credentials

A popup will appear with your credentials.

1.  Copy the **Client ID**.
2.  Copy the **Client Secret**.

## Step 6: Update Your Environment

Add these to your `.env` file (or send them to me to add):

```env
GOOGLE_CLIENT_ID=your_copied_client_id
GOOGLE_CLIENT_SECRET=your_copied_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## Step 7: Verify

Once added, restart your server:
`npm run dev`

You should now be able to click "Connect Google Drive" in the JohnGPT sidebar!
