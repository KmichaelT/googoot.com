# NanoBanana Brand Generator - Project Notes

## Project Overview
NanoBanana is an MVP application for generating brand mockups using Google's Gemini image generation API. The app collects brand information through a form and generates various mockups displayed in a Bento grid layout.

## Current Architecture

### Core Components
- **BrandForm** (`/components/BrandForm.tsx`): Main form for collecting brand data
  - Collects: name, industry, personality, description, tagline
  - Colors: primary, secondary, accent, dark, light
  - Logos: black, white, fullColor, icon (all as base64)
  - Currently submits to `/api/generate` and redirects to `/result`

- **BentoShowcase** (`/components/BentoShowcase.tsx`): Static display grid
  - Currently shows hardcoded images and colors
  - Uses mockup images from `/public/`
  - Has slots for: 4 mockups, main logo, icon variants, color palette

- **Supporting Components**:
  - `ColorInput`: Color picker with hex display
  - `FileUpload`: Handles logo file uploads to base64
  - `ColorPalette`: Displays color swatches with hex values

### Sample Data Structure
`mvp-sample-mockups.json` contains detailed mockup specifications for:
1. **Mockup1**: Baseball cap with embroidered logo
2. **Mockup2**: Premium aluminum water bottle with screen-printed logo
3. **Mockup3**: Business card with debossed logo
4. **Mockup4**: iPhone with app icon on home screen

Each mockup specifies:
- Logo requirements (which version to use)
- Color applications
- Camera angles and lighting
- Technical specifications

## Development Tasks

### ✅ Completed Integration Tasks
1. **State Management**: ✅ Created BrandContext for sharing data between form and showcase
2. **Dynamic Content**: ✅ BentoShowcase now displays dynamic logos and colors from form
3. **Logo Integration**: ✅ Logo version mapping implemented with mockupUtils
4. **Color Application**: ✅ User-selected colors applied to color palette and logo backgrounds
5. **API Setup**: ✅ Gemini API structure created and fully integrated
6. **API Integration**: ✅ Complete Gemini 2.5 Flash Image API integration
7. **Loading States**: ✅ Loading overlays and error handling implemented
8. **Frontend Integration**: ✅ Form submission triggers API calls and updates showcase

### Current Integration Status
- **Form → API → Showcase Flow**: ✅ Fully Working
- **Logo Display**: ✅ Dynamic - shows uploaded logos in appropriate slots
- **Color Theming**: ✅ Dynamic - uses selected brand colors throughout
- **Gemini API**: ✅ Fully integrated with detailed prompt generation
- **Error Handling**: ✅ Comprehensive error handling and fallbacks
- **Loading States**: ✅ Visual feedback during generation process

### ✅ Complete Integration Workflow
1. **Form Submission**: User fills form with brand data and uploads logos
2. **Context Update**: BrandContext stores data and triggers showcase update
3. **API Generation**: `/api/generate-mockups` endpoint called with brand data
4. **Gemini API**: Detailed prompts sent to Gemini 2.5 Flash Image API
5. **Mockup Generation**: AI generates 4 professional mockups with brand elements
6. **Showcase Update**: Generated images replace placeholders in Bento grid
7. **Loading States**: Visual feedback during generation process
8. **Error Handling**: Graceful fallback to placeholder images on failures

### Technical Implementation
- **API Endpoint**: `/app/api/generate-mockups/route.ts`
- **Gemini Service**: `GeminiService` class with proper authentication
- **Prompt Engineering**: Detailed specifications from sample JSON
- **Logo Mapping**: Automatic selection of appropriate logo versions
- **State Management**: React context with loading and error states
- **UI Feedback**: Loading overlays and error handling

### New Files Created
- `/lib/BrandContext.tsx` - React context for state management
- `/lib/mockupUtils.ts` - Logo mapping and detailed prompt generation
- `/lib/geminiApi.ts` - Complete Gemini API service implementation
- `/app/api/generate-mockups/route.ts` - API endpoint for mockup generation

## Commands
- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production with Turbopack
- `npm run lint`: Run ESLint

## Tech Stack
- Next.js 15.5.4 with React 19
- TypeScript
- Tailwind CSS v4
- Radix UI components
- Lucide React icons