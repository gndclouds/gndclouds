# CLAUDE.md - Coding Guidelines

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs move-assets.js first)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate-backgrounds` - Generate hourly backgrounds
- `npm run beforeBuild` - Update git submodules

## Code Style Guidelines
- **TypeScript**: Use strict typing with interfaces for data objects
- **React Components**: Use functional components with React hooks
- **Imports**: Group imports by type (React, Next.js, UI libraries, local components)
- **Error Handling**: Use try/catch with meaningful error messages in console
- **Naming**: Use camelCase for variables/functions, PascalCase for components/interfaces
- **CSS**: Use Tailwind classes for styling with component-specific modules when needed
- **State Management**: Use React hooks (useState, useEffect) for component state
- **File Organization**: Group related components in subdirectories
- **API Routes**: Use Next.js API routes for backend functionality
- **Responsive Design**: Design for mobile-first using Tailwind breakpoints