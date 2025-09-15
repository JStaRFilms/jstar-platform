# Documentation Folder Guide

**This guide should be read in conjunction with the [coding_guidelines.md](coding_guidelines.md) and [Styling-in-Next-and-Tailwind-v4.md](Styling-in-Next-and-Tailwind-v4.md).**

**When referencing mockups, the model should prioritize the mockups located in the `docs/Mockups` folder. The `docs/JStaR_Mockups` folder should only be used for reference if the user specifically requests it.**

This document outlines the structure and purpose of the `docs` folder. It serves as a central reference for locating design mockups, feature specifications, and other planning documents. Using the tags provided can help keep communication and documentation consistent.

---

## Root Directory Files

The files in the root of the `docs` folder are high-level planning documents, research, and guidelines that apply to the project as a whole.

---

## Folder Descriptions

### `@features`

This directory contains detailed breakdown and documentation for specific application features.

-   **`@features/HomePage`**: Contains documentation specifically for the HomePage feature.

### `@jstar_mockups`

This directory contains various sets of mockups for the JStaR platform, categorized by different design iterations or tools used for generation (e.g., Qoder, Qwen). It represents a history of design exploration.

-   **`@jstar_mockups/Qoder`**: Mockups from the "Qoder" design iteration.
    -   **`@jstar_mockups/Qoder/00_design_system`**: This folder acts as the foundational design system for the 'Qoder' mockup iteration. It contains the core visual language and component definitions, all defined as CSS custom properties (design tokens) for easy reuse and theming.
        -   `colors.html`: A visual guide and definition file for the complete color system and spacing tokens. It specifies brand colors, light/dark theme palettes, semantic colors (for success, error states, etc.), and gradients. It also codifies the spacing scale, border radiuses, shadow styles, and z-index layering.
        -   `components.html`: A comprehensive visual library of all standard UI components. This includes interactive examples of buttons, cards, form elements (inputs, selects), badges, alerts, navigation bars, and modals. It demonstrates various states for these components (e.g., hover, disabled, loading).
        -   `typography.html`: A detailed specimen file that defines the entire typographic system. It establishes the hierarchy for headings and body text, setting scales for font sizes, weights, and line heights. It also provides examples of brand voice and special text treatments.
    -   **`@jstar_mockups/Qoder/01_public_website`**: Contains mockups for the public-facing website. The main focus of this section is a key marketing asset, with other page mockups being placeholders.
        -   `lead-magnet.html`: A detailed, interactive mockup of a landing page designed to capture user emails by offering a free 'Creator\'s Toolkit'. It includes the full visual design, a functional form simulation with JavaScript, and lists the valuable assets included in the toolkit.
        -   `about/`, `blog/`, `contact/`, etc.: These subdirectories are currently placeholders and do not contain mockups. They indicate the intended structure for a full public website design.

    -   **`@jstar_mockups/Qoder/02_johngpt_assistant`**: This folder contains a complete set of mockups for a feature-rich AI assistant named "JohnGPT". It details not just the chat interface, but a whole ecosystem of supporting features.
        -   `chat_interface/chat-main.html`: The primary, interactive chat UI. It features a sidebar for selecting personas and browsing recent conversations, and a main window for the active chat, including rich message formatting and a dynamic input area.
        -   `personas/personas-detail.html`: A page showcasing the available AI personas: 'Creative Director', 'Systems Mentor', and 'Faith Guide'. It details their individual expertise, capabilities, and provides sample prompts.
        -   `prompts/prompts-library.html`: A mockup for a library of pre-built prompts. It includes features for searching, filtering by category, and managing prompts with actions like use, copy, edit, and favorite.
        -   `history/conversation-history.html`: A screen for browsing and managing past conversations. It includes search and filter capabilities, and displays conversations in a card grid with details and actions like export, share, and delete.
        -   `integrations/integrations-hub.html`: A hub for connecting JohnGPT to third-party applications like Obsidian, Slack, Notion, and Zapier. It shows the status of each integration and provides connection/configuration options.
        -   `settings/settings-main.html`: A comprehensive settings area allowing users to manage their profile, conversation preferences (e.g., default persona), interface appearance (e.g., theme), data privacy, and account actions.
        -   `api_documentation/api-documentation.html`: A detailed, developer-focused documentation page for the JohnGPT REST API, complete with endpoint descriptions, request/response examples, and authentication instructions.
        -   `features/advanced-features.html`: A landing page designed to upsell users to a "Pro" plan by showcasing premium features like custom model training, API access, and team collaboration.
    -   **`@jstar_mockups/Qoder/03_admin_dashboard`**: This folder contains mockups for a comprehensive, multi-faceted admin dashboard, serving as the central control panel for the entire platform.
        -   `main_dashboard/main-dashboard.html` & `overview/dashboard-main.html`: The main landing page for administrators, providing a high-level overview of key metrics (users, revenue, content, AI interactions), a recent activity feed, and quick actions for common tasks.
        -   `analytics/analytics-dashboard.html`: A detailed analytics section with features for date-range filtering, deep-dive metric cards, traffic analysis charts, and performance tables for top pages.
        -   `users/user-management.html`: A complete user management interface with tools to search, filter, and view a paginated list of all users, their plans, and activity status.
        -   `cms/content-management.html`: A full-featured Content Management System (CMS) for creating, editing, and publishing various types of content, including a rich text editor and SEO settings.
        -   `billing/billing-management.html`: A financial dashboard for monitoring revenue, tracking subscriptions and transactions, and managing billing-related actions like creating coupons.
        -   `security/security-dashboard.html`: A panel for monitoring system security, viewing active alerts, and managing access control, network policies, and data protection settings.
        -   `integrations/integrations-management.html`: An admin-level hub for managing all third-party API integrations (e.g., OpenAI, Stripe, AWS), monitoring their status, and viewing usage metrics.
        -   `settings/system-settings.html`: The master settings panel for platform-wide configuration, covering general settings, AI model selection, security policies, and backup management.
    -   **`@jstar_mockups/Qoder/04_creator_growth_engine`**: An integrated suite of powerful tools designed as an all-in-one "Operating System" for content creators to manage and scale their business.
        -   `systems_launcher/systems-dashboard.html`: The central dashboard for the Growth Engine, providing a high-level overview of all active systems (email, social, etc.), key metrics like tasks automated and time saved, and quick-launch templates.
        -   `content_planner/content-planner.html`: A comprehensive content calendar with month, week, and day views. It includes an AI-powered idea generator with a "viral score" for new topics.
        -   `scripting_studio/scripting-studio.html`: An AI-assisted editor for writing video, podcast, and sales scripts. It features templates, a teleprompter view, and an integrated AI assistant for improving content.
        -   `social_scheduler/social-scheduler.html`: A tool for scheduling and managing posts across multiple social media platforms (Twitter, LinkedIn, etc.) from a single interface.
        -   `virality_os/`: A two-part tool for engineering viral content. `virality-dashboard.html` tracks key virality metrics and provides AI predictions, while `content-generator.html` is an AI tool to create content optimized for high engagement.
        -   `analytics_hub/analytics-hub.html`: A dedicated dashboard for tracking social media and content performance, showing impressions, engagement rates, and top-performing posts.
        -   `lead_tracker/lead-tracker.html`: A lightweight CRM for managing the sales pipeline, tracking leads from "New" to "Closed Won" with a table-based interface.
        -   `client_magnet/client-magnet-dashboard.html`: A dashboard focused on lead generation, featuring a sales funnel visualization, a list of "hot leads", and tools for managing lead magnets.
        -   `course_builder/course-builder-dashboard.html`: A full-featured platform for creating, managing, and selling online courses, complete with a lesson-by-lesson course builder, analytics, and templates.
        -   `automation_center/automation-center.html`: A tool for creating and managing automated workflows, such as email nurture sequences, with a visual builder for triggers and actions.
    -   **`@jstar_mockups/Qoder/05_shared_components`**: A granular component library providing detailed, isolated mockups for the platform's core UI building blocks.
        -   `auth/authentication-forms.html`: Showcases the complete user authentication flow, including forms for Login, Signup (with password strength meter), Password Reset, and 2-Factor Authentication.
        -   `form_components/form-components.html`: A comprehensive library of all form elements, demonstrating text inputs, select dropdowns, checkboxes, radio buttons, toggle switches, and file uploaders, each with validation states.
        -   `data_tables/data-tables.html`: A mockup of a powerful and interactive data table with features like sorting, filtering, pagination, and bulk actions on rows.
        -   `navigation/main-navigation.html`: Contains examples of all navigation patterns, including the main site header, a dashboard sidebar, tabbed navigation, breadcrumbs, and user profile dropdowns.
        -   `modal_components/modal-components.html`: A collection of various modal dialogs, such as basic pop-ups, confirmation dialogs, and modals containing forms or loading indicators.
        -   `notification_system/notification-system.html`: Demonstrates the different types of user notifications: temporary "toast" pop-ups, a persistent in-app notification center, and site-wide announcement banners.
        -   `chart_components/chart-components.html`: A showcase of data visualization components, including examples of line, bar, pie, and donut charts.
        -   `themes/theme-system.html`: An interactive mockup for a theme customization panel, aallowing users to switch between light/dark/sepia modes and adjust primary colors and font sizes.
        -   `ui_elements/ui-showcase.html`: A general collection of the most common atomic components like buttons, cards, alerts, badges, and progress bars, showing their various states and styles.
    -   **`@jstar_mockups/Qoder/06_mobile_responsive`**: This folder contains mockups demonstrating the platform's responsive design and mobile-first user experience for key application areas.
        -   `mobile-homepage.html`: A mobile view of the public homepage, featuring a compact header, a prominent hero section, and vertically stacked content blocks for services and stats.
        -   `mobile-chat-interface.html`: A dedicated, full-screen UI for the JohnGPT chat, with a fixed header, a scrollable message area, and a touch-friendly input area fixed to the bottom.
        -   `mobile-dashboard.html`: A mobile adaptation of the admin dashboard, utilizing a slide-out hamburger menu and a bottom tab bar for primary navigation, with dashboard widgets arranged in a single-column layout.
        -   `mobile-navigation.html`: A component library showcasing various mobile-specific navigation patterns, including tab bars, side menus, bottom sheet drawers, and floating action buttons (FABs).

