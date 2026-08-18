# Spontaneity Engine

A lightweight app that helps teens and young adults break out of daily routines by generating spontaneous, low-cost, nearby mini-adventures.

**Example adventures:** "Find the weirdest flavored soda at a nearby bodega," "Take a photo of the oldest building within 3 blocks."

---

## ✨ Key Features

### Adventure Management (CRUD)
- **Add Adventure:** Users or local community members can submit custom micro-adventure templates (title, description, tags, safety rating, cost level)
- **Edit Adventure:** Creators can update their submitted adventure details, location radii, or age-appropriateness tags
- **Delete Adventure:** Users can remove custom adventures they created or hide adventures they don't want to see again

### User Experience & Gamification
- **Randomizer Wheel/Button:** Tap to spin and instantly receive a random local prompt based on time, budget, and distance filters
- **Proof of Completion:** Camera integration allowing users to upload quick photo/video snaps to mark an adventure as "Completed"
- **Scratch-Off Cards:** Daily hidden adventure prompts that users "scratch" to reveal on their screen
- **Safety & Age Controls:** Built-in safeguards preventing night-time outdoor prompts for younger teens and flag-for-review buttons on user-created submissions

---

## 🛠️ Tech Stack Recommendations

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | React Native (Expo) or Flutter | Fast cross-platform development (iOS & Android) with native camera and geolocation access |
| **Backend** | Firebase / Supabase | Real-time database, quick authentication, and easy serverless functions without heavy backend setup |
| **Location Services** | Google Maps API or Mapbox | Accurately calculates distance radii and identifies local points of interest |
| **Media Storage** | Cloudinary or AWS S3 | Optimized image/video storage for user completion photos |

---

## 🚀 MVP Roadmap

- **Phase 1 (Core Engine):** Build the random generator with a pre-seeded library of 50 safe, fun micro-adventures and basic location filtering
- **Phase 2 (Community & CRUD):** Enable user-created adventures, profile history, and photo proof uploads
- **Phase 3 (Gamification & Social):** Add streak counters, badge unlocks, and group adventure sharing

---

## 🔧 Development

### Prerequisites
- [Node.js](https://nodejs.org/) (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for version management)
- npm or yarn package manager

### Getting Started Locally

```bash
# Clone the repository
git clone <this-repository-url>
cd <repository-name>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AdventureForm.tsx    # Form for creating/editing adventures
│   ├── SpinWheel.tsx        # Randomizer wheel component
│   └── ui/                  # Shadcn UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and helpers
├── routes/              # Page components and routing
├── styles.css           # Global styles
├── router.tsx           # TanStack Router configuration
├── server.ts            # Server configuration
└── start.ts             # Application entry point
```

---

## 🌐 Live Demo

**Live app:** https://activitygenerator.lovable.app

---

## 💡 Built with Lovable

This project was built with [Lovable](https://lovable.dev).

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f616aac-f503-4b25-87bf-e1ccad0ccb31):

- **Ship faster:** Describe what you want to build and Lovable handles the code
- **Stay in sync:** Every change made in Lovable is committed straight to this repository
- **Full ownership:** This code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt

---

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve the Spontaneity Engine.

