# BrightPath Consulting Website

A simple business website and lead dashboard for **BrightPath Consulting**. Visitors can learn about the services and submit an enquiry. The business owner can log in to review and update those enquiries.

## Business overview

BrightPath Consulting helps small and medium-sized businesses improve their operations, organize internal processes, and adopt practical digital tools.

## Pages

| Page | URL | Purpose |
| --- | --- | --- |
| Home | `/` | Public website with services and enquiry form |
| Dashboard Login | `/dashboard/login` | Password login for the business owner |
| Lead Dashboard | `/dashboard` | Review, search, filter, and update leads |

### Home page sections

1. Navigation
2. Hero
3. Customer Problem
4. Benefits
5. Services
6. How It Works
7. Customer Enquiry form
8. Footer

## Main features

- Responsive public website
- Enquiry form with validation, loading, success, and error states
- MongoDB Atlas storage for customer enquiries
- Password-protected lead dashboard
- Lead summaries, search, status filters, and status updates

## Technology stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB Atlas + Mongoose
- Zod validation
- Lucide React icons

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

This project already includes:

- `.env.example` — safe placeholders you can copy
- `.env.local` — local values for development

Open `.env.local` and set:

```env
MONGODB_URI=PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE
DASHBOARD_PASSWORD=admin123
AUTH_SECRET=your-long-random-secret
```

For this workshop, the local dashboard password defaults to:

```text
admin123
```

This password is for local workshop use only. Change it before publishing a real application.

### 3. Add your MongoDB Atlas connection string

1. Open [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an account or sign in.
3. Create a free cluster.
4. Create a database user (username and password).
5. Configure Network Access (for local testing you can allow access from your current IP, or temporarily allow access from anywhere).
6. Click **Connect**.
7. Choose **Drivers**.
8. Copy the connection string.
9. Replace `<username>` and `<password>` with your database user details.
10. Add a database name at the end, for example `/brightpath`.
11. Open `.env.local` in this project.
12. Replace only `PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE` with your connection string.
13. Save the file.

Example format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brightpath
```

Do not put credentials into source code files.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to submit an enquiry

1. Open the home page.
2. Scroll to **Book a Free Consultation**, or click the navigation button.
3. Fill in the required fields: full name, email, and message.
4. Click **Submit Enquiry**.
5. You should see: “Thank you for your enquiry. We will contact you shortly.”

## How to open the dashboard

1. Go to [http://localhost:3000/dashboard/login](http://localhost:3000/dashboard/login).
2. Enter the dashboard password from `.env.local`.
3. Default workshop password: `admin123`.
4. Review leads, search, filter by status, and update lead status.
5. Click **Log out** when finished.

Unauthenticated visitors are redirected to the login page.

## How to change the dashboard password

1. Open `.env.local`.
2. Change the value of `DASHBOARD_PASSWORD`.
3. Save the file.
4. Restart the development server.

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DASHBOARD_PASSWORD` | Password used to access `/dashboard` |
| `AUTH_SECRET` | Secret used to sign the login session cookie |

`.env.local` is ignored by Git and should never be committed.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add these environment variables in the Vercel project settings:
   - `MONGODB_URI`
   - `DASHBOARD_PASSWORD`
   - `AUTH_SECRET`
4. Deploy.
5. In MongoDB Atlas Network Access, allow Vercel to connect (often by allowing access from anywhere for a simple workshop app, or by using Atlas guidance for cloud hosting).

## Production authentication warning

This workshop uses a simple password and signed cookie for the dashboard. That is fine for learning and demos.

For a real production application, use a complete authentication solution such as:

- Auth.js
- Clerk
- Keycloak
- Your organization’s identity provider

## Scripts

```bash
npm run dev      # start local development
npm run build    # create a production build
npm run start    # run the production build
npm run lint     # run the linter
```

## Editable content

Business text and section content live in:

```text
config/business.ts
```

Edit that file to update the website wording without searching through many components.
