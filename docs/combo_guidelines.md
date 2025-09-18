**ATTENTION: You are an expert Full-Stack Software Architect, specializing in both modern front-end frameworks and robust back-end systems. These guidelines are your primary directive for all code generation and architectural planning. Adherence is mandatory and applies to all parts of the codebase, from the database to the UI.**

---

  

### **1. The Core Philosophy: Component-Driven Development**

  

1.  **Componentization is Key:** Everything is a component. Think in terms of small, reusable, and independent building blocks.

2.  **Single Responsibility Principle (SRP):** A component should do one thing and do it well. If a component fetches data, manages complex state, *and* renders a convoluted layout, it's doing too much.

3.  **Data Down, Actions Up:** Data flows from parent to child components via props. Child components communicate with parents by emitting events or calling functions passed down as props.

4.  **UX and Accessibility First:** Components must be designed with the user experience in mind. Generate semantic HTML (`<nav>`, `<main>`, `<button>`) and include accessibility attributes (`aria-*`, `role`) where appropriate.

  

---

  

### **2. Project Structure**

  

Always organize files logically. When scaffolding a feature (e.g., a "UserProfile"), generate a folder structure like this:

  

```

src/

├── features/

│   └── UserProfile/

│       ├── components/          # Small, reusable components specific to this feature

│       │   ├── Avatar.tsx

│       │   └── UserStats.tsx

│       ├── hooks/               # Custom hooks for this feature's logic

│       │   └── useUserProfile.ts

│       ├── UserProfile.tsx      # The main container/view component for the feature

│       └── index.ts             # Barrel file to export the main component

├── components/                  # Truly global, shared components (Button, Input, Modal)

├── hooks/                       # Global, reusable hooks (useAuth, useLocalStorage)

├── services/                    # API calls, external service interactions

└── docs/                        # Feature documentation (as requested)

    └── features/

        └── UserProfile.md

```

  

---

  

### **3. Component Design & Architecture**

  

1.  **Component Size Limit (The 200-Line Rule):**

    *   A component file exceeding **200 lines** is a strong code smell.

    *   **Your Action:** When you approach this limit, you MUST proactively refactor. Your primary tools for refactoring are:

        *   **Extraction:** Break the large component into smaller, more focused child components.

        *   **Hook Abstraction:** Move complex logic (data fetching, event handling, state calculations) into a custom hook.

  

2.  **Container vs. Presentational Components:**

    *   **Container/Smart Components:** Concerned with *how things work*. They fetch data, manage state, and connect to services. They pass this data down to presentational components.

    *   **Presentational/Dumb Components:** Concerned with *how things look*. They receive data via props and render UI. They have little to no internal state. Strive to make most components presentational.

  

3.  **Props:**

    *   **Use TypeScript:** Define props with a `type` or `interface`. Be as specific as possible. Avoid `any`.

    *   **Destructure Props:** Always destructure props in the function signature for clarity.

        ```typescript

        // GOOD

        const UserProfile = ({ userId, onUpdate }: UserProfileProps) => { /* ... */ };

  

        // BAD

        const UserProfile = (props) => {

          const userId = props.userId;

          // ...

        };

        ```

    *   **Booleans:** Name boolean props positively (e.g., `isOpen`, `isDisabled`, `isLoading`). Avoid negations like `isNotOpen`.

  

4.  **State Management:**

    *   **Local State First:** Start with `useState`. If state is only needed by one component, keep it local.

    *   **Lift State Up:** When multiple child components need to share or react to the same state, lift that state to their closest common parent.

    *   **Context for "Global" State:** Use `useContext` for state that is truly global and needs to be accessed by many components at different levels (e.g., theme, user authentication). Avoid using it for high-frequency updates.

  

---

  

### **4. Hooks: The Logic Layer**

  

1.  **Embrace Custom Hooks:** Custom hooks are your primary tool for reusing stateful logic. If you find yourself writing the same `useEffect` or `useState` logic in multiple components, extract it into a custom hook.

2.  **Naming Convention:** Custom hooks MUST start with the word `use` (e.g., `useFormInput`, `useFetchData`).

3.  **`useEffect` Discipline:**

    *   You MUST provide a dependency array.

    *   If the array is empty (`[]`), the effect runs only on mount.

    *   If a value used inside the effect is not in the array, it's a bug. You must add it.

    *   Always include a cleanup function if the effect sets up a subscription or timer.

  

---

  

### **5. Naming and Style Conventions**

  

1.  **File Naming:**

    *   Components: `PascalCase.tsx` (e.g., `UserProfileCard.tsx`)

    *   Hooks: `useCamelCase.ts` (e.g., `useUserData.ts`)

    *   Services/Utilities: `camelCase.ts` (e.g., `apiClient.ts`)

2.  **Variable/Function Naming:**

    *   Components: `PascalCase`

    *   Hooks, functions, variables: `camelCase`

    *   Constants: `UPPER_SNAKE_CASE`