-   **`@jstar_mockups/Qwen`**: Mockups from the "Qwen" design iteration.
    -   **`@jstar_mockups/Qwen/00_Design_System`**: Defines the design system for the 'Qwen' iteration, a modern, TailwindCSS-based approach focused on tiered permissions and deep integration with Obsidian.
        -   `colors.html`: Specifies the primary color palette, including an "Obsidian Gray," and provides previews for light and dark modes, highlighting the theme's modern aesthetic.
        -   `buttons.html`: Lays out a tiered button system where styles (solid, gradient, red) change based on user roles (Guest, Subscriber, Admin) and action severity.
        -   `navigation.html`: Details a "tier-aware" navigation bar that dynamically shows or hides links and features based on the user's subscription level.
        -   `markdown-rendering.html`: A key file demonstrating how content should render for compatibility with Obsidian, including support for wiki-links, tags, and styled code blocks.
        -   `theme-toggle.html`: Showcases the theme-switching component, which respects the user's OS preference for light/dark mode but allows for manual override.
    -   **`@jstar_mockups/Qwen/01_Public_Website`**: Contains a set of modular, component-based mockups for building the public website, emphasizing responsiveness and tiered content access.
        -   `hero-desktop.html` & `hero-mobile.html`: Responsive versions of the homepage hero section, using a video background for desktop and a static gradient for mobile to optimize loading times.
        -   `blog-article-preview.html`: A rich component for displaying a blog post summary, including metadata, an excerpt, and a call-to-action for viewing premium content.
        -   `portfolio-filtered.html`: A portfolio grid with interactive category filters and a clear UI indicating which projects require a higher subscription tier to view.
        -   `store-product-card.html`: A set of e-commerce components for a digital store, showcasing different product tiers (free, paid, premium) and highlighting Obsidian integration as a key feature.
    -   **`@jstar_mockups/Qwen/02_JohnGPT`**: A collection of mockups detailing the JohnGPT assistant and its related pages within the Qwen design system.
        -   `johnGPT-core-chat.html`: The main chat interface, featuring a persona switcher and a message area capable of rendering Markdown and code blocks.
        -   `johnGPT-persona-switcher.html`: A UI for selecting from different AI personas (Creative Director, Systems Mentor, etc.), with clear indications for which personas require a higher subscription tier.
        -   `public-vault.html`: A public-facing interface for browsing an Obsidian-style knowledge vault, with a file tree for navigation and a content pane that correctly renders wiki-links and other Markdown features.
        -   `about-page.html`: A detailed personal "About Me" page that establishes the brand's mission at the intersection of film, AI, and faith.
        -   `contact-lead-gen.html`: A dual-purpose contact page that includes a standard form alongside a prominent lead magnet to capture user information.
    -   **`@jstar_mockups/Qwen/03_JohnGPT_Advanced`**: This folder contains mockups for advanced, high-value features of the JohnGPT assistant, focusing on power-user workflows and external integrations.
        -   `johnGPT-agent-slot-machine.html`: A powerful prompt comparison tool (FR023) that allows users to run a single prompt across multiple AI models (e.g., Gemini, GPT-4o, Llama3) and view the results side-by-side. It includes a performance analysis to help users choose the best model for their specific needs.
        -   `johnGPT-history.html`: A feature-rich interface for browsing and searching past conversations (FR018). It includes filtering by date and hints at pro features like tagging for organization and exporting to other applications.
        -   `johnGPT-obsidian-export.html`: A key integration feature (FR020) that allows users to save chat messages or entire conversations directly to their Obsidian vault. The mockup shows that the export preserves Markdown formatting and automatically adds metadata like tags and source links.
        -   `johnGPT-prompt-library.html`: A system for creating, managing, and reusing prompt templates (FR019). It allows for categorization and searching, and introduces a tiered-access model where premium templates are available to subscribers.
        -   `johnGPT-site-navigation.html`: An innovative chat-based navigation system (FR022) where the AI guides users to relevant pages on the site based on natural language queries, reducing the reliance on traditional navigation menus.
    -   **`@jstar_mockups/Qwen/04_Admin_Dashboard`**: This folder contains mockups for the administrative backend of the platform, providing tools for monitoring, managing, and configuring the entire system.
        -   `admin-login.html`: A secure login page for the admin dashboard (FR024), detailing security features like JWT-based authentication, session expiration, and two-factor authentication.
        -   `admin-dashboard.html`: The main overview page for the admin area (FR025), featuring a modular, customizable grid with high-level statistics, a recent activity feed, and summaries of key platform components.
        -   `admin-user-management.html`: A comprehensive interface for managing all platform users (FR026). It includes a searchable and filterable table of users, with options to view details, edit profiles, and change subscription tiers.
        -   `admin-johnGPT-settings.html`: A detailed settings panel for the JohnGPT assistant (FR027), allowing admins to configure AI providers, manage API keys, customize the system prompt and brand voice, and control AI personas.
        -   `admin-analytics.html`: A powerful analytics dashboard (FR029) with detailed charts and stats for platform traffic, revenue by source, and user subscription tier breakdowns, including options for time-based filtering and data export.
    -   **`@jstar_mockups/Qwen/05_CMS_Creator_Growth_Engine`**: This folder contains mockups for the Content Management System (CMS) and advanced tools within the Creator Growth Engine, focusing on content creation, product management, and client acquisition.
        -   `cms-blog-editor.html`: A comprehensive blog editor (FR031) for creating and publishing blog posts, featuring a Markdown editor with live preview, post settings (title, slug, meta description, featured image, categories, publish date), and options for saving drafts or publishing.
        -   `cms-page-editor.html`: A drag-and-drop page editor (FR032) for building website pages using pre-defined components (e.g., Hero, Features, Testimonials). It allows configuration of page settings like title, URL slug, template, and status.
        -   `cms-product-manager.html`: An interface for managing digital products (FR033), displaying product details, sales, and status. It includes a product editor for configuring product information, pricing (with trial periods and discounts), and associated content.
        -   `cge-virality-os.html`: The "YouTube Virality Optimization System" (FR034, FR035, FR036), offering tools for title analysis (with virality scores and suggestions), thumbnail testing (with CTR prediction), and integration with channel analytics and content calendars.
        -   `cge-client-magnet.html`: The "Client Magnet System" (FR037, FR038), designed for automated client outreach. It features an "Outreach Sequence Builder" for creating email sequences and "Lead Analytics" for tracking performance, with JohnGPT optimization for higher tiers.
    -   **`@jstar_mockups/Qwen/06_Systems_Launcher_Store_Frontend`**: This folder contains mockups for the J StaR Films Store and related systems, focusing on product display, checkout processes, and tools for system implementation and faith integration.
        -   `store-landing-page.html`: The main landing page for the J StaR Films Store (FR044), featuring a hero section and a product grid that can be filtered by subscription tier. It showcases various products with their names, descriptions, prices, and tiers.
        -   `store-product-page.html`: A detailed product page (FR045) providing comprehensive information about a specific product, including images, a detailed description, features, testimonials, and FAQs. It also highlights the required access tier and includes a tier comparison table.
        -   `store-checkout.html`: The checkout flow (FR046) for the store, including sections for billing information, payment method selection, discount code application, and an order summary. It simulates a successful checkout process.
        -   `cge-systems-launcher.html`: The "Systems Launcher Toolkit" (FR039, FR040, FR041), offering workflow templates and an implementation tracker to guide users through setting up systems for content creation, client acquisition, and faith integration. It categorizes templates and provides a step-by-step launch guide.
        -   `cge-faith-integration.html`: The "Faith Integration Framework" (FR042, FR043), providing tools to help creators integrate spiritual principles into their work. It includes a framework builder for defining content purpose, scripture references, and prayer points, along with a prayer generator and vault.
    -   **`@jstar_mockups/Qwen/07_Community_Platform`**: This folder contains mockups for the community platform, designed to foster connection, collaboration, and spiritual growth among faith-driven creators.
        -   `community-calendar.html`: A mockup for a shared community calendar that allows users to view and register for community events like prayer calls, workshops, and Q&A sessions. It also includes a feature for creating new events.
        -   `community-chat.html`: A mockup for a real-time community chat interface with different channels for various topics, direct messaging, and AI-powered message suggestions.
        -   `community-forum.html`: A mockup for a structured community forum for in-depth discussions, allowing users to create topics, reply to posts, and filter by categories. It also includes features for upvoting and downvoting.
        -   `community-profile.html`: A mockup for a community member's public profile, showcasing their background, mission, areas of expertise, and recent activity. It also includes a "Faith-Verified" badge and options to follow or message other members.
        -   `community-resources.html`: A mockup for a curated library of resources for faith-driven creators, allowing users to browse and download resources categorized by topic.
    -   **`@jstar_mockups/Qwen/08_Admin_Platform`**: This folder contains mockups for the administrative platform, providing tools for managing the entire J StaR ecosystem, including user roles, content moderation, and system health.
        -   `admin-ai-tools.html`: A mockup for managing the AI tools of the platform, including settings for AI model configuration, API keys, and persona management.
        -   `admin-analytics.html`: A mockup for the admin analytics dashboard, providing detailed charts and stats for platform traffic, revenue, and user subscription tier breakdowns.
        -   `admin-billing.html`: A mockup for the billing management section of the admin dashboard, including an overview of revenue, a list of recent transactions, and tools for managing subscriptions and invoices.
        -   `admin-content.html`: A mockup for the content management section of the admin dashboard, including a list of all content with filtering and pagination, and a content editor for creating and editing pages and posts.
        -   `admin-dashboard.html`: The main dashboard for the admin platform, offering a high-level overview of system status, recent activities, and key metrics related to users, content, and community engagement.
        -   `admin-integration.html`: A mockup for managing third-party integrations, including a list of available and active integrations, with options to connect, configure, and monitor their status.
        -   `admin-moderation.html`: A mockup for the content moderation section of the admin dashboard, including a queue of reported content, with options to review, approve, or reject user-generated content.
        -   `admin-settings.html`: A mockup for the central settings panel for the entire admin platform, allowing configuration of global settings, integrations, and security policies.
        -   `admin-support.html`: A mockup for the admin support center, including a list of support tickets with filtering and pagination, and a detailed view of a single ticket with conversation history and response form.
        -   `admin-users.html`: A mockup for the user management section of the admin dashboard, including a list of all users with filtering and pagination, and a detailed view of a single user with their information, activity, and subscription details.

