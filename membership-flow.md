 The Complete Integrated Flow:

  1. Member Registration & Referral (`/api/member/register`):
   - Users can now sign up using a Referral Code.
   - The system validates the code against the sales table.
   - A Pending Membership is created and linked to the corresponding Salesperson (sales_id).
   - The referral code is also recorded in the user's Profile.

  2. Membership Finalization (`/api/member/membership/finalize`):
   - Upon successful payment (Rp99,000):
       - Membership is activated.
       - User is awarded 49,000 Poin Myola.
       - A Join Member Commission is automatically calculated and logged for the Salesperson.

  3. Product Checkout & 7% Commission (`/api/member/orders`):
   - When a Member makes a purchase:
       - The system checks if they were referred by a Salesperson.
       - If yes, a 7% Commission from the transaction value is automatically logged in the commissions table.
       - Cashback points are correctly calculated for the Member.

  4. Sales Dashboard (`/dashboard/sales`):
   - Profile: Displays the Salesperson's info and active Referral Code (with one-click copy).
   - Member List: Shows all users who registered using their referral code.
   - Commission Detail: A complete ledger showing every transaction, the commission rate (7% or flat), and status (Pending/Paid).
   - Summary: Live statistics for total members and commission balances.

  Technical Verification:
   - All services in src/lib/service/sales/ are connected to real Supabase tables.
   - All API routes are role-secured and handle server-side Supabase clients correctly.
   - The build has been verified and passes successfully.

   In the logic I implemented, the referralCode is treated as an optional field at every step. Here is the confirmation of how it works when a code is not provided:

   1. Registration API (`/api/member/register`):
       * If the referralCode field is empty, the if (referralCode) block is skipped.
       * The sales_id remains null.
       * The membership is created successfully, but simply isn't "linked" to any salesperson.
   2. Payment Finalization (`/api/member/membership/finalize`):
       * The code checks if (membership.sales_id).
       * Since it's null, the system skips the part where it tries to calculate and log a commission.
       * The user still gets their 49,000 points, and their membership still becomes Active.
   3. Future Purchases (`/api/member/orders`):
       * The system looks for an active membership to find a sales_id.
       * If none is found (it's null), the 7% commission logic is simply skipped for that order.