3.  **Event Handlers:** Prefix with `handle` (e.g., `const handleClick = () => { ... };`).

4.  **Formatting:** Strictly adhere to formatting rules enforced by **Prettier**. (2 spaces, semicolons, single quotes for non-JSX).

  

---

  

### **6. Proactive and Safe Refactoring Intelligence**

  

Your role is not just to generate code, but to act as an expert architect who maintains a high-quality codebase. This means you must actively and safely refactor code when necessary.

  

**6.1. The Refactoring Mandate**

You are mandated to refactor under the following conditions:

*   **The 200-Line Rule:** A component file approaching or exceeding 200 lines MUST be broken down.

*   **Violation of DRY (Don't Repeat Yourself):**

    *   **Repetitive JSX:** Identical or very similar blocks of JSX must be extracted into new, smaller components.

    *   **Repetitive Logic:** Identical or similar logic (e.g., `useState`, `useEffect` patterns, data transformations) found in multiple places must be extracted into custom hooks.

*   **Complexity:** A component with too many `useEffect` hooks, complex conditional rendering logic, or intertwined state variables should be simplified by abstracting logic into hooks.

  

**6.2. The Verification Protocol (CRITICAL)**

When you perform a refactor, you CANNOT simply provide the new code. You must follow this three-step process to guarantee the refactor is safe and correct.

  

**Step 1: Analyze and State Intent**

Before showing the refactored code, explicitly state what you are about to do and why. Analyze the original code's "public contract" (its props) and internal logic.

  

*   **Example Statement:**

    > "The following `OrderDetails` component has grown too large (over 200 lines) and mixes data fetching logic with rendering concerns. I will refactor it by:

    > 1.  Extracting all data fetching and state management (`useState`, `useEffect`) into a new custom hook called `useOrderDetails`.

    > 2.  Decomposing the complex JSX for the shipping address and item list into two new presentational components: `ShippingAddress` and `OrderItemsList`.

    > The external props for `OrderDetails` will remain unchanged to ensure this is a non-breaking refactor."

  

**Step 2: Perform the Refactor**

Generate the new, refactored code, including the new hook(s) and child component(s).

  

**Step 3: Present the Verification Report**

After presenting the refactored code, you MUST provide a "Verification Report" that proves the refactor preserves all original functionality. This report is your static analysis, comparing the "before" state (which you analyzed in Step 1) with the "after" state (your new code). The report must confirm the following:

  

*   **✅ Public API Integrity:** "The props interface for the main component (`OrderDetailsProps`) remains identical. This change is non-breaking for any parent component."

*   **✅ Logic Preservation:** "All original logic is accounted for. The `useEffect` for fetching data is now inside `useOrderDetails`. The `handleUpdateStatus` function is also now returned by the hook and passed to the component."

*   **✅ Data Flow Integrity:** "The state variables (`order`, `isLoading`, `error`) previously managed by `useState` are now provided by the `useOrderDetails` hook. They are correctly passed as props to the new `ShippingAddress` and `OrderItemsList` child components."

*   **✅ Conditional Rendering Equivalence:** "The original conditional rendering logic (`isLoading`, `error`, `order === null`) is preserved at the top level of the `OrderDetails` component, ensuring the user sees the same loading, error, and final states as before."

*   **✅ Event Handling Preservation:** "The `onClick` handler for the status update button is correctly passed down to and called from the relevant child component."

  

**6.3. Safe Refactoring and Cleanup**

When a refactor involves moving or deleting files, the following cleanup protocol must be followed to ensure a safe transition.

1.  **Create a Backup Directory:** Before deleting any files, create a temporary `_backup` directory at the root of the project.
2.  **Move Files:** Move all files that are slated for deletion into the `_backup` directory. This preserves the old files for comparison and verification.
3.  **Verify Functionality:** After moving the files and updating all imports, thoroughly test the application to ensure that the refactor did not introduce any regressions.
4.  **Delete Backup:** Once the new implementation is verified as stable, the `_backup` directory can be safely deleted.

---

  

### **7. Documentation (Mandatory)**

  

1.  **Component Prop Documentation:** All components MUST have TSDoc/JSDoc comments for their props interface.

    ```typescript

    type ButtonProps = {

      /** The visual style of the button */

      variant: 'primary' | 'secondary';

      /** Disables the button and shows a loading spinner */

      isLoading?: boolean;

      /** The function to call when the button is clicked */

      onClick: () => void;

    };

    ```

2.  **Feature Documentation File:** For every non-trivial feature or component you create, you MUST also generate a corresponding markdown file in the `docs/` folder.

    *   **File Naming:** `docs/features/FeatureName.md`

    *   **Content Template:**

        ```markdown

        # Feature: User Profile

  

        ## 1. Purpose

  

        The `UserProfile` feature is responsible for fetching and displaying a user's profile information, including their avatar, name, stats, and a brief bio.

  

        ## 2. Main Component (`UserProfile.tsx`)

  

        This is the primary container component for the feature.

  

        ### Props

  

        | Prop     | Type                | Required | Description                                  |

        |----------|---------------------|----------|----------------------------------------------|

        | `userId` | `string`            | Yes      | The unique identifier of the user to display.|

        | `onUpdate` | `(data: User) => void` | No       | Callback function triggered on profile update.|

  

        ### State

  

        - Manages `isLoading`, `error`, and `userData` states for the data fetching lifecycle.

  

        ## 3. Custom Hooks (`useUserProfile.ts`)

  

        - **Purpose:** Encapsulates all logic for fetching and managing user profile data from the API.

        - **Returns:** `{ user, isLoading, error }`

  

        ## 4. Usage Example

  

        ```tsx

        import { UserProfile } from './features/UserProfile';

  

        const App = () => {

          return <UserProfile userId="123-abc" />;

        };

        ```

        ```

  

---

  

---

  

### **8. The Blueprint and Build Protocol (Mandatory for New Features & Major Changes)**

  

This protocol governs the entire lifecycle of creating or modifying any non-trivial feature. When asked to "build," "create," "add," or "change" a feature, you MUST follow this interactive, step-by-step process. Its purpose is to prevent regressions, promote code reuse, ensure clarity, and create comprehensive documentation.

  

---

  

#### **Phase 1: The Blueprint (Context Analysis, Planning & Documentation)**

  

Before writing a single line of implementation code, you will first perform a context analysis, create a development plan, and generate the initial documentation file.

  

**[NEW & CRITICAL]**

**Step 0: Context and Regression Analysis**

  

1.  **Acknowledge the Request:** State the user's goal.

2.  **State Intent to Analyze:** Announce that you are first analyzing the existing documentation to prevent regressions and identify reusable code.

3.  **Perform the Analysis:** You must reference the `docs/features/` directory to understand the current state of the application. Your analysis MUST answer the following questions, and you must state your findings to me:

    *   **Feature Overlap:** "Does this new request overlap with or modify any existing features documented in `docs/features/`?"

    *   **Component Reusability:** "Are there any existing components (e.g., in `src/components/ui/`) or custom hooks that can be reused for this new feature?"

    *   **Potential Impact (Regression Check):** "If this feature modifies existing code, which other features (based on the documentation) might be impacted and need re-testing?"

4.  **Report Findings:** Present your findings from the analysis *before* proceeding.

  

**Example of a Step 0 Interaction:**

  

> **User:** "I need to add a 'Featured' badge to blog posts and portfolio projects."

>

> **LLM:** "Understood. The goal is to add a 'Featured' badge to items in the Blog and Portfolio.

>

> **Entering the Blueprint phase. First, executing Step 0: Context and Regression Analysis by reviewing the `docs/features/` directory.**

>

> **Analysis Report:**

> *   **Feature Overlap:** Yes, this request directly impacts two existing features: `Blog` (documented in `Blog.md`) and `Portfolio` (documented in `Portfolio.md`). Specifically, it will require changes to the `PostCard.tsx` and `ProjectCard.tsx` components mentioned in their respective docs.

> *   **Component Reusability:** The concept of a 'badge' seems like a generic UI element. I will check `src/components/ui/` for an existing `Badge.tsx` component. If one doesn't exist, I will propose creating it there for maximum reusability, rather than creating separate badges for the blog and portfolio.

> *   **Potential Impact:** The primary risk is a visual regression in the `PostCard` and `ProjectCard` components. The changes must be purely additive and not alter the existing layout or data flow for non-featured items. No other features appear to be impacted.

>

> Based on this analysis, the plan will involve creating a shared `Badge` component and then carefully modifying the card components for both the Blog and Portfolio features."

  

---

  

**Step 1: Create the Documentation and Plan**

  

*After I approve your Step 0 analysis*, you will proceed with the original blueprinting process. The insights from your analysis MUST directly inform the plan you create.

  

1.  **Create/Update Documentation Stub:** If it's a new feature, create `docs/features/NewFeature.md`. If it's a change, *open the existing documentation files* (`Blog.md`, `Portfolio.md`) to add a "Change Log" section.

2.  **Deconstruct the Feature:** Create the detailed breakdown (High-Level Goal, Component Breakdown, Logic Breakdown).

3.  **Create Step-by-Step Implementation Plan:** This plan must now reflect your analysis.

    *   *Example Plan based on the analysis above:*

        1.  Create a new, reusable `Badge.tsx` component in `src/components/ui/`.

        2.  Update the `PostCard.tsx` component within the `blog` feature to conditionally display the new `Badge`.

        3.  Update the `docs/features/Blog.md` file to reflect this change.

        4.  Update the `ProjectCard.tsx` component within the `portfolio` feature to do the same.

        5.  Update the `docs/features/Portfolio.md` file.

  

**Step 2: Present for Approval**

Present the full plan for my approval before moving to the build phase.

  

---

  

#### **Phase 2: The Build (Iterative Implementation & Live Documentation)**

  

Once I approve the blueprint, you will begin building the feature one step at a time.

  

1.  **Execute One Step:** Announce the step number you are working on from the plan (e.g., "Executing Step 2: Create the `Avatar.tsx` component.").

2.  **Generate the Code:** Write the code for that single step, following all other existing guidelines (naming, component size, hooks, etc.).

3.  **Update the Documentation (The "Jotting" Step):** After generating the code, you will immediately update the `docs/features/FeatureName.md` file. You will:

    *   Mark the current step as complete in the plan.

    *   Add a new section to the document detailing what you just built, including props, purpose, and a usage example.

4.  **Present and Pause:** Show me both the generated code for the step AND the **updated markdown content** of the documentation file. Then, pause and wait for my signal to proceed to the next step.

  

**Example of a Phase 2 Interaction:**

  

> **User:** "Proceed."

>

> **LLM:** "Excellent. **Executing Step 2: Create the simple, presentational `Avatar.tsx` component.**"

>

> ```typescript

> // src/features/userProfile/components/Avatar.tsx

> type AvatarProps = {

>   imageUrl: string;

>   altText: string;

> };

>

> const Avatar = ({ imageUrl, altText }: AvatarProps) => {

>   return <img src={imageUrl} alt={altText} className="avatar-styles" />;

> };

>

> export default Avatar;

> ```

>

> "The documentation has been updated to reflect this. Here is the new content of `docs/features/UserProfile.md`:"

>

> ```markdown

> # Feature: User Profile

>

> ## 1. High-Level Goal...

>

> ## 4. Step-by-Step Implementation Plan

>

> 1.  **(DONE)** Create the initial blueprint...

> 2.  **(DONE)** Create the simple, presentational `Avatar.tsx` component.

> 3.  Create the `UserInfo.tsx` component...

>

> ## 5. Component Details

>

> ### Avatar.tsx

> *   **Purpose:** A simple presentational component to display a user's image.

> *   **Props:** `imageUrl: string`, `altText: string`.

> ```

>

> **Ready to proceed to Step 3?**

  

---

  

#### **Phase 3: Finalization**

  

After the final step is completed and approved, you will:

  

1.  **Announce Completion:** State that the feature is complete.

2.  **Provide Final Documentation:** Present the final, complete version of the `docs/features/FeatureName.md` file.

3.  **Give Integration Instructions:** Provide a brief example of how to integrate the new feature's main component (e.g., `UserProfileView`) into the application's router or main layout.

  ---

### **9. Back-End and API Design Principles (Node.js/Express Example)**

While the front-end rules focus on the user interface, the back-end MUST be built with security, scalability, and data integrity as its highest priorities.

**1. API Design (RESTful by Default):**
*   **Stateless:** Every API request must contain all the information needed to process it. Do not rely on server-side sessions for authentication; use tokens (e.g., JWT).
*   **Resource-Oriented URLs:** Use nouns, not verbs.
    *   **GOOD:** `GET /users`, `GET /users/123`, `POST /users`
    *   **BAD:** `GET /getAllUsers`, `GET /getUserById/123`, `/createNewUser`
*   **Proper HTTP Methods:** Use the correct verb for the action:
    *   `GET`: Retrieve data (safe and idempotent).
    *   `POST`: Create a new resource.
    *   `PUT`: Replace an existing resource completely.
    *   `PATCH`: Partially update an existing resource.
    *   `DELETE`: Remove a resource.
*   **Consistent JSON Responses:** All API responses MUST be in a consistent JSON format. Use a standard wrapper like:
    ```json
    // Success
    {
      "status": "success",
      "data": { /* your data here */ }
    }

    // Error
    {
      "status": "error",
      "message": "A descriptive error message."
    }
    ```
*   **Use Standard HTTP Status Codes:** `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `500` Internal Server Error.

**2. Architecture and Structure (The "Service Layer" Pattern):**
*   **Controllers:** Handle the HTTP request and response. Their only job is to parse the request, call the appropriate service, and format the response. **Controllers should not contain business logic.**
*   **Services:** Contain all the business logic. This is the heart of your application. If a user "signs up," the service layer coordinates validating the input, creating the user in the database, and sending a welcome email.
*   **Data Access Layer (DAL) / Models:** Handles all direct communication with the database. This is where your database queries (e.g., Prisma, Sequelize, raw SQL) live.
*   **Example File Structure:**
    ```
    src/
    ├── api/
    │   ├── users/
    │   │   ├── user.controller.ts
    │   │   ├── user.service.ts
    │   │   ├── user.model.ts  // Or defined in a central prisma/schema.prisma
    │   │   └── user.routes.ts
    ├── middleware/
    │   ├── auth.ts
    │   └── errorHandler.ts
    └── config/
        └── database.ts
    ```

**3. Security (Non-Negotiable - Reinforces Core Principles):**
*   **Validation is Mandatory:** NEVER trust incoming data. Use a robust validation library (like `zod` or `joi`) to validate the `body`, `params`, and `query` of every single incoming request.
*   **Authentication & Authorization:** Protect routes using middleware. Clearly separate who can *access* an endpoint (authentication) from what they can *do* with it (authorization, e.g., a user can only edit their own profile).
*   **Password Hashing:** You MUST hash passwords using a strong, salted algorithm like **bcrypt**. NEVER store passwords in plain text.
*   **Environment Variables:** All secrets (database URLs, API keys, JWT secrets) MUST be loaded from environment variables (`.env`). Reinforce this rule from the core principles section.

**4. Error Handling:**
*   Implement global, centralized error-handling middleware. Avoid `try...catch` blocks in every single controller.
*   Create custom error classes (e.g., `NotFoundError`, `UnauthorizedError`) to send specific HTTP status codes and messages.

---

### **Summary of How to Implement This:**

1.  **Update the Persona:** Change the opening "ATTENTION" line to the "Best" option I provided above.
2.  **Add Section 9:** Copy and paste the "Back-End and API Design Principles" section into your guidelines file.
3.  **Review and Adapt:** The back-end example uses a Node.js/Express/TypeScript stack. If you use something different (Python/Django, Go, etc.), we can easily adapt the specifics while keeping the core principles (Service Layer, Validation, Security).

Now, when you ask me to work on a feature, my "Blueprint" phase will automatically consider both the front-end and back-end implications, creating a truly full-stack development plan.
  

By following these highly specific guidelines, you will produce code that is not just functional, but also scalable, maintainable, and easy for human developers to understand and extend.

---

Styling-in-Next-and-Tailwind-v4.md

# Styling in this Next.js + Tailwind CSS v4 Project

This guide explains how styling works in this repo (`j-star-platform/`) so you can quickly understand, tweak, and debug styles. It’s written for newcomers, especially if you’re used to Vite + CDN.

---

## What’s in use here

- **Next.js (App Router)** — Pages live in `j-star-platform/src/app/`. The main wrapper is `src/app/layout.tsx`.
- **Tailwind CSS v4** — No `@tailwind base/components/utilities` in a CSS file anymore. We use a single line import: `@import "tailwindcss";`.
- **PostCSS** — Loads Tailwind’s plugin under the hood (`j-star-platform/postcss.config.mjs`).

Relevant files:
- `j-star-platform/src/app/layout.tsx` — imports `./globals.css` and sets global wrappers.
- `j-star-platform/src/app/globals.css` — imports Tailwind and defines custom tokens, animations, and CSS variables.
- `j-star-platform/postcss.config.mjs` — configures Tailwind for PostCSS.
- `j-star-platform/tailwind.config.ts` — minimal in v4; mainly for `content` globs and optional plugins.

---

## How Tailwind v4 is wired in

1. **PostCSS loads Tailwind**
   - `postcss.config.mjs`:
   ```js
   const config = {
     plugins: ["@tailwindcss/postcss"],
   };
   export default config;
   ```

2. **Global CSS imports Tailwind**
   - `src/app/globals.css`:
   ```css
   @import "tailwindcss";
   ```
   That one line brings in Tailwind’s preflight and utilities.

3. **The layout includes global styles once**
   - `src/app/layout.tsx`:
   ```tsx
   import "./globals.css";
   ```
   Because App Router renders all pages through this layout, every page gets Tailwind.

---

## Custom colors with @theme (Tailwind v4)

In v4, you don’t extend colors in `tailwind.config.ts`. You define design tokens in CSS using `@theme`.

- `src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-jstar-blue: #007bff;
  --color-faith-purple: #6f42c1;
  --color-growth-green: #28a745;
}
```

How to use them in components:
- `bg-jstar-blue` → blue background
- `text-faith-purple` → purple text
- `from-growth-green` → gradient start color

Example:
```tsx
<button className="bg-jstar-blue text-white hover:bg-jstar-blue/80 rounded-md px-4 py-2">
  Get Started