### `Mockups`

This is the primary and most current directory for detailed HTML mockups. It reflects the latest design vision for the platform and serves as the main reference for UI/UX development.

-   **`mockup-viewer.html`**: An interactive HTML page that serves as a local viewer for all the mockups. It dynamically loads and displays the various HTML mockup files, categorized by their respective folders, providing descriptions and allowing for easy navigation and preview.
-   **`README.md`**: Provides a high-level overview of the "J StaR Platform - Best of Both Worlds Implementation" design system, detailing its purpose, folder structure, design principles, and implementation status. It serves as a quick reference for the contents and philosophy behind the mockups.

#### Sub-folders within `Mockups`:

-   **`00_Design_System`**: This folder contains the foundational elements of the J StaR Platform's design system, combining best practices from various design iterations. It provides a unified and comprehensive guide to the platform's visual and interactive language.
    -   `accessibility-guide.html`: An accessibility guide that outlines the platform's commitment to WCAG 2.1 AA compliance. It includes examples of accessible components, color contrast ratios, keyboard navigation, focus indicators, and ARIA labels.
    -   `component-library.html`: A comprehensive library of reusable UI components, showcasing tier-aware buttons, interactive cards, and form elements. It serves as a central reference for the platform's unified design system.
    -   `design-tokens.html`: A detailed specification of the unified design tokens, including brand colors, semantic colors, theme palettes, gradients, spacing, border radius, typography, shadows, and z-index. It also highlights the integration of Obsidian-compatible styles.
    -   `theme-system.html`: A demonstration of the advanced theme system, featuring a theme switcher for light, dark, and auto (system preference) modes, along with theme previews and implementation details.

