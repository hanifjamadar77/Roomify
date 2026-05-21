# 🏠 Roomify – AI-Powered Room Visualization Platform

Roomify is a modern AI-powered web application that transforms floor-plan images into photorealistic top-down 3D room visualizations. Users can upload a floor plan, generate AI-enhanced interior renders, compare before and after results, and export generated designs seamlessly.

Built using React, Vite, TypeScript, Tailwind CSS, and Puter AI services, Roomify delivers an interactive and intelligent room visualization experience directly in the browser.

---

# 🚀 Project Overview

Roomify simplifies interior visualization using Artificial Intelligence.

## Workflow

1. User signs in using Puter Authentication.
2. User uploads a floor-plan image.
3. Uploaded image is stored using Puter Hosting + KV Storage.
4. User is redirected to the visualization page.
5. The app sends the floor plan image to Puter AI.
6. AI generates a photorealistic top-down 3D room render.
7. User compares original and generated images.
8. User exports/downloads the final result.

---

# ✨ Features

- 🔐 Puter Authentication
- 📤 Floor Plan Image Upload
- ☁️ Puter Hosting Integration
- 🗄️ KV Storage Support
- 🤖 AI-Based Room Visualization
- 🏡 Photorealistic Top-Down 3D Render Generation
- 🔄 Before/After Image Comparison
- 📥 Export & Download Generated Results
- ⚡ Fast & Responsive UI
- 🎨 Modern Tailwind CSS Design

---

# 🛠️ Tech Stack

## Frontend

- React 19
- React Router 7
- Vite
- TypeScript
- Tailwind CSS 4

## AI & Backend Services

- Puter SDK (`@heyputer/puter.js`)
- Puter Authentication
- Puter KV Storage
- Puter Hosting
- Puter AI Image Generation

## Libraries & Tools

- react-compare-slider
- lucide-react

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/roomify-app.git
```

---

## 2️⃣ Navigate to Project Folder

```bash
cd roomify-app
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_PUTER_APP_ID=your_app_id
VITE_PUTER_API_KEY=your_api_key
```

# 📸 Screenshots
<img width="1918" height="872" alt="Screenshot 2026-05-07 130419" src="https://github.com/user-attachments/assets/3a99e947-54e0-44a0-91b9-181b0ba895d2" />

# ⭐ Support

If you found this project useful, give it a ⭐ on GitHub!
