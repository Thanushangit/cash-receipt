# Database Setup Guide

## Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Click on **"Connect"** for your cluster
4. Choose **"Connect your application"**
5. Select **Driver: Node.js** and **Version: 5.5 or later**
6. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2: Update Your Connection String

Replace `<username>` and `<password>` with your actual database credentials, and add the database name.

Example:
```
mongodb+srv://myuser:mypassword123@cluster0.xxxxx.mongodb.net/cash-receipt-system?retryWrites=true&w=majority
```

## Step 3: Update .env.local File

The file is located at:
```
cash-receipt-system\.env.local
```

Update the `DATABASE_URL` with your connection string.

## Step 4: Generate a Secret Key

For `NEXTAUTH_SECRET`, you can use any random string. Example:
```
NEXTAUTH_SECRET="my-super-secret-key-change-in-production-12345"
```

## Ready to Continue?

Once you've updated the `.env.local` file, we can:
1. Seed the database with test data
2. Start the development server
3. Test the application