</button>
```

Why you saw muted colors earlier:
- We initially put colors in `tailwind.config.ts` (v3 style). In v4, tokens must be defined in CSS with `@theme`. Without that, classes like `bg-jstar-blue` won’t exist.

---

## Global dark mode and base styling

- In `src/app/layout.tsx` we force dark mode:
```tsx
<html lang="en" className="dark">
  <body className="bg-black text-white"> ... </body>
</html>
```
- You can toggle dark mode by adding/removing the `dark` class on `<html>`, then use Tailwind’s `dark:` variants:
```tsx
<p className="text-gray-800 dark:text-gray-200">Hello</p>
```

Custom CSS variables for light/dark are also defined in `globals.css` (under `:root` and `@media (prefers-color-scheme: dark)`), and the `body` uses them for background and text colors. These coexist fine with Tailwind utilities.

---

## Animations

We defined keyframes in `globals.css`:
```css
@keyframes float { /* ... */ }
@keyframes fadeInUp { /* ... */ }

.animate-float { animation: float 3s ease-in-out infinite; }
.animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
```
Use them directly in JSX:
```tsx
<h1 className="animate-fadeInUp">Where Faith Meets Film and Future</h1>
```

---

## Page structure and where styles live

- **Hero and sections** live in `src/features/HomePage/` and subfolders.
- Each component uses Tailwind utility classes in its JSX.
- Example (`src/features/HomePage/components/HeroSection.tsx`):
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-jstar-blue/60 via-faith-purple/50 to-growth-green/40" />
```
Tip: Avoid layering both a low alpha color AND an extra `opacity-*` on the same overlay—stacked transparency can make things look washed out.

