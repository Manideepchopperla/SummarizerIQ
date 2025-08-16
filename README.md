# SummarizeIQ - AI Powered Meeting Notes Summarizer

SummarizeIQ is an AI-powered meeting notes summarizer that helps users generate clear, structured, and concise summaries from meeting transcripts. The platform allows users to upload or paste meeting transcripts, generate summaries with customizable prompts, edit summaries, and share them via email. The tool enhances productivity by turning lengthy meetings into actionable, easy-to-read notes.

---

## Features

- User registration and login with secure JWT authentication.
- Upload or paste meeting transcripts for summarization.
- Customizable prompts to tailor summary style (e.g., highlight action items).
- View, edit, and delete saved meeting summaries.
- Share summaries easily via email to multiple recipients.
- Responsive and user-friendly interface built with React and Tailwind CSS.
- AI integration using Groq’s large language model for high-quality summarization.

---

## 🎬 Demo

[Live Repo on GitHub »](https://github.com/Manideepchopperla/SummarizerIQ)

## 🏗️ Project Structure
```bash
SummarizerIQ/
├─ node_modules/
├─ public/
│ ├─ assets/
│ └─ data/
├─ server/
│ ├─ config/
│ ├─ controllers/
│ ├─ middleware/
│ ├─ models/
│ ├─ routes/
│ └─ index.js
├─ src/
│ ├─ components/
│ │ ├─ Dashboard.jsx
│ │ ├─ Login.jsx
│ │ ├─ Navigation.jsx
│ │ ├─ Register.jsx
│ │ └─ Summarizer.jsx
│ ├─ images/
│ ├─ App.jsx
│ ├─ index.css
│ └─ main.jsx
├─ .env
├─ .env.example
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ postcss.config.js
```

## Tech Stack

---

## Technologies Used

- **Frontend:** React, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer with Gmail SMTP
- **AI Service:** Groq SDK for AI-generated summaries

---
## Installation & Setup

### Prerequisites

- Node.js (v16 or later recommended)
- MongoDB database (local or cloud)
- Groq API key
- Gmail account and app password for email

### Backend Setup

### 1. Clone the repository:
```bash
git clone https://github.com/Manideepchopperla/SummarizerIQ.git
cd SummarizerIQ
```
### 2. **Backend Setup**

- Go to the server root:
```bash
cd server
```
- Install dependencies:
```bash
npm install
```
- Copy the `.env.example` to `.env` and fill out all secrets:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meeting_summarizer
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL = http://localhost:5173
```
- Start the backend in dev mode (with hot reload):
```bash
npm run server:dev
```


### 3. **Frontend Setup**

- From the root or `src` folder:
```bash
cd ../
npm install
```

- Start Vite dev server:

```bash
npm run dev
```
Your frontend will be by default at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Environment Variables

See `.env.example` in the project root for required secrets and settings.

---

## 📝 Usage

- **Register** or **login** to your account
- Navigate to **Summarizer** to upload or paste meeting transcripts
- Enter an optional title and custom prompt for AI
- Generate the summary, edit as needed, and share via email
- Access all summaries on the Dashboard; update/delete as you like

---

## Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Transcript**: Go to Summarizer and upload a text file or paste transcript
3. **Add Custom Prompt**: Optionally specify how you want the summary formatted
4. **Generate Summary**: Click "Generate Summary" to create AI-powered summary
5. **Edit Summary**: Modify the generated summary as needed
6. **Share via Email**: Enter recipient emails and send the summary

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/summaries/generate` - Generate AI summary
- `GET /api/summaries` - Get user's summaries
- `POST /api/summaries/share` - Share summary via email
- `GET /api/health` - Health check




## Contact

For any inquiries, please reach out to:

- **Name:** Manideep Chopperla
- **Email:** [manideepchopperla1808@gmail.com](mailto:manideepchopperla1808@gmail.com)
- **GitHub:** [Manideepchopperla](https://github.com/Manideepchopperla)
