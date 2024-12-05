#  Certificate Management System

A modern web application built with Next.js for managing and generating certificates.

## Project Structure

```
c21/
├── app/                              # Next.js application directory
│   ├── api/                         # API routes
│   │   └── certificates/
│   │       └── route.ts            # Certificate API endpoints
│   ├── certificates/               # Certificate pages
│   │   └── [id]/
│   │       ├── page.tsx           # Certificate detail page
│   │       └── print.css          # Print-specific styles
│   ├── fonts/                     # Custom fonts
│   │   ├── GeistMonoVF.woff      # Geist Mono variable font
│   │   └── GeistVF.woff          # Geist variable font
│   ├── favicon.ico               # Site favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                # Home page component
│
├── components/                  # Reusable React components
│   ├── ui/                     # UI component library
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx          # Card component
│   │   ├── input.tsx         # Input component
│   │   ├── label.tsx         # Label component
│   │   ├── tabs.tsx          # Tabs component
│   │   └── textarea.tsx      # Textarea component
│   ├── CertificateForm.tsx   # Certificate creation form
│   └── DownloadButton.tsx    # Certificate download button
│
├── lib/                       # Utility functions and shared code
│   ├── notion/               # Notion integration
│   │   ├── config.ts        # Notion configuration
│   │   ├── index.ts         # Main Notion integration logic
│   │   └── types.ts         # Notion-related TypeScript types
│   └── utils.ts             # General utility functions
│
├── prisma/                   # Database configuration
│   ├── migrations/          # Database migrations
│   │   ├── 20241204103306_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma        # Prisma schema definition
│
├── public/                   # Static assets
│   └── images/
│       ├── logo-dobra.png   # Logo image
│       └── ni-award.svg     # Award icon
│
├── scripts/                  # Utility scripts
│   └── sync-notion.ts       # Notion synchronization script
│
├── .env                      # Environment variables
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore rules
├── components.json          # Components configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Project dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Main Requirements

### Core Dependencies
- **Next.js** (v14.2.16) - React framework for production
- **React** (v18.3.1) - UI library
- **Prisma** (v6.0.1) - Database ORM
- **@notionhq/client** (v2.2.15) - Notion API integration

### UI Components
- **Radix UI** - Headless UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Development Tools
- TypeScript
- ESLint
- PostCSS

## Detailed Data Flow

### 1. Data Sources
- **Notion Database**: Primary source for certificate data
  - Stores participant information, course details, and completion dates
  - Synced periodically using the Notion API
- **User Input**: Through the web interface
  - Manual certificate creation via forms
  - File uploads (company logos)
- **Local Database**: Prisma-managed SQLite database
  - Stores all certificate data
  - Serves as the source of truth for the application

### 2. Data Synchronization Flow
```
Notion Database                     Local Database
     ↓                                   ↑
[Notion API] → [sync-notion.ts] → [Prisma ORM]
```

#### Notion to Local Sync Process
1. **Sync Trigger**
   - Manual trigger via `npm run sync-notion`
   - Runs `scripts/sync-notion.ts`

2. **Data Retrieval**
   - Fetches data from Notion database using `@notionhq/client`
   - Validates required fields:
     - Participant Name
     - Course Name
     - Course Description
     - Author Name
     - Completion Date

3. **Data Processing**
   - Transforms Notion page properties into certificate format
   - Handles data validation and type conversion
   - Manages duplicate detection via Notion page IDs

### 3. Application Data Flow
```
UI Layer → API Layer → Database Layer
[CertificateForm.tsx] → [/api/certificates] → [Prisma]
         ↓                     ↓                 ↓
[DownloadButton.tsx] → [Certificate Generation] → [PDF Output]
```

#### Certificate Creation Flow
1. **User Input**
   - Web form collects certificate data (`CertificateForm.tsx`)
   - Handles file uploads for company logos
   - Validates input fields

2. **API Processing**
   - POST request to `/api/certificates`
   - Processes form data and file uploads
   - Creates database records via Prisma

3. **Certificate Generation**
   - Generates certificate based on template
   - Incorporates company logos and styling
   - Creates downloadable PDF

### 4. Data Storage
```
┌─────────────────┐     ┌───────────────┐     ┌──────────────┐
│  Notion Tables  │ ──> │ Local SQLite  │ ──> │ Generated    │
│  - Certificates │     │ - Certificates │     │ Certificates │
└─────────────────┘     └───────────────┘     └──────────────┘
```

- **Notion Database**: External source of truth
- **SQLite Database**: Local data storage
  - Schema defined in `prisma/schema.prisma`
  - Handles relationships and constraints
- **File Storage**: For generated certificates and logos
  - Stored in `public/` directory
  - Organized by certificate ID

### 5. Error Handling
- Failed Notion sync logs errors but continues processing
- API endpoints return appropriate HTTP status codes
- Database operations wrapped in try-catch blocks
- Validation errors returned to UI for user feedback

## Data Flow

1. **User Interface Layer**
   - Built with React components in the `components/` directory
   - Pages defined in `app/` directory using Next.js 14 App Router
   - Styled using Tailwind CSS

2. **API Layer**
   - REST API endpoints in `app/api/`
   - Server-side routes handle data processing and validation

3. **Database Layer**
   - Prisma ORM for database operations
   - Schema defined in `prisma/schema.prisma`

4. **External Integrations**
   - Notion integration via `@notionhq/client`
   - Sync script in `scripts/sync-notion.ts`

## File Connections

### Core Application Files
- `app/layout.tsx` - Root layout with global providers
- `app/page.tsx` - Main entry point of the application
- `app/globals.css` - Global styles and Tailwind imports

### Component Organization
- `components/` - Reusable UI components
- `lib/` - Shared utilities and helpers

### Data Management
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables for API keys and configuration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in required environment variables

3. Run development server:
```bash
npm run dev
```

4. Sync with Notion (if needed):
```bash
npm run sync-notion
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sync-notion` - Sync data with Notion