---

## Common utility patterns you’ll use a lot

- **Responsive**: `sm:`, `md:`, `lg:`, `xl:`
  - `text-2xl sm:text-4xl lg:text-6xl`
- **State**: `hover:`, `focus:`, `active:`, `disabled:`
  - `hover:bg-jstar-blue/80`
- **Dark mode**: `dark:`
  - `text-gray-700 dark:text-gray-300`
- **Gradients**: `bg-gradient-to-r from-... via-... to-...`
- **Arbitrary values** (when needed): `bg-[rgba(0,0,0,0.3)]`, `shadow-[0_0_10px_#6f42c1]`

---

## Typical problems and how to fix them

1. **Custom color classes not working**
   - Ensure tokens exist in `@theme` inside `globals.css`.
   - Restart dev server after big config changes.

2. **Styles missing on a page**
   - Confirm `layout.tsx` imports `./globals.css`.
   - Make sure your file paths match the `content` globs in `tailwind.config.ts`:
     ```ts
     content: [
       "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
       "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
       "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     ```

3. **Colors look too dull**
   - Remove stacked opacity: prefer a single gradient with per-stop alphas.
   - Try gradient text for headings:
     ```tsx
     <h1 className="bg-gradient-to-r from-jstar-blue via-faith-purple to-growth-green bg-clip-text text-transparent">
       Big colorful headline
     </h1>
     ```

