# **Project Requirements Document: J StaR Personal Platform**

## 1. Project Vision & Mission

To create a unified, modular, and scalable personal web platform for John Oluleke-Oke (J StaR Films). This platform will serve as a central hub for his entire creative brand, integrating a public-facing portfolio, a digital product storefront, a powerful suite of private creator tools, and a next-generation AI assistant (JohnGPT).

The mission is to build a "Creative Operating System" that not only showcases work but actively assists in content creation, audience growth, client acquisition, and monetization, while being extensible for future business ventures. The system must be AI-first, run locally for privacy and performance, and be architected for a seamless transition to a scalable cloud infrastructure.

## 2. User Personas & Access Tiers

The platform will support a multi-tiered user access model to enable future monetization strategies.

| Tier      | Persona          | Description                                                                                             | Key Permissions                                                                                                                                                                                                                                                |
| :-------- | :--------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin** | John Oluleke-Oke | The platform owner. Has full control over all content, users, settings, and tools.                      | Full CRUD access to all modules: Admin Dashboard, Creator Growth Engine, CMS, JohnGPT settings, user management, and platform configuration.                                                                                                                   |
| **Guest** | Website Visitor  | Any anonymous user visiting the public-facing website.                                                  | Read-only access to public pages (Home, About, Blog, public Portfolio, Storefront). Can interact with the public-facing JohnGPT assistant (with limitations). Can sign up for lead magnets.                                                                    |
| **Tier 1**| JohnGPT User     | A subscribed user who has paid for access to the standalone JohnGPT assistant feature.                  | Full access to the JohnGPT assistant with conversation history and premium features. Can manage their own account settings. No access to the Creator Growth Engine or advanced Admin features.                                                                 |
| **Tier 2**| Creator User     | A subscribed user who has paid for access to specific modules within the Creator Growth Engine.         | Tier 1 permissions + access to purchased CGE modules (e.g., YouTube Virality OS). Can generate reports and use the tools for their own projects.                                                                                                              |
| **Tier 3**| Full Platform User| A premium subscriber or client with access to the full suite of tools and potentially personalized content. | Tier 2 permissions + access to all Creator Growth Engine modules, advanced templates, and potentially private course content.                                                                                                                                  |

## 3. Functional Requirements

The following table outlines the detailed functional requirements of the J StaR Personal Platform, organized by module.

