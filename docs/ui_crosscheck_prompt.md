# Prompt for Full UI Cross-Check and Alignment

**Objective:**

Systematically review and update every page (endpoint) in the `j-star-platform` application to ensure it perfectly aligns with its corresponding mockup file.

**Instructions:**

For each of the following pages, please perform the following steps one by one and make sure you edit this file to show your progress by writing [DONE] in brackets for each item:

1.  **Identify the Page and Mockup:** State which page and corresponding mockup file you are about to process from the list below.
2.  **Analyze and Compare:**
    *   Read the relevant mockup file from the `/Mockups` directory. For JohnGPT pages (Phase 2), reference files in `Mockups/02_JohnGPT_Enhanced/pc` for desktop/PC layouts and `Mockups/02_JohnGPT_Enhanced/mobile` for mobile layouts. Ensure you consult both as needed for responsiveness.
    *   Read all the corresponding React component files for the page from the `/j-star-platform/src/features` directory.
    *   Provide a summary of the key differences between the implementation and the mockup, focusing on styling, layout, content, and component structure.
3.  **Implement Changes:**
    *   Update the component files to match the mockup exactly.
    *   Ensure responsive design: Use mobile mockups for small screens (e.g., sm: breakpoint) and PC mockups for larger screens (e.g., lg: breakpoint). Implement Tailwind responsive classes to switch layouts accordingly (e.g., flex-col sm:flex-row).
    *   If any global styles (CSS variables, animations, custom classes) are needed, update `globals.css` according to the project's styling guide.
    *   If any new components are needed, create them following the project's file structure conventions.
4.  **Confirm Completion:** Announce the completion of the page update.
5.  **Await "Proceed":** Wait for my confirmation ("Proceed") before moving to the next page in the list.
6.  **Document Changes:** Document all changes in the feature's docs/features/ file, including responsive implementation details.

---

## List of Pages and Mockups to Process

### Phase 1: Public Website

*   **Page:** `/about` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/about-enhanced.html`
*   **Page:** `/portfolio` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/portfolio-advanced.html`
*   **Page:** `/services` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/services-comprehensive.html`
*   **Page:** `/store` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/store-enhanced.html`
*   **Page:** `/blog` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/blog-list-interactive.html`
*   **Page:** `/blog/[slug]` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/blog-post-view.html`
*   **Page:** `/contact` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/contact-leadgen.html`
*   **Page:** `/vault` **[DONE]**
    *   **Mockup:** `Mockups/01_Public_Website/public-vault-obsidian.html`

### Phase 2: JohnGPT Assistant
**Note:** For JohnGPT (Phase 2), reference mockups from subdirectories `Mockups/02_JohnGPT_Enhanced/pc` for desktop layouts and `Mockups/02_JohnGPT_Enhanced/mobile` for mobile layouts, not the main Mockups directory. Mobile variants are handled responsively within unified components. For /johngpt/chat, the separate mobile endpoint /johngpt/mobile/chat and JohnGPTMobileChatInterface components were merged into the responsive JohnGPTChatInterface. Removed after backup; verified for layout adaptation (vertical stack on sm, horizontal on md+), functionality preservation (message sending, scrolling), no errors. Other JohnGPT mobile endpoints (e.g., /johngpt/mobile/personas) remain for future merges. Emphasize responsive design: on smaller screens (e.g., sm breakpoint), use mobile mockup layouts; on larger screens (e.g., lg breakpoint), switch to PC mockup layouts using Tailwind responsive classes (e.g., flex-col sm:flex-row, hidden sm:block, grid-cols-1 lg:grid-cols-3).

*   **Page:** `/johngpt/chat` **[DONE - Responsive Merge Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/new_chat-interface.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/new_mobile-chat.html` (mobile) - Note: Ensure responsive implementation with Tailwind classes for layout switching.
    *   **Refactor Details:** Added Tailwind responsive classes (e.g., flex-col sm:flex-row, hidden sm:block for sidebar/actions). Tested at 900x600 (mobile: stacked, simplified) and 1280x720 (desktop: full layout). Endpoints checked: Unified /johngpt/chat only; removed /johngpt/mobile/chat.
*   **Page:** `/johngpt/personas` **[DONE - Responsive Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/persona-system.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/persona-system-mobile.html` (mobile) - Note: Responsive implementation complete: stacked cards on mobile (sm breakpoint), grid layout on desktop (lg breakpoint) using Tailwind classes like grid-cols-1 lg:grid-cols-5, flex-col lg:flex-row.
*   **Page:** `/johngpt/history` **[DONE - Responsive Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/conversation-history.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/conversation-history-mobile.html` (mobile) - Note: Responsive implementation complete: full-width list on mobile, sidebar + preview on desktop using Tailwind classes like flex-col lg:flex-row, w-full lg:w-80.
*   **Page:** `/johngpt/prompts` **[DONE - Responsive Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/prompt-library.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/prompt-library-mobile.html` (mobile) - Note: Responsive implementation complete: vertical list on mobile, grid on desktop with Tailwind classes like grid-cols-1 lg:grid-cols-2 xl:grid-cols-3.
*   **Page:** `/johngpt/obsidian` **[DONE - Responsive Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/obsidian-integration.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/obsidian-integration-mobile.html` (mobile) - Note: Responsive implementation complete: stacked form fields on mobile, two-column layout on desktop using Tailwind classes like flex-col lg:grid-cols-2.
*   **Page:** `/johngpt/canvas` **[DONE - Responsive Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/split-view-canvas.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/split-view-canvas-mobile.html` (mobile) - Note: Responsive implementation complete: full-screen chat on mobile, split-view on desktop with Tailwind classes like w-full lg:w-1/2, flex-col lg:flex-row.
*   **Page:** `/johngpt/agent-slot-machine` **[DONE - Responsive Verified]**
    *   **Mockup:** `Mockups/02_JohnGPT_Enhanced/pc/agent-slot-machine.html` (desktop) and `Mockups/02_JohnGPT_Enhanced/mobile/agent-slot-machine-mobile.html` (mobile) - Note: Responsive implementation complete: horizontal scroll tabs on mobile, three-column grid on desktop using Tailwind classes like grid-cols-1 xl:grid-cols-3, overflow-x-auto snap-x.

### Phase 3: Admin Dashboard Pro

*   **Page:** `/admin/dashboard` **[DONE]**
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/dashboard-overview.html`
*   **Page:** `/admin/users`
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/user-management-advanced.html`
*   **Page:** `/admin/analytics`
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/analytics-comprehensive.html`
*   **Page:** `/admin/cms`
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/cms-interface.html`
*   **Page:** `/admin/johngpt-settings`
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/johngpt-settings.html`
*   **Page:** `/admin/system-settings`
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/system-settings.html`
*   **Page:** `/admin/security-center`
    *   **Mockup:** `Mockups/03_Admin_Dashboard_Pro/security-center.html`

---