-   **`01_Public_Website`**: This folder contains mockups for all public-facing pages of the J StaR Films website. These mockups are designed to create a unified and engaging user experience, showcasing the brand's services, portfolio, and thought leadership.
    -   `about-enhanced.html`: An enhanced "About Me" page that provides a comprehensive overview of John Oluleke-Oke's story, philosophy, skills, and professional journey.
    -   `blog-interface.html`: The main interface for the blog, featuring a hero section, search and filter functionality, a featured article, and a grid of the latest posts with pagination.
    -   `blog-list-interactive.html`: An interactive version of the blog list page with advanced filtering options, a search bar, and a clean, modern design for an improved user experience.
    -   `blog-post-view.html`: A detailed view of a single blog post, including rich formatting, an author bio, a comments section, and a table of contents for easy navigation.
    -   `contact-leadgen.html`: A combined contact and lead generation page that includes a contact form, WhatsApp integration, and a lead magnet for capturing user information.
    -   `homepage-unified.html`: A unified homepage that serves as a comprehensive landing page for the entire platform, featuring a cinematic hero section, a services overview, and a strong call to action.
    -   `portfolio-advanced.html`: An advanced portfolio page with a filterable grid of projects. Each project includes a detailed view with descriptions, tags, and a lightbox for viewing media.
    -   `public-vault-obsidian.html`: A public-facing knowledge vault with an Obsidian-like interface, featuring a file tree, markdown rendering with wiki-link support, and a graph view to show connections between notes.
    -   `services-comprehensive.html`: A comprehensive services page detailing the various services offered, including video production, app development, and AI creator tools, along with a process overview and pricing information.
    -   `store-enhanced.html`: An enhanced digital store for selling products like courses, templates, and tools, with features like product filtering and a modern, clean design.
    -   `blog/`: This sub-folder contains earlier or alternative versions of the blog-related pages, such as a simpler "About" page, a category-specific blog page, and a basic blog post layout.

