# Spontaneity Engine

A lightweight app that helps teens and young adults break out of daily routines by generating spontaneous, low-cost, nearby mini-adventures (e.g., "Find the weirdest flavored soda at a nearby bodega," "Take a photo of the oldest building within 3 blocks").1. Key FeaturesAdventure Management (CRUD)Add Adventure: Users or local community members can submit custom micro-adventure templates (title, description, tags, safety rating, cost level).Edit Adventure: Creator can update their submitted adventure details, location radii, or age-appropriateness tags.Delete Adventure: Users can remove custom adventures they created or hide adventures they don't want to see again.User Experience & GamificationRandomizer Wheel/Button: Tap to spin and instantly receive a random local prompt based on time, budget, and distance filters.Proof of Completion: Camera integration allowing users to upload a quick photo/video snap to mark an adventure as "Completed."Scratch-Off Cards: Daily hidden adventure prompts that users "scratch" to reveal on their screen.Safety & Age Controls: Built-in safeguards preventing night-time outdoor prompts for younger teens and flag-for-review buttons on user-created submissions.2. Tech Stack RecommendationsLayerTechnologyReasonFrontendReact Native (Expo) or FlutterFast cross-platform development (iOS & Android) with native camera and geolocation access.BackendFirebase / SupabaseReal-time database, quick authentication, and easy serverless functions without heavy backend setup.Location ServicesGoogle Maps API or MapboxAccurately calculates distance radii and identifies local points of interest.Media StorageCloudinary or AWS S3Optimized image/video storage for user completion photos.3. MVP RoadmapPhase 1 (Core Engine): Build the random generator with a pre-seeded library of 50 safe, fun micro-adventures and basic location filtering.Phase 2 (Community & CRUD): Enable user-created adventures, profile history, and photo proof uploads.Phase 3 (Gamification & Social): Add streak counters, badge unlocks, and group adventure sharing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://activitygenerator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f616aac-f503-4b25-87bf-e1ccad0ccb31).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
