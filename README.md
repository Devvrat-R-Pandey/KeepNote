# 📝 KeepNote

A feature-rich note management app built with **HTML**, **CSS**, **React** and **TypeScript**. KeepNote lets you create, search, filter, sort, and manage personal notes with a clean dark-themed UI.

---

## 🚀 Features

- 🔐 User Authentication (Login / Register)
- 📋 Create, View, and Delete Notes
- 🔍 Basic Search — filter notes by title in real time
- 🔎 Advanced Search — filter by Category & Priority with search count tracking
- 🗂️ Sort notes by Status or Priority
- 📄 Note Detail Page
- 👤 User Profile Page
- 🌙 Dark themed UI with styled-components & MUI
- 🔔 Snackbar notifications for all actions
- 🛡️ Protected Routes — unauthenticated users redirected to login
- 💾 Persistent login via localStorage

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| React Router v6 | Client-side Routing |
| MUI (Material UI) | UI Components |
| Styled Components | Custom Styling |
| Axios | HTTP Requests |
| JSON Server | Mock REST API |
| useReducer + Context | Global State Management |
| Jest + React Testing Library | Unit Testing |

---

## 📁 Project Structure

```
KeepNote/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │  └─ react.svg
│  ├─ components/
│  │  ├─ AddNoteForm/
│  │  │  ├─ AddNoteForm.module.css
│  │  │  └─ AddNoteForm.tsx
│  │  ├─ AdvancedNoteSearch/
│  │  │  ├─ AdvancedNoteSearch.styles.ts
│  │  │  ├─ AdvancedNoteSearch.test.tsx
│  │  │  └─ AdvancedNoteSearch.tsx
│  │  ├─ ErrorMessage/
│  │  │  ├─ ErrorMessage.styles.ts
│  │  │  └─ ErrorMessage.tsx
│  │  ├─ Footer/
│  │  │  ├─ Footer.module.css
│  │  │  ├─ Footer.test.tsx
│  │  │  └─ Footer.tsx
│  │  ├─ Header/
│  │  │  ├─ Header.module.css
│  │  │  └─ Header.tsx
│  │  ├─ NoteCard/
│  │  │  ├─ NoteCard.styles.ts
│  │  │  ├─ NoteCard.test.tsx
│  │  │  └─ NoteCard.tsx
│  │  ├─ NoteList/
│  │  │  ├─ NoteList.module.css
│  │  │  ├─ NoteList.test.tsx
│  │  │  └─ NoteList.tsx
│  │  ├─ NoteManager/
│  │  │  ├─ NoteManager.module.css
│  │  │  └─ NoteManager.tsx
│  │  ├─ SearchNote/
│  │  │  ├─ SearchNote.module.css
│  │  │  ├─ SearchNote.test.tsx
│  │  │  └─ SearchNote.tsx
│  │  └─ ProtectedRoute.tsx
│  ├─ context/
│  │  ├─ AppContext.tsx
│  │  ├─ AppProvider.tsx
│  │  ├─ AuthContext.tsx
│  │  ├─ AuthProvider.tsx
│  │  ├─ SnackbarContext.ts
│  │  └─ SnackbarProvider.tsx
│  ├─ data/
│  │  └─ notes.json
│  ├─ hooks/
│  │  ├─ useFetch.ts
│  │  ├─ useFetchUsers.ts
│  │  └─ useSnackbar.ts
│  ├─ pages/
│  │  ├─ LoginPage/
│  │  │  ├─ LoginPage.module.css
│  │  │  └─ LoginPage.tsx
│  │  ├─ NoteDetail/
│  │  │  ├─ NoteDetail.module.css
│  │  │  └─ NoteDetail.tsx
│  │  ├─ PageNotFound/
│  │  │  ├─ PageNotFound.module.css
│  │  │  └─ PageNotFound.tsx
│  │  ├─ Registration/
│  │  │  ├─ RegistrationDialog.tsx
│  │  │  ├─ RegistrationForm.tsx
│  │  │  ├─ RegistrationPage.module.css
│  │  │  └─ RegistrationPage.tsx
│  │  └─ UserProfile/
│  │     ├─ UserProfile.module.css
│  │     └─ UserProfile.tsx
│  ├─ reducers/
│  │  ├─ authReducer.ts
│  │  ├─ notesReducer.ts
│  │  └─ rootReducer.ts
│  ├─ services/
│  │  ├─ noteService.ts
│  │  └─ userService.ts
│  ├─ styles/
│  │  └─ variables.css
│  ├─ types/
│  │  └─ Note.ts
│  ├─ utils/
│  │  ├─ FilterNotes.ts
│  │  └─ ValidationRules.tsx
│  ├─ App.css
│  ├─ App.module.css
│  ├─ App.test.tsx
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ .gitignore
├─ babel.config.js
├─ eslint.config.js
├─ index.html
├─ jest.config.js
├─ jest.setup.ts
├─ package-lock.json
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ tsconfig.test.json
└─ vite.config.ts

```

---

## 📸 Screenshots

### Login Page
<img width="1907" height="861" alt="image" src="https://github.com/user-attachments/assets/fdd9f065-c9f3-44a8-874b-758d5bcaf804" />

### Register Page
<img width="1886" height="865" alt="image" src="https://github.com/user-attachments/assets/41637d23-94f9-413f-9359-72e0ff8bd832" />

### Home Page
<img width="1902" height="862" alt="image" src="https://github.com/user-attachments/assets/6d0ca86d-4591-462c-b267-c0110f759a22" />

### User Profile Page
<img width="1903" height="862" alt="image" src="https://github.com/user-attachments/assets/c80c0959-b0e6-46d1-a1e2-2b58eda8041e" />

### Note Detail
<img width="1888" height="865" alt="image" src="https://github.com/user-attachments/assets/c9ea3765-eb36-47a8-a194-88a0a91e14ff" />

### Advanced Search
<img width="1908" height="863" alt="image" src="https://github.com/user-attachments/assets/e4faf865-3f18-4901-84e1-55a2d780a5d5" />