-   **`02_JohnGPT_Enhanced`**: This folder contains mockups for an enhanced version of the JohnGPT assistant, focusing on advanced features, a refined user interface, and powerful integrations to create a comprehensive AI-powered creator assistant.
    -   `agent-slot-machine.html`: A powerful prompt comparison tool that allows users to run a single prompt across multiple AI models (e.g., Gemini, GPT-4o, Llama3) and view the results side-by-side, complete with a comparison analysis.
    -   `chat-interface-unified.html`: A clean and sophisticated unified chat interface with an integrated sidebar for conversation history, persona selection, and a rich text input area for a premium user experience.
    -   `conversation-history.html`: A detailed conversation history page that allows users to browse, search, and filter past conversations, with a preview pane and options to export or delete conversations.
    -   `mobile-chat.html`: A mobile-optimized version of the JohnGPT chat interface, featuring a full-screen experience with a touch-friendly input area, persona selection, and quick actions for a seamless on-the-go workflow.
    -   `obsidian-integration.html`: This mockup showcases the "Save to Obsidian Vault" feature, allowing users to export conversations to their Obsidian vault in markdown format with options to include metadata and tags.
    -   `persona-system.html`: Details the persona system of JohnGPT, which allows users to switch between different AI personas (e.g., Creative Director, Systems Mentor) for specialized assistance. It also includes an admin feature for creating custom personas.
    -   `prompt-library.html`: A mockup for a "Prompt Library" where users can create, edit, and organize custom prompts, with features for categorization, search, and a modal interface for creating new prompts.
    -   `split-view-canvas.html`: An advanced "Split View & Canvas Mode" that combines a chat interface with a visual canvas, enabling users to drag ideas from conversations to create mind maps and diagrams for visual brainstorming.