| Requirement ID | Module | Description | User Story | Expected Behavior/Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **Public Website** |
| FR001 | Website - General | View Public Website | As a guest, I want to browse the J StaR Films website to learn about John, his work, products, and services. | The system displays a fast, responsive, modern website with world-class navigation. |
| FR002 | Website - General | Toggle Theme (Dark/Light) | As a guest, I want to switch between dark and light modes for comfortable viewing. | A UI toggle instantly changes the site's color scheme, with an option to respect system preference. |
| FR003 | Website - Home | View Hero Section | As a guest, I want to see a compelling, cinematic introduction to J StaR Films on the homepage. | The homepage displays a hero section with a creator statement, optional video background, and clear calls to action. |
| FR004 | Website - About | View About Page | As a guest, I want to read about John's story, creative/faith philosophy, and diverse skill set. | An "About Me" page presents John's biography, covering filmmaking, app development, and AI expertise. |
| FR005 | Website - Portfolio | View Multi-Faceted Portfolio | As a guest, I want to see examples of John's work across all his creative fields. | A portfolio page with smart filtering displays video projects, app development case studies, event coverage, etc. |
| FR006 | Website - Store | Browse Digital Products | As a guest, I want to browse available digital products like courses, templates, and bundles. | A product/store page lists items with previews, descriptions, pricing, and "Buy Now" or "Learn More" links. |
| FR007 | Website - Store | Purchase & Access Product | As a guest/user, I want to purchase a digital product and receive secure access to it. | Integration with payment processors (Stripe/Paystack) allows purchase. Secure, gated access to downloads is provided post-purchase. |
| FR008 | Website - Services | View Services | As a guest, I want to understand the full range of services offered by J StaR Films. | A services page details offerings like video production, app development, consulting, and event streaming. |
| FR009 | Website - Blog | View Blog/Writings | As a guest, I want to read articles and insights shared by John on creativity, tech, and faith. | A blog section displays articles with rich media support, filterable by category. |
| FR010 | Website - Public Vault | View Public Vault | As a guest, I want to access curated public notes or insights in an Obsidian-like format. | A "Public Vault" section displays selected markdown notes with linking and tagging features. |
| FR011 | Website - Contact | Contact John | As a guest, I want a simple way to send a message or inquiry to John. | A contact page provides a form, calendar booking integration, and optional WhatsApp link. |
| FR012 | Website - Lead Gen | Sign up for Lead Magnet | As a guest, I want to sign up for a free resource in exchange for my email. | A lead magnet section captures email addresses via a form, integrating with an email marketing service. |
| **JohnGPT Assistant** |
| FR013 | JohnGPT - Core | Access JohnGPT Assistant | As a user, I want to open and interact with the JohnGPT chat interface from anywhere on the site. | A floating button or embedded element launches the JohnGPT UI in a modal or dedicated view. |
| FR014 | JohnGPT - Core | Multi-Engine Support | As an admin/user, I want to connect JohnGPT to various AI backends (local or cloud). | The system allows seamless switching between Ollama, LM Studio, Gemini, OpenAI, Groq, and other APIs. |
| FR015 | JohnGPT - Core | View Markdown/Code | As a user, I want AI responses with formatting or code to be rendered correctly. | The chat interface correctly renders markdown, code blocks with syntax highlighting, and embedded media. |
| FR016 | JohnGPT - Brand Voice | Emulate Brand Voice | As a user, I want JohnGPT to respond in a style that is friendly, humorous, practical, and faith-grounded. | The AI uses a system prompt trained on John's data to maintain a consistent brand voice. |
| FR017 | JohnGPT - Personas | Switch Personas | As a user, I want to interact with JohnGPT in different modes for specific tasks. | The UI allows switching between personas like "Creative Director," "Systems Mentor," and "Faith Guide." |
| FR018 | JohnGPT - History | View/Search Conversation History | As a logged-in user, I want to view, search, and load my past conversations. | A searchable interface displays saved conversations, grouped by date or project. History is stored in the database. |
| FR019 | JohnGPT - Prompting | Manage Prompt Library | As an admin/user, I want to create, save, and reuse prompts within the chat interface. | A UI allows managing a library of prompts. Logged-in users can save their own custom prompts. |
| FR020 | JohnGPT - Integration | Save Chat to Obsidian Vault | As an admin, I want to select a conversation snippet and save it directly as a markdown file to my Obsidian vault. | A button on each message bubble exports the content to a configured local path in Obsidian-compatible markdown. |
| FR021 | JohnGPT - Advanced UI | Use Split-View / Canvas Mode | As a power user, I want a more advanced interface for complex ideation. | The UI offers a split-view for chat and notes, and a canvas/mind-map mode for visualizing strategies. |
| FR022 | JohnGPT - Navigation | Navigate Users via Chat | As a guest, I want to ask the chatbot questions and have it guide me to relevant pages on the site. | JohnGPT can parse user intent and provide direct links or guide them to pages like the portfolio or services section. |
| FR023 | JohnGPT - A/B Testing | Test Multiple AI Models | As an admin, I want to run the same prompt through different AI models to compare outputs. | An "Agent Slot Machine" feature sends a prompt to multiple configured models (e.g., Gemini, GPT-4o, Llama3) and displays the results side-by-side. |
| **Admin Dashboard** |
| FR024 | Admin - Auth | Secure Admin Access | As the admin, I want to log in securely to access the private dashboard. | Access to the `/admin` route is protected by a robust authentication system (JWT-based). |
| FR025 | Admin - General | View Modular Dashboard | As the admin, I want a central dashboard with a clear, modular layout for managing the platform. | The admin dashboard presents a user-friendly interface with distinct tabs/sections for each module. |
| FR026 | Admin - User Mgmt | Manage Users & Tiers | As the admin, I want to manage user accounts and their access tiers. | A user management interface allows the admin to view users, assign roles/tiers, and manage subscriptions. |
| FR027 | Admin - JohnGPT | Manage JohnGPT Settings | As the admin, I want to configure all aspects of JohnGPT from the dashboard. | Dedicated interfaces for managing AI providers, API keys, models, system prompts, and personas. |
| FR028 | Admin - CGE | Access Creator Growth Engine | As the admin, I want to access all the private creator tools from a central location. | The dashboard provides the main entry point to launch and use all Creator Growth Engine modules. |
| FR029 | Admin - Analytics | View Platform Analytics | As the admin, I want to see key metrics about website traffic, user signups, and product sales. | A dashboard displays analytics on user engagement and platform performance. |
| **Content Management (CMS)** |
| FR030 | CMS - Core | Headless CMS Interface | As the admin, I want to edit website content without needing to write code. | A section in the Admin Dashboard provides a user-friendly "headless CMS" interface. |
| FR031 | CMS - Blog | Manage Blog Posts | As the admin, I want to create, edit, publish, and delete blog posts. | A rich text editor allows for writing articles, embedding media, assigning categories, and managing publication status. |
| FR032 | CMS - Pages | Edit Static Page Content | As the admin, I want to update text and images on pages like "About" and "Services." | The CMS allows editing content blocks for key static pages on the public website. |
| FR033 | CMS - Products | Manage Store Products | As the admin, I want to add new digital products to the store and manage existing ones. | An interface allows managing product details (title, description, price, preview images, download file/link). |
| **Creator Growth Engine (CGE)** |
| FR034 | CGE - Virality OS | Analyze YouTube Trends | As an admin, I want to input a niche or channel URL to analyze trending content and competitor strategies. | The system uses YouTube API, Google Trends, and Reddit analysis to generate a detailed report on viral topics, titles, and formats. |
| FR035 | CGE - Virality OS | Calculate Multi-Tiered Virality Score | As an admin, I want a predictive score for video ideas based on a comprehensive algorithm. | The system provides a score based on a tiered analysis: Title, Thumbnail, Title-Thumbnail Synergy, Topic, and Content Strategy. |
| FR036 | CGE - Virality OS | Generate Visual Assets | As an admin, I want customizable thumbnail templates based on performance data. | The system generates thumbnail templates with optimal color schemes, text placement, and visual hierarchy. |
| FR037 | CGE - Client Magnet | Generate Targeted Leads | As an admin, I want to find potential clients based on industry, location, and other criteria. | The system identifies potential leads and provides contact information where publicly available. |
| FR038 | CGE - Client Magnet | Generate Personalized Outreach | As an admin, I want the AI to draft personalized outreach emails or DMs using my offer templates. | The system generates draft messages incorporating lead details, personalized hooks, and the provided offer. |
| FR039 | CGE - Systems Launcher| Generate Creative Starter Kits | As an admin/user, I want to select a creator role (YouTuber, Podcaster) and receive a relevant starter kit. | Based on the role, the system provides a digital kit with Notion templates, script frameworks, and asset packs (LUTs, SFX). |
| FR040 | CGE - Course Builder | Plan & Build Micro-Courses | As an admin, I want a modular system to turn my knowledge into a digital course. | The module includes a lesson planner, landing page generator, and tools to bundle digital assets for a course offering. |
| FR041 | CGE - Scripting Studio| Create Video Content | As an admin, I want a dedicated workspace for scripting videos, integrating all the tools. | A flexible, Obsidian-like editor page with sections for Thumbnail concepts, Hooks, Body, CTAs. Content from JohnGPT can be added with one click. |

