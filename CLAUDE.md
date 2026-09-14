@AGENTS.md

# Frontend Development Guidelines

## Architecture

- Follow the existing project architecture.
- Reuse existing components and utilities.
- Do not introduce duplicate abstractions.
- Follow the existing atomic component structure.

## API

- Use generated API client/services.
- Never manually use fetch() when a generated service exists.
- Never duplicate generated request/response types.
- Never create a second Axios/API layer.
- Treat generated API types as the source of truth.

## UI/UX

- Build clean, modern SaaS interfaces.
- Avoid generic AI-generated UI patterns.
- Avoid excessive gradients, glassmorphism, blobs, and excessive shadows.
- Prefer neutral backgrounds with restrained brand accents.
- Yellow should be used as an accent, not as the dominant page background.
- Prioritize hierarchy, whitespace, accessibility, and responsive behavior.

## Forms

- Reuse existing form components.
- Reuse React Hook Form/Zod if already configured.
- Handle loading, validation, error, empty, and success states.

## Code Quality

- TypeScript strictness should be preserved.
- Prefer existing dependencies over adding new ones.
- Do not refactor unrelated parts of the application.
- Keep components maintainable and composable.
- Review implementation as a senior frontend engineer before finishing.