-   **`03_Admin_Dashboard_Pro`**: This folder contains mockups for a professional admin dashboard, providing a comprehensive suite of tools for managing the entire platform, from user analytics to system-level configurations.
    -   `analytics-comprehensive.html`: A detailed analytics dashboard that offers insights into platform performance, including visitor stats, page views, bounce rates, traffic sources, user tier distribution, and conversion funnels.
    -   `cms-interface.html`: A Content Management System (CMS) interface for managing website content, including pages, blog posts, and digital products. It features a content editor, a drag-and-drop content builder, and a comprehensive content list with filtering and pagination.
    -   `dashboard-overview.html`: The main overview page for the admin dashboard, providing a high-level summary of key metrics like total users, active sessions, revenue, and JohnGPT queries, along with recent user activity.
    -   `johngpt-settings.html`: A settings panel for configuring the "JohnGPT" AI assistant, including API settings, model management (local and cloud), persona configuration, and other system-level parameters.
    -   `security-center.html`: A centralized "Security Center" for managing platform security, with features for monitoring active sessions, setting authentication policies (2FA, password strength), managing access control rules, and reviewing audit logs.
    -   `system-settings.html`: A mockup for platform-wide system settings, including system information (version, uptime), general settings (site name, timezone), email configuration, and management of payment and third-party integrations.
    -   `user-management-advanced.html`: An advanced interface for user management, featuring user statistics by tier, a detailed user table with filtering and pagination, and a tier assignment matrix for controlling feature access based on user roles.

