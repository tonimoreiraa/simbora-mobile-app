# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simbora is a React Native mobile e-commerce application for iOS and Android, featuring user authentication, product catalog, shopping cart, order management, and user profiles.

## Tech Stack & Architecture

- **Framework**: React Native 0.76.1 with TypeScript
- **Navigation**: React Navigation v7 (Stack and Bottom Tabs)
- **State Management**: React Context + React Query v3 for API state
- **Styling**: NativeWind (Tailwind CSS for React Native) + twrnc
- **API Client**: Auto-generated from OpenAPI with Orval + Axios
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: JWT tokens with cookie-based sessions
- **Package Manager**: pnpm (check yarn.lock and pnpm-lock.yaml)

## Development Commands

```bash
# Start Metro bundler
npm start

# Run on platforms
npm run ios
npm run android

# Code quality
npm run lint      # ESLint
npm run test      # Jest testing

# Conventional commits
npm run commit    # Uses commitizen for standardized commits
```

## Project Structure

- `src/screens/` - Screen components (home, cart, auth, products, etc.)
- `src/components/` - Reusable UI components
- `src/contexts/` - React Context providers (auth, cart)
- `src/services/` - API client and business logic
  - `client/` - Auto-generated API client from Orval
  - `openapi.json` - API schema source
- `src/validators/` - Zod schemas for form validation
- `src/helpers/` - Utility functions
- `src/assets/` - SVG icons and images
- `routes.tsx` - Navigation structure

## API Integration

- API client is auto-generated using **Orval** from `src/services/openapi.json`
- Base URL configured in `src/services/axios.ts` (currently localhost:3333)
- Uses React Query for caching, loading states, and error handling
- Authentication handled via cookies with `withCredentials: true`

## Key Development Notes

### Code Generation
```bash
# Regenerate API client after OpenAPI schema changes
npx orval
```

### Styling Approach
- Uses NativeWind for Tailwind-style React Native styling
- Additional utility library `twrnc` for dynamic styles
- Custom components follow React Native patterns

### State Management Pattern
- Global state: React Context (AuthProvider, CartProvider)
- Server state: React Query hooks in service layers
- Form state: React Hook Form with Zod validation

### Navigation Structure
- Bottom tabs for main sections (Home, Categories, Cart, Account)
- Stack navigation for detailed flows
- Route definitions in `routes.tsx`

## Testing

Run tests with `npm run test` using Jest framework.

## Important Files

- `App.tsx` - Root component with providers setup
- `src/services/axios.ts` - HTTP client configuration
- `orval.config.ts` - API code generation configuration
- `global.css` - NativeWind CSS imports