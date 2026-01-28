 Admin Role Capabilities Implemented:

  1. Master Dashboard Hub (`/dashboard/admin`):
   - Real-time statistics overview (Sales, Members, Orders, Academy).
   - Unified navigation to all management modules.

  2. User & Sales Management:
   - Member Directory: View all registered members, including their contact details and KTP information.
   - Sales Staff Management: Create new Sales accounts via a secure Admin-only API (/api/admin/create-sales) and assign unique Referral Codes.
   - Commission Tracking: Monitor performance and commission logs for every salesperson.

  3. Order & Transaction Management:
   - Centralized tracking for both Product and Event orders.
   - Administrative controls to update status (Processing → Shipped → Completed).
   - Support for uploading delivery proofs.

  4. Inventory & Content Control:
   - Product Management: Dynamic control over store inventory, pricing, and specific cashback point values per item.
   - Akademi Management: Interface for uploading and organizing Courses, Lessons, and Video modules with metadata like skills gained.
   - Event Management: Tools to manage ticketing, pricing, and participant quotas.

  5. System Security & Middleware:
   - Enhanced src/utils/supabase/middleware.ts to strictly enforce role-based access.
   - Non-admins are automatically redirected away from /dashboard/admin.
   - Sensitive operations (like creating users) are handled via a dedicated adminClient using the Service Role key.

  Technical Verification:
   - Created src/lib/service/admin/admin-service.ts for all database interactions.
   - Verified that all pages are correctly integrated with your Supabase schema.
   - The build is stable and passes all TypeScript checks.