# Project Instructions for AI Coding Agents

## Project Overview

This project is built using:

- Angular
- TypeScript
- Bootstrap 5
- Angular Material
- Font Awesome
- SCSS
- Reactive Forms
- Mixed Angular Architecture (Standalone Components + NgModule-based Components)

Before generating or modifying code, follow the instructions below.

---

# General Guidelines

- Write clean, readable, maintainable, and production-ready code.
- Follow Angular and TypeScript best practices.
- Keep the code modular and reusable.
- Avoid code duplication.
- Prefer reusable components over copying HTML.
- Follow the existing project architecture and coding style.
- Do not introduce new third-party libraries unless explicitly requested.

---

# Angular Architecture

This project uses both:

- Standalone Components
- NgModule-based Components

Before generating code:

- Detect the architecture used in the current feature.
- Follow the existing implementation.
- Do not convert NgModule components into standalone components.
- Do not convert standalone components into NgModule components.
- Maintain consistency with surrounding code.

---

# UI Guidelines

## Bootstrap (Primary UI Framework)

Bootstrap is the primary UI framework.

Always prefer Bootstrap for:

- Page layouts
- Responsive Grid
- Cards
- Buttons
- Tables
- Alerts
- Badges
- Navigation
- Modals
- Utility classes
- Spacing
- Flex layouts

Prefer Bootstrap utility classes before writing custom CSS.

Examples:

- `container`
- `row`
- `col-*`
- `d-flex`
- `gap-*`
- `mt-*`
- `mb-*`
- `p-*`
- `shadow`
- `rounded`

Minimize custom CSS whenever Bootstrap can achieve the same result.

---

## Angular Material

Angular Material is also used throughout the project.

Use Angular Material when appropriate for:

- Form Fields
- Select Dropdowns
- Date Pickers
- Dialogs
- Snackbars
- Menus
- Expansion Panels
- Tabs
- Tooltips
- Chips
- Progress Indicators
- Autocomplete
- Stepper
- Sidenav
- Data Tables (when already used in that feature)

When creating UI:

- Maintain the existing Material theme.
- Do not replace existing Material components with Bootstrap equivalents unless requested.
- If a feature already uses Angular Material, continue using Angular Material for consistency.
- Bootstrap and Angular Material may be used together when it results in a better user experience.

---

# Icons

Always use **Font Awesome** icons.

Do not introduce other icon libraries unless the project already uses them.

Example:

```html
<i class="fa-solid fa-user"></i>
```

---

# Forms

All forms must use **Reactive Forms**.

Never generate Template-Driven Forms.

Always use:

- FormGroup
- FormBuilder
- FormControl
- Validators

Implement:

- Proper validation
- Error messages
- FormControlName
- Typed form controls where possible

---

# TypeScript

Prefer:

- Strong typing
- Interfaces
- Enums where appropriate
- Optional chaining
- Nullish coalescing
- Readable methods

Avoid:

- any
- Duplicate interfaces
- Unnecessary type assertions

---

# Components

Keep components focused and reusable.

If a section is repeated:

- Create a reusable component.

Keep:

- Business logic in services
- UI logic in components
- Templates clean and readable

---

# Styling

Use:

- SCSS
- Bootstrap utilities
- Existing theme variables
- Existing project color palette

Avoid:

- Inline styles
- Excessive custom CSS
- Hardcoded colors
- `!important` unless absolutely necessary

---

# Responsive Design

Every page must work properly on:

- Desktop
- Tablet
- Mobile

Always use Bootstrap responsive utilities.

Design mobile-first whenever practical.

---

# Code Reuse

Before creating new code:

- Check for existing components.
- Check for shared services.
- Check for shared models.
- Check for shared utilities.
- Check for existing directives and pipes.

Reuse before creating new implementations.

---

# Routing

Follow the existing routing strategy.

Use:

- Lazy Loading where applicable
- Existing route guards
- Existing routing conventions

Do not modify routing unless requested.

---

# Services

Business logic belongs inside services.

Components should primarily:

- Display data
- Handle user interaction
- Call services

Avoid placing large business logic inside components.

---

# Project Structure

Respect the existing folder structure.

Do not move or reorganize files unless requested.

Create new files only when necessary.

---

# Performance

Generate efficient code.

Prefer:

- Reusable components
- Lazy loading
- Optimized rendering
- Minimal DOM nesting
- Efficient loops
- Proper Angular lifecycle usage

Avoid unnecessary complexity.

---

# Code Style

Generate:

- Well-formatted code
- Meaningful variable names
- Meaningful function names
- Proper indentation
- Consistent formatting

Only add comments when they improve clarity.

---

# Existing Theme

When generating UI:

- Match the existing project design.
- Keep the interface modern and professional.
- Maintain consistency with existing pages.
- Use Bootstrap for layout and responsiveness.
- Use Angular Material for advanced components where appropriate.
- Use Font Awesome for icons.

---

# Before Generating Code

Always:

1. Understand the existing implementation.
2. Follow the existing architecture.
3. Reuse existing components.
4. Reuse existing services.
5. Reuse existing models.
6. Match the current UI.
7. Keep the implementation simple.
8. Generate production-ready code.

---

# Default Assumptions

Unless explicitly instructed otherwise:

- Bootstrap is the primary UI framework.
- Angular Material is used for advanced UI components.
- Font Awesome is the standard icon library.
- All forms use Reactive Forms.
- SCSS is used for styling.
- Build responsive layouts.
- Follow Angular and TypeScript best practices.
- Reuse existing code whenever possible.
- Generate clean, maintainable, and production-ready code.