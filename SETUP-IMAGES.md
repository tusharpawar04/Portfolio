# Project Images Setup Guide

Your portfolio is already configured to display project images! They will appear in the **Gallery tab** of each project's detail page.

## Required Image Files

### Tourmitra (3 images)
Save your screenshots to these exact paths:

1. `public/projects/tourmitra-hero.png`
   - The hero landing page with "Discover India Through Local Eyes"

2. `public/projects/tourmitra-explore.png`
   - The destination explorer with Jaipur and Agra cards

3. `public/projects/tourmitra-ai-planner.png`
   - The AI trip planner interface with "Where do you want to go?"

### Voyager (3 images)
Save your screenshots to these exact paths:

1. `public/projects/voyager-listings.png`
   - The property listing grid with multiple accommodations

2. `public/projects/voyager-detail.png`
   - The "Enjoy the Nainital" property detail page

3. `public/projects/voyager-create.png`
   - The create listing form interface

## How to View

1. Start the dev server: `npm run dev`
2. Go to http://localhost:8443
3. Click on a project card (Tourmitra or Voyager)
4. Click the **"Gallery"** tab at the top
5. Your images will appear in a beautiful slider!

## Current Status

✅ Image metadata configured in `src/data.ts`
✅ Gallery tab component ready (`ProjectSlider`)
❌ Image files need to be saved to `public/projects/` folder

Once you save the 6 image files, everything will work automatically!
