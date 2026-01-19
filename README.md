# Leads Dashboard Web App

A production-ready Leads Dashboard built with Next.js, Supabase, Tailwind CSS, and shadcn/ui.

## Features

-   **Dashboard**: KPI View, Segmented Tables (Tabs), Real-time updates.
-   **Notifications**: Browser push notifications for new leads.
-   **Lead Management**: Filters, Search, Row Actions (Edit, Status Change).
-   **Analytics**: Visual charts for Volume, Source, City, and Insights.
-   **Scoring**: Automatic lead scoring and "Attention Needed" queue.
-   **Settings**: Configuration view for app constants.

## Tech Stack

-   **Frontend**: Next.js 14+ (App Router), TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
-   **State**: React Query (TanStack Query)
-   **Charts**: Recharts
-   **Backend**: Supabase (Database & Realtime)

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repo_url>
    cd leads-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Copy `.env.local` example (or create one) with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Database Setup**:
    Run the SQL snippets provided in `supabase_snippets.sql` in your Supabase SQL Editor to create necessary indices and the `settings` table.

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Project Structure

-   `src/app`: Page routes (Leads, Analytics, Settings)
-   `src/components`: Reusable UI components
    -   `leads`: Dashboard specific components (Table, Filters)
    -   `analytics`: Charts and Insights
-   `src/hooks`: Data fetching hooks (`useLeads`, `useAnalytics`)
-   `src/lib`: Utilities and Supabase client

## Bonus Features Implemented

-   **Lead Scoring**: Calculated based on source, priority, and completeness.
-   **Attention Needed Queue**: Filter for overdue or high-priority unassigned leads.
