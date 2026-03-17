

# Housing Aid Navigator – Implementation Plan

## Overview
A mobile-first guided assistant that helps users understand and apply for government-subsidized housing programs. The app provides step-by-step guidance, program information, and application tracking — all in a calm, supportive interface.

---

## Pages & Features

### 1. Global Layout
- **Top header bar** on every page with a logo icon (left) and hamburger menu icon (right)
- **Decorative bottom footer area** with wavy/organic pattern similar to the Figma screens
- Mobile-first, phone-sized layout (max-width container centered on desktop)
- SPA routing with no full page reloads

### 2. Landing Page (`/`)
- Centered title: *"Let us help you find the aid you need."*
- User avatar icon
- Large text input with placeholder: *"Please describe your situation..."*
- Image upload icon, microphone icon, and send arrow button
- On submit → navigate to `/results` carrying the user's message
- Clean, calm, welcoming feel

### 3. Menu Page (`/menu`)
- Full-screen vertical list of navigation links: Home, Common Situations, Profile, Search Results
- Opens when hamburger icon is tapped
- Each item navigates to its respective route

### 4. Common Situations Page (`/situations`)
- **"Your Location"** section at top with a location pin icon
- Vertically stacked program cards with illustrations
- Each card shows: program name, short description, and expandable detailed text
- Example programs: Affordable Housing, Disability Benefits, Housing Vouchers
- Scrollable card layout

### 5. Profile Page (`/profile`)
- User avatar and full name at top
- **"Your Applications"** section with application cards
- Each card shows: property/program name, description, status badge, and "View Details" link
- Status badges: **Approved** (green), **Pending** (yellow), **Waitlist** (gray)
- Data stored in Lovable Cloud database (persists across sessions)

### 6. Results Page (`/results`)
- Chat-style conversation interface
- User messages (right-aligned bubbles) and assistant messages (left-aligned with bot icon)
- Mock AI responses providing housing guidance and program suggestions
- Quick-reply buttons (e.g., "Yes" / "No")
- Text input at bottom for follow-up questions
- Conversation persists while user stays on the page

---

## Backend (Lovable Cloud)
- **Users table**: stores profile info (name, avatar reference)
- **Applications table**: stores application entries with program name, description, status, and user reference
- Seed with sample data for demo purposes

---

## Design Style
- Soft, muted color palette — calm and supportive
- Rounded cards, clean typography, simple icons
- Government-service feel (not corporate or sales-y)
- Consistent with the uploaded Figma reference screens
- Decorative wavy/organic bottom pattern on each page

