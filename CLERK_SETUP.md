# Clerk Setup Instructions

## 1. Create Clerk Account and Application

1. Go to https://clerk.com and create an account
2. Create a new application:
   - Name: **궁금닷컴**
   - Sign-in options: **Email** + **Google/GitHub** (optional)
3. Copy API keys from **Dashboard → API Keys**

## 2. Configure Environment Variables

Update `.env.local` in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## 3. Configure Username Settings

1. Go to **Dashboard → User & Authentication → Username**
2. Enable username field
3. Make username required

## 4. Configure Profile URL

1. Go to **Dashboard → Paths**
2. Set Profile URL: `/@{{username}}`

## 5. Setup Webhook for User Sync

1. Go to **Dashboard → Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - For local development: Use ngrok or similar tunnel
3. Subscribe to events:
   - `user.created`
   - `user.updated`
4. Copy the webhook secret to `CLERK_WEBHOOK_SECRET` in `.env.local`

## 6. Install Webhook Verification Package

```bash
bun add svix
```

## Testing

### Sign Up
Visit: http://localhost:3000/sign-up

### Sign In
Visit: http://localhost:3000/sign-in

### Profile
Visit: http://localhost:3000/@{your-username}

## Troubleshooting

### "Clerk: Missing publishable key"
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local`
- Restart dev server after adding env vars

### "User not found in database"
- Check webhook is configured correctly
- Verify webhook secret matches
- Check webhook logs in Clerk dashboard

### "Username already exists"
- Each username must be unique
- Check database for existing users