-   **`04_Creator_Growth_Engine`**: This folder contains mockups for a suite of tools designed to empower content creators by providing them with advanced capabilities for automation, lead generation, course creation, and content optimization.
    -   `automation-center.html`: A mockup for an "Automation Center" that allows creators to build and manage automated workflows for content scheduling, cross-platform posting, and audience engagement, complete with performance analytics.
    -   `client-magnet-pro.html`: This mockup details a "Client Magnet Pro" tool for generating targeted leads, creating personalized outreach emails with AI assistance, and tracking lead generation analytics to improve conversion rates.
    -   `course-builder.html`: A comprehensive "Course Builder" tool that enables creators to develop online courses with features like AI-powered curriculum generation, a rich lesson content editor, and detailed course progress tracking.
    -   `new_johngpt.html`: This mockup showcases a redesigned, modern interface for the "JohnGPT" AI assistant, featuring a clean welcome screen, persona selection, and an improved chat experience.
    -   `scripting-studio.html`: A mockup for a "Scripting Studio" that provides an AI-powered environment for script development, including features for scene visualization, character development, and tracking script progress.
    -   `systems-launcher.html`: This mockup is for a "Systems Launcher" that offers creative starter kits for various creator roles, such as YouTubers, Podcasters, and Course Creators. These kits include Notion templates, script frameworks, and asset packs to accelerate the creative process.
    -   `virality-os-enhanced.html`: An enhanced "Virality OS" mockup that provides tools for analyzing YouTube trends, calculating "virality scores" for content ideas, and generating visual assets like thumbnails to improve content performance.