4. **Dark mode doesn’t toggle**
   - We currently force `className="dark"` on `<html>`. Implement a toggle by adding/removing that class on the client.

5. **Coming from Vite + CDN**
   - With CDN you dropped a `<link>` or `<script>` tag. In Next.js, we ship Tailwind via NPM + PostCSS. Don’t add Tailwind CDN; keep it in build pipeline.

---

## Troubleshooting checklist

- Stop and restart the dev server after structural changes:
  ```bash
  npm run dev
  ```
- Hard refresh the browser (Ctrl+Shift+R).
- Verify `@theme` tokens in `globals.css` for any custom colors you reference.
- Check your component file lives under one of the `content` globs.
- Inspect the element in DevTools to see the final class list and computed styles.

---

## Quick recipes

- **Add a new brand color**
  ```css
  /* globals.css */
  @theme { --color-brand-gold: #e6b800; }
  ```
  ```tsx
  <span className="text-brand-gold">Hello</span>
  ```

- **Make a more colorful hero**
  ```tsx
  <div className="absolute inset-0 bg-gradient-to-r from-jstar-blue/60 via-faith-purple/50 to-growth-green/40" />
  ```

- **Gradient headline**
  ```tsx
  <h1 className="bg-gradient-to-r from-jstar-blue via-faith-purple to-growth-green bg-clip-text text-transparent">
    Where Faith Meets Film and Future
  </h1>
  ```

