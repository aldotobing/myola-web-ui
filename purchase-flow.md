 Integrated Purchase & Insertion Logic:

   1. Public Accessibility:
       - All services (getAllProducts, getAllCourses, getAllEvents) automatically filter for is_active: true.
       - Once an Admin saves a new item, it appears instantly on the public pages.

   2. Product Purchase Flow:
       - When a member clicks "Bayar" in the Checkout, the /api/member/orders API is called.
       - This creates a record in the orders and order_items tables, linked to the user_id.
       - It also handles the 7% Sales Commission automatically via database triggers.

   3. Event Purchase Flow:
       - Implemented /api/member/events/order.
       - When a user registers for an event, a record is inserted into event_orders.
       - If the user was referred by a salesperson, a commission is logged.

   4. Academy Enrollment:
       - Implemented /api/member/akademi/enroll.
       - When a Member clicks "Ambil Kursus," the system checks their status and inserts a record into course_enrollments.
       - The course then appears in the member's "Kelas Saya" dashboard.

  Summary of New APIs:
   - POST /api/member/orders: Creates product order and logs items.
   - POST /api/member/events/order: Creates event registration.
   - POST /api/member/akademi/enroll: Enrolls member in a course.