## 4. Non-Functional Requirements

| ID | Category | Requirement |
| :--- | :--- | :--- |
| NFR001 | Hosting | **Local First Execution:** The entire platform must run fully and performantly on a Windows laptop, including JohnGPT with local models. |
| NFR002 | Performance | **Fast Load Times:** The public website and web application must load quickly and respond smoothly to user interactions. |
| NFR003 | UI/UX | **Responsive & Modern Design:** The UI must be visually appealing (inspired by Notion/Figma), consistent, and adapt fluidly to all screen sizes. |
| NFR004 | Scalability | **Modular Architecture:** The codebase must be well-structured and modular, allowing for new features and modules to be added easily without refactoring the entire system. |
| NFR005 | Data | **Migratable Database:** The system will use SQLite for local development but must be architected (e.g., using an ORM like Prisma) for easy migration to a cloud database like Supabase/PostgreSQL. |
| NFR006 | Security | **Robust Access Control:** The system must enforce the defined user tiers, protecting admin and paid content from unauthorized access. API keys and sensitive data must be handled securely on the backend. |
| NFR007 | Interoperability| **Obsidian/Markdown Compatibility:** All relevant exports (notes, reports, chat logs) must be in clean, Obsidian-compatible markdown format, preserving tags and metadata. |
| NFR008 | Maintainability| **Content Updatability:** The admin must be able to update key website content (blog, products, services) through the CMS without requiring code changes. |

## 5. System Architecture & Tech Stack

*   **Frontend Framework:** Next.js
*   **Styling:** Tailwind CSS
*   **Backend:** Node.js (via Next.js API Routes or a standalone server for complex tasks)
*   **Local Database:** SQLite
*   **Database ORM:** Prisma (to ensure easy migration to PostgreSQL/Supabase)
*   **AI Integration:** Custom API gateway to handle requests to Ollama, LM Studio, and various cloud APIs (Gemini, OpenAI, etc.).
*   **Authentication:** JWT (JSON Web Tokens)
*   **Deployment:** The primary target is a web application deployable on platforms like Vercel or a private server. The local-first requirement will be met through the development environment setup.