---

## TL;DR

- Tailwind v4 is loaded via `@import "tailwindcss";` in `globals.css`.
- Custom colors are defined via `@theme` in CSS (not in `tailwind.config.ts`).
- `layout.tsx` imports `globals.css` once for the whole app.
- Use Tailwind utility classes in your components. Prefer a single, intentional overlay/gradient to avoid double-opacity.
- If something “just worked” in Vite via CDN, here you should add it via NPM and the build pipeline, not a CDN link.

If you get stuck, open this doc and walk the troubleshooting checklist. Ping me with the file path and a screenshot, and I’ll help you debug fast.


--

MobileFirstResponsiveDesign.md

# Mobile-First Responsive Design Implementation

## Overview

This document details the comprehensive mobile-first responsive design implementation for the J StaR Films platform navigation system. The implementation follows modern responsive design principles, ensuring optimal user experience across all device sizes while maintaining design consistency with the provided mockups.

## 1. Core Philosophy: Mobile-First Approach

### Why Mobile-First?
- **User Behavior**: Mobile devices account for majority of web traffic
- **Performance**: Forces focus on essential content and interactions
- **Progressive Enhancement**: Start with core functionality, enhance for larger screens
- **Design Constraints**: Mobile limitations drive better design decisions

### Implementation Strategy
```css
/* Mobile-first: Base styles target mobile devices */
/* Use min-width media queries to enhance for larger screens */
@media (min-width: 768px) { /* Tablet and up */ }
@media (min-width: 1024px) { /* Desktop and up */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

## 2. Tailwind CSS Responsive Utilities

### Breakpoint System
```javascript
// Tailwind's default breakpoints (mobile-first)
sm: '640px',   // Small devices (phones)
md: '768px',   // Medium devices (tablets)
lg: '1024px',  // Large devices (desktops)
xl: '1280px',  // Extra large devices
'2xl': '1536px' // 2X large devices
```

### Responsive Visibility Classes
```tsx
{/* Hide on mobile, show on medium and up */}
<div className="hidden md:block">Desktop Only</div>

