# Authentication Implementation Guide

> **For Claude Code** — Implement Supabase authentication for the Lexica vocabulary app.
> The Supabase project is already created and connected. Read this entire document before writing any code.

---

## Context

- App name: **Lexica**
- Framework: React Native + Expo SDK 54
- Backend: Supabase (already connected via `src/lib/supabase.js`)
- Theme system already exists at `src/theme/theme.js` and `src/theme/ThemeContext.js`
- Design tokens (colors, typography, spacing, radius) must be used throughout — no hardcoded colors or font sizes

---

## What Already Exists

- `src/lib/supabase.js` — Supabase client, already configured
- `src/theme/` — full theme system with Paper and Dusk modes
- `src/navigation/AppNavigator.jsx` — navigation file, needs to be updated
- `App.js` — entry point, needs to be updated
- All screen files exist but are not yet wired to auth

---

## What Needs to Be Built

### 1. `src/hooks/useAuth.js`

A hook that manages the full auth lifecycle:

- On mount, call `supabase.auth.getSession()` to restore any existing session
- Listen to `supabase.auth.onAuthStateChange` for login/logout events
- When a user session exists, fetch their row from the `profiles` table
- Expose: `user`, `profile`, `loading`, `signUp`, `signIn`, `signOut`, `updateProfile`

**`signUp(email, password)`** — calls `supabase.auth.signUp`. A database trigger automatically creates a matching row in `public.profiles` when a new user is created, so no manual insert is needed.

**`signIn(email, password)`** — calls `supabase.auth.signInWithPassword`

**`signOut()`** — calls `supabase.auth.signOut`

**`updateProfile(updates)`** — updates the user's row in `public.profiles` and refreshes local profile state

**`loading`** — true while the initial session check is in progress. Used to show splash screen.

---

### 2. `src/auth/AuthContext.js`

Wrap `useAuth` in a React context so any screen can access auth state via `useAuthContext()` without prop drilling.

---

### 3. `src/screens/Login.jsx`

A single screen that handles both sign in and sign up — toggled by a switch link at the bottom.

**Layout (top to bottom):**
- App name "lexica" in `typography.displayMedium`
- Subtitle: "Welcome back" or "Create your account" depending on mode
- Email `TextInput`
- Password `TextInput` with `secureTextEntry`
- Error message (shown only when error exists) in `theme.accentTerracotta`
- Submit `Pressable` button — full width, `theme.accentTerracotta` background, disabled + 0.7 opacity while loading
- Toggle link: "Don't have an account? Sign up" / "Already have an account? Sign in"

**Behaviour:**
- Wrap in `KeyboardAvoidingView` so the keyboard doesn't cover inputs
- Show "Please wait..." on the button while loading
- On successful sign in → navigation handles redirect automatically via auth state
- On error → display `error.message` below the password field

**Styling:** Use only `theme.*` colors, `typography.*` styles, `spacing.*` and `radius.*` values. No hardcoded values.

---

### 4. Update `App.js`

Wrap the entire app in providers in this exact order (outermost → innermost):

```
AuthProvider
  └── ThemeProvider
        └── GameProvider
              └── Root component
                    └── AppNavigator
                    └── LevelUpModal
```

Create a `Root` component inside `App.js` that:
- Calls `useAuthContext()` to get `user` and `loading`
- While `loading` is true → render a centered `ActivityIndicator` on `theme.background`
- When loaded → render `<AppNavigator isAuthenticated={!!user} />` and `<LevelUpModal />`

---

### 5. Update `src/navigation/AppNavigator.jsx`

Accept an `isAuthenticated` boolean prop.

**When `isAuthenticated` is false** — show only:
- `Login` screen

**When `isAuthenticated` is true** — show:
- `Main` (bottom tabs: Home, Exercise, Progress, Profile)
- `WordDetail`
- `SessionComplete`
- `Onboarding` 
- `Paywall` with `presentation: 'modal'`

React Navigation automatically animates between the two stacks when auth state changes — no manual navigation calls needed on login/logout.

---

### 6. Onboarding Flow

After a new user signs up, check their `profile.daily_goal`. If it is still the default value (`5`) and `profile.username` is null, treat them as a new user and show the Onboarding screen first before Main tabs.

In `Root` component:
```
if authenticated:
  if profile.username is null → navigate to Onboarding
  else → navigate to Main
```

On Onboarding completion:
- Save chosen daily goal and a username to Supabase via `updateProfile({ daily_goal, username })`
- Then navigate to Main

---

## Database Schema Reference

These tables already exist in Supabase:

**`profiles`** (one row per user, auto-created on signup)
- `id` uuid — matches `auth.users.id`
- `username` text
- `daily_goal` integer — default 5
- `xp` integer — default 0
- `level` integer — default 1
- `streak` integer — default 0
- `longest_streak` integer — default 0
- `last_session` date
- `interests` text[]
- `theme` text — 'paper' | 'dusk'
- `is_premium` boolean — default false

Row Level Security is enabled — users can only read and update their own profile row.

---

## Quality Checklist

Before considering auth complete, verify:

- [ ] User can sign up with email and password
- [ ] New user row appears in Supabase → Authentication → Users
- [ ] New profile row appears in `public.profiles` automatically
- [ ] User can sign in after signing up
- [ ] Session persists — closing and reopening the app keeps the user logged in
- [ ] Sign out clears the session and returns to Login screen
- [ ] Error messages display correctly for wrong password, invalid email
- [ ] Keyboard does not cover inputs on both iOS and Android
- [ ] Loading state shows correctly on the button during API calls
- [ ] New users land on Onboarding screen after sign up
- [ ] Returning users land on Main tabs directly
- [ ] No hardcoded colors, font sizes, or spacing values anywhere in auth files

---

## What Is Out of Scope for This Task

Do not implement yet — these come in a later phase:

- Google sign-in
- Apple sign-in
- Forgot password / reset password flow
- Email verification
- Profile avatar upload

---

*End of authentication guide.*
*Next guide: Exercise Engine implementation.*