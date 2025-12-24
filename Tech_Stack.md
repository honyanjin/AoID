# Tech Stack Documentation

## 1. Frontend

### Core
- **Framework:** React 19 (`^19.2.0`)
- **Language:** TypeScript (`^4.9.5`)
- **Build Tool:** Create React App (`react-scripts 5.0.1`)

### State Management & Data Fetching
- **Server State:** TanStack Query v5 (`@tanstack/react-query ^5.90.11`)
- **HTTP Client:** Axios (`^1.13.2`)
- **Client State:** React Context API (별도의 Redux/Recoil 라이브러리 없음)

### UI & Styling
- **UI Component Library:** Material UI v7 (`@mui/material ^7.3.5`)
- **Icons:** Material Icons (`@mui/icons-material`)
- **Styling Engine:** Emotion (`@emotion/styled`, `@emotion/react`)
- **Animation:** Framer Motion (`^12.23.25`)
- **Icons (Additional):** Lucide React (`^0.555.0`)

### Routing & Navigation
- **Router:** React Router v7 (`react-router-dom ^7.9.6`)

### Utilities & Libraries
- **Date Handling:** date-fns (`^4.1.0`)
- **Rich Text Editor:** React Quill New (`react-quill-new ^3.6.0`)
- **Charts:** Recharts (`^3.5.1`)
- **Sanitization:** DOMPurify (`^3.3.0`)
- **Toast Notifications:** React Toastify (`^11.0.5`)

---

## 2. Backend

### Core
- **Runtime:** Node.js
- **Framework:** Express v5 (`^5.1.0`)
- **Language:** TypeScript (`^5.9.3`)
- **Execution:** ts-node / nodemon (Development)

### Database
- **DBMS:** PostgreSQL (`pg ^8.16.3`)
- **Migration Tool:** node-pg-migrate (`^8.0.3`)

### Authentication & Security
- **Authentication Strategy:** Passport.js (`passport ^0.7.0`)
  - Google OAuth2 (`passport-google-oauth20`)
  - GitHub OAuth2 (`passport-github2`)
- **Token Management:** JSON Web Token (`jsonwebtoken ^9.0.2`)
- **Encryption:** BCrypt (`bcrypt ^6.0.0`)
- **CORS:** cors (`^2.8.5`)

### Key Features
- **Email Service:** Nodemailer (`^7.0.11`)
- **Task Scheduling:** node-cron (`^4.2.1`)
- **File Upload:** Multer (`^2.0.2`)
- **Validation:** express-validator (`^7.3.1`)
- **Env Management:** dotenv (`^17.2.3`)

---

## 3. Infrastructure & DevOps

### Environment
- **Server:** AWS EC2
- **OS:** Ubuntu (Linux)
- **Containerization:** (Not currently configured in root, potential Manual Deployment or Docker usage via user scripts)

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **IDE:** Antigravity