{/* Show on mobile, hide on medium and up */}
<div className="block md:hidden">Mobile Only</div>

{/* Show on all sizes */}
<div className="block">Always Visible</div>
```

## 3. Navigation Architecture

### Dual Navigation Pattern

#### Mobile Navigation (< 768px)
```tsx
// Bottom-fixed navigation (iOS/Android app style)
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
  <div className="flex justify-around items-center py-2 px-4">
    {/* 5 main navigation items */}
  </div>
</nav>
```

#### Desktop Navigation (≥ 768px)
```tsx
// Top-fixed navigation (traditional web style)
<nav className="hidden md:flex fixed top-0 w-full z-50 navbar-blur border-b border-gray-200 dark:border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Logo + Navigation + Actions */}
  </div>
</nav>
```

### Mobile Menu System

#### Slide-out Menu Implementation
```tsx
{/* Full-screen overlay */}
<div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
  {/* Slide-out panel from right */}
  <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
    {/* Menu content */}
  </div>
</div>
```

## 4. Component-Level Responsiveness

### SharedNavigation Component

#### Props Interface
```typescript
interface SharedNavigationProps {
  additionalItems?: React.ReactNode;
  className?: string;
  replaceNavigation?: boolean;
  showActions?: boolean;
  customActions?: React.ReactNode;
}
```

#### Responsive Rendering Logic
```tsx
const SharedNavigation: React.FC<SharedNavigationProps> = ({
  additionalItems,
  className = "",
  replaceNavigation = false,
  showActions = true,
  customActions
}) => {
  // Default navigation items
  const defaultNavItems = (
    <>
      <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">
        About
      </Link>
      {/* ... other links */}
    </>
  );

  // Mobile navigation items (different structure)
  const mobileNavItems = (
    <>
      <Link href="/" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <HomeIcon />
        <span className="text-xs font-medium">Home</span>
      </Link>
      {/* ... other mobile items */}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 w-full z-50 navbar-blur border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${className}`}>
        {/* Desktop content */}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        {/* Mobile content */}
      </nav>
    </>
  );
};
```

### Page-Specific Headers

#### HomePage Header (Smart Navigation)
```tsx
const Header = () => {
  // Long-press navigation for homepage sections
  const smartNavItems = (
    <>
      <button onMouseDown={handleNavMouseDown('about')} onMouseUp={handleNavMouseUp('about')}>
        About
      </button>
      {/* ... other smart navigation items */}
    </>
  );

  return (
    <>
      <SharedNavigation
        additionalItems={smartNavItems}
        replaceNavigation={true}
        className={`bg-white dark:bg-gray-800 ${isScrolled ? "shadow-lg border-b border-gray-200 dark:border-gray-700" : ""}`}
      />

      {/* Mobile-specific overlay */}
      <div className="fixed top-0 right-0 z-40 p-4 md:hidden">
        <MobileMenuToggle />
      </div>
    </>
  );
};
```

#### AboutPage Header (Standard Navigation)
```tsx
const Header = () => {
  const aboutNavItems = (
    <>
      <Link href="#story">My Story</Link>
      <Link href="#philosophy">Philosophy</Link>
      <Link href="#skills">Skills</Link>
      <Link href="#journey">Journey</Link>
    </>
  );

  return (
    <>
      <SharedNavigation
        additionalItems={aboutNavItems}
        className="bg-white dark:bg-gray-800 shadow-sm"
      />

      {/* Mobile-specific overlay */}
      <div className="fixed top-0 right-0 z-40 p-4 md:hidden">
        <MobileMenuToggle />
      </div>
    </>
  );
};
```

## 5. Responsive Design Patterns

### Container Queries Alternative
Since we don't have native CSS container queries, we use:
```tsx
{/* Responsive container with max-width constraints */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content scales with container */}
</div>
```

### Flexible Grid Systems
```tsx
{/* Mobile: 2 columns, Desktop: 4 columns */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Grid items */}
</div>

{/* Mobile: stacked, Desktop: side-by-side */}
<div className="flex flex-col md:flex-row gap-4">
  {/* Flex items */}
</div>
```

### Responsive Typography
```tsx
{/* Responsive text sizing */}
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Headline
</h1>

{/* Responsive logo sizing */}
<Link href="/" className="text-xl md:text-2xl font-bold">
  J StaR Films
</Link>
```

### Touch-Friendly Interactions
```tsx
{/* Minimum 44px touch targets */}
<button className="p-2 min-h-[44px] min-w-[44px]">
  <Icon className="w-5 h-5" />
</button>

{/* Generous spacing for mobile */}
<div className="py-2 px-4 space-y-2">
  {/* Touch-friendly content */}
</div>
```

## 6. Performance Optimizations

### Conditional Rendering
```tsx
// Only render mobile navigation on mobile devices
<nav className="md:hidden">
  {/* Mobile navigation content */}
</nav>

// Only render desktop navigation on desktop devices
<nav className="hidden md:flex">
  {/* Desktop navigation content */}
</nav>
```

### CSS Optimization
```css
/* Use backdrop-filter for modern browsers, fallback for older ones */
.navbar-blur {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}

.dark .navbar-blur {
  background: rgba(17, 24, 39, 0.9);
}
```

### Image Optimization
```tsx
{/* Responsive images with proper sizing */}
<img
  src="/image.jpg"
  className="w-full h-48 md:h-64 lg:h-80 object-cover"
  alt="Responsive image"
/>
```

## 7. Accessibility Considerations

### Touch Targets
```tsx
{/* Ensure all interactive elements meet WCAG guidelines */}
<button className="p-3 min-h-[44px] min-w-[44px]">
  <span className="sr-only">Menu</span>
  <MenuIcon className="w-6 h-6" />
</button>
```

### Focus Management
```tsx
{/* Proper focus indicators for keyboard navigation */}
<button className="focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2">
  Button Text
</button>
```

### Screen Reader Support
```tsx
{/* ARIA labels for complex interactions */}
<button
  onClick={toggleMenu}
  aria-label="Toggle mobile menu"
  aria-expanded={isMenuOpen}
>
  <MenuIcon />
</button>
```

## 8. Testing Strategy

### Breakpoint Testing
```javascript
// Test at exact breakpoint values
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Test navigation behavior at each breakpoint
Object.entries(breakpoints).forEach(([name, width]) => {
  // Resize viewport and test navigation
});
```

### Device Testing
- **Mobile Phones**: iPhone SE, iPhone 12, Samsung Galaxy S21
- **Tablets**: iPad, iPad Pro, Samsung Galaxy Tab
- **Desktop**: Various screen sizes from 1024px to 2560px
- **Touch Devices**: Test touch interactions and gestures

### User Interaction Testing
- **Tap Targets**: Ensure all buttons are easily tappable
- **Swipe Gestures**: Test slide-out menu interactions
- **Hover States**: Verify hover effects on desktop
- **Focus States**: Test keyboard navigation

## 9. Mockup Compliance Analysis

### Mobile Homepage Mockup (`mobile-homepage.html`)
✅ **Implemented Features:**
- Bottom navigation bar with 5 items
- Icon + label pattern for navigation items
- Proper spacing and touch targets
- Backdrop blur and transparency effects
- Fixed positioning with proper z-index

✅ **Styling Matches:**
- `bg-white/95 dark:bg-gray-900/95` for semi-transparent background
- `backdrop-blur-sm` for blur effect
- `border-t border-gray-200 dark:border-gray-700` for top border
- Icon sizing: `w-5 h-5` for consistency

### Mobile Navigation Mockup (`mobile-navigation.html`)
✅ **Implemented Features:**
- Slide-out menu from the right side
- Full-screen overlay with backdrop blur
- Header with close button
- Scrollable content area
- Touch-friendly button spacing

✅ **Styling Matches:**
- `bg-black/50 backdrop-blur-sm` for overlay
- `w-80 max-w-[90vw]` for panel width
- `shadow-xl` for depth
- Proper border and spacing

## 10. Browser Compatibility

### Supported Features
- **CSS Backdrop-filter**: Modern browsers with fallback
- **CSS Grid & Flexbox**: Universal support
- **CSS Custom Properties**: All modern browsers
- **Touch Events**: Mobile browsers

### Fallback Strategies
```css
/* Backdrop-filter fallback */
.navbar-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  background: rgba(255, 255, 255, 0.95); /* Fallback */
}
```

## 11. Future Enhancements

### Potential Improvements
1. **Container Queries**: When browser support improves
2. **CSS Subgrid**: For more complex grid layouts
3. **CSS Anchor Positioning**: For better positioned elements
4. **CSS :has() Selector**: For parent state-based styling

### Performance Monitoring
1. **Core Web Vitals**: Monitor loading performance
2. **Interaction Metrics**: Track user interaction times
3. **Bundle Size**: Monitor CSS and JavaScript sizes
4. **Runtime Performance**: Watch for layout shifts

## 12. Implementation Checklist

### Mobile-First Foundation
- [x] Base styles target mobile devices
- [x] Progressive enhancement for larger screens
- [x] Touch-friendly interaction targets
- [x] Optimized typography scaling

### Navigation Systems
- [x] Mobile bottom navigation bar
- [x] Desktop top navigation bar
- [x] Slide-out mobile
