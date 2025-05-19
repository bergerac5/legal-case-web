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

 `/login`              Email/password login form              
 `/verify-otp`         OTP form shown after login             
 `/reset-password`     Shown if user has default password     
 `/dashboard`          Dashboard for testing auth function      


---

## Authentication Flow

- User logs in using `/login`.
- On success, app saves the `email` in `localStorage`.
- Redirects to `/verify-otp` for OTP verification.
- If OTP is correct:
  - If password is default: redirect to `/reset-password`.
  - Else: store `access_token` and decoded user info in context.
- Token is used to protect routes and check roles.
- Only authenticated user allowed to protected access pages are  using `ProtectedRoute` logic depend on roles he/she has .

---

## AuthContext

Located in `context/AuthContext.tsx`:
- Stores and provides token, user info, and login state.
- Uses `jwt-decode` to extract `role_id` from token.
- Provides `login`, `logout`, and role-based access functions.

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

```

## Key Components

Component                   Purpose                                      

 `LoginForm.tsx`        Login form with email/password               
 `OTPForm.tsx`          OTP input and submit                             
 `Input.tsx`            Reusable styled input field                  
 `Button.tsx`           Reusable button                              

---

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

Niyonkuru Samuel
