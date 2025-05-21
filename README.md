# Legal Case Management Login and verify OTP Frontend UI

This is the **frontend** of the Legal Case Management platform built using **Next.js App Router**, designed to interact with a NestJS backend Server. It handles login, OTP verification and route protection based on user roles.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **State Management**: React Context API
- **Data Fetching**: React Query
- **Styling**: Tailwind CSS
- **Form UI**: Custom Input and Button Components
- **Auth**: Token-based (JWT) with role-based protection

---

## Folder Structure

```
legal-cases-web/
├── app/                    # Pages (Next.js App Router)
│   ├── login/              # Login form
│   ├── verify-otp/         # OTP entry screen
│   ├── reset-password/     # Password reset page for testting redirect
|   ├── dashbord/           # Dashboards page for testting redirect
│   └── layout.tsx          # Root layout
│
├── components/             # UI & form components
│   ├── Auth/               # Auth forms
│   └── UI/                 # Reusable UI
|
├── context/                # State Management for AuthContext
│      
├── services/               # API calls (auth.api.ts)
├── lib/                    # Helpers (constants) for defining server url
├── assets/                 # Pictures as assets used in project
├── styles/                 # Tailwind config / global CSS
```

---

##  Application Routes

 Route                 Description                            

 `/cases`              case page             
 `/clients`            client page          



---


## API Integration

All backend API calls (e.g., login, verify OTP,resend OTP) are handled in:

```ts
/services/auth.api.ts
```
```
```

## Nestjs Server Address

Server url is stored  in:

```ts
/lib/constants.ts
Server URL   API_BASE_URL = "http://localhost:5000";

```



### Run Project Locally

```
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: [http://localhost:3000]

---

---

## License 

free to use and modify.

## Author

Bergerac Irakarama