-   **`05_Shared_Components`**: This folder contains a comprehensive library of reusable UI components that ensure a consistent look and feel across the entire platform. Each file is a detailed mockup of a specific component type, showcasing its various states and functionalities.
    -   `charts-visualization.html`: A showcase of various chart and data visualization components, including line charts, bar charts, pie charts, a metrics dashboard with progress bars, and a heatmap. It serves as a complete library for displaying data visualizations.
    -   `data-tables-advanced.html`: Contains mockups for advanced data tables with features like sorting, filtering, pagination, bulk actions, and different states (e.g., empty, loading). It provides a robust solution for displaying and managing tabular data.
    -   `forms-comprehensive.html`: A comprehensive library of form components, including text inputs with validation, select inputs, checkboxes, radio buttons, switches, range sliders, textareas, file uploads, and complex form layouts. It ensures consistency in data collection.
    -   `modals-enhanced.html`: Showcases an enhanced modal system with various types of modals, such as form modals, confirmation modals, notification modals, image modals, and full-screen modals. Each modal has different styles and functionalities for various interaction scenarios.
    -   `navigation-unified.html`: Presents a unified set of navigation components, including top navigation bars, sidebars, mobile navigation, breadcrumbs, and pagination controls. These components are designed to be responsive and consistent across the platform.
    -   `notification-system.html`: Details the notification system, including toast notifications, full notifications with actions, alert banners for contextual information, and a notification preferences section with toggle switches. This ensures a consistent user feedback mechanism.

-   **`06_Mobile_Optimized`**: This folder contains mockups demonstrating the platform's responsive design and mobile-first user experience for key application areas.
    -   `mobile-chat.html`: A dedicated, full-screen UI for the JohnGPT chat, with a fixed header, a scrollable message area, and a touch-friendly input area fixed to the bottom. It also includes a persona selector.
    -   `mobile-dashboard.html`: A mobile adaptation of the admin dashboard, utilizing a slide-out hamburger menu and a bottom tab bar for primary navigation, with dashboard widgets arranged in a single-column layout. It displays statistics, charts, recent activity, and quick actions.
    -   `mobile-homepage.html`: A mobile view of the public homepage, featuring a compact header, a prominent hero section, and vertically stacked content blocks for services and stats.
    -   `mobile-navigation.html`: A component library showcasing various mobile-specific navigation patterns, including a full-screen overlay menu with different sections and a bottom navigation bar. It also includes a search box and user profile information.

The entire `@jstar_mockups/Qwen` section has been fully documented.