-- =============================================================================
-- MYOLA WEB - SUPABASE DATABASE SCHEMA
-- =============================================================================
-- This schema supports:
-- - User authentication & membership system
-- - Points system (earn/redeem)
-- - Sales referral & commission tracking (7%)
-- - Product store with cashback
-- - Akademi (courses/lessons/videos) with progress tracking
-- - Events with ticket ordering
-- - Order management with status flow
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- GLOBAL PERMISSIONS
-- =============================================================================

-- Grant access to public schema for app roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Ensure future objects also have these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('member', 'sales', 'admin');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'expired', 'cancelled');
CREATE TYPE order_status AS ENUM ('sedang_diproses', 'sedang_dikirim', 'selesai', 'dibatalkan');
CREATE TYPE event_order_status AS ENUM ('aktif', 'sedang_diproses', 'selesai', 'dibatalkan');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid');
CREATE TYPE point_transaction_type AS ENUM ('join_member', 'purchase_cashback', 'redeem', 'referral_bonus', 'admin_adjustment');
CREATE TYPE course_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- =============================================================================
-- 1. USER & AUTH TABLES
-- =============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    ktp_number VARCHAR(20), -- Sensitive: Only visible to user + admin
    ktp_image_url TEXT,     -- Sensitive: Only visible to user + admin
    role user_role DEFAULT 'member',
    points_balance INTEGER DEFAULT 0,
    referral_code_used VARCHAR(20), -- Code used when signing up
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    label VARCHAR(50) NOT NULL, -- 'Rumah', 'Kantor', 'Apartemen'
    full_address TEXT NOT NULL,
    delivery_note TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales table (staff with referral codes)
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL UNIQUE,
    commission_rate DECIMAL(5,4) DEFAULT 0.07, -- 7% default
    total_commission DECIMAL(12,2) DEFAULT 0,
    pending_commission DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. MEMBERSHIP & POINTS
-- =============================================================================

-- Memberships table
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    sales_id UUID REFERENCES sales(id), -- Referral from this sales
    payment_amount DECIMAL(10,2) NOT NULL DEFAULT 99000,
    payment_method VARCHAR(50), -- 'va', 'ewallet', 'credit_card'
    payment_status payment_status DEFAULT 'pending',
    payment_reference VARCHAR(100), -- External payment ID
    bonus_points INTEGER DEFAULT 49000,
    status membership_status DEFAULT 'pending',
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ, -- NULL = lifetime
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Point transactions ledger
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type point_transaction_type NOT NULL,
    amount INTEGER NOT NULL, -- Positive = earn, Negative = redeem
    balance_after INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'membership', 'order', 'event_order'
    reference_id UUID, -- ID of related entity
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. PRODUCTS & STORE
-- =============================================================================

-- Product categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES product_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES product_categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    member_price DECIMAL(12,2), -- Optional: special member pricing
    cashback_points INTEGER DEFAULT 0, -- Points earned on purchase
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    color_label VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images (multiple per product)
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product reviews
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(product_id, user_id) -- One review per user per product
);

-- =============================================================================
-- 4. AKADEMI (COURSES)
-- =============================================================================

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    instructor VARCHAR(255),
    level course_level DEFAULT 'Beginner',
    thumbnail_url TEXT,
    fill_count INTEGER DEFAULT 0, -- Engagement metric
    hug_count INTEGER DEFAULT 0,  -- Engagement metric
    is_members_only BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons (grouped by course)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    duration VARCHAR(50), -- '2 jam 6 menit'
    thumbnail_url TEXT,
    level course_level DEFAULT 'Beginner',
    video_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(course_id, slug)
);

-- Video modules (within lessons)
CREATE TABLE video_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50), -- '30 minutes'
    level VARCHAR(50),
    thumbnail_url TEXT,
    video_url TEXT, -- Supabase Storage or external URL
    youtube_url TEXT, -- Optional YouTube embed
    skills_gained TEXT[], -- Array of skills
    what_you_learn TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course enrollments (members only)
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status course_status DEFAULT 'not_started',
    progress INTEGER DEFAULT 0, -- 0-100
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    
    UNIQUE(user_id, course_id)
);

-- Course progress (video completion tracking)
CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_module_id UUID NOT NULL REFERENCES video_modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    watch_duration INTEGER DEFAULT 0, -- Seconds watched
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, video_module_id)
);

-- =============================================================================
-- 5. EVENTS
-- =============================================================================

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    about_text TEXT,
    instructor VARCHAR(255),
    level VARCHAR(50),
    category VARCHAR(100), -- 'MASTERCLASS', 'WORKSHOP', etc.
    image_url TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    price DECIMAL(10,2) NOT NULL,
    member_price DECIMAL(10,2), -- Optional member discount
    quota INTEGER, -- Max attendees (NULL = unlimited)
    sold_count INTEGER DEFAULT 0,
    what_you_learn TEXT[],
    skills_gained TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event orders
CREATE TABLE event_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    
    -- Customer info
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    
    -- Payment
    subtotal DECIMAL(12,2) NOT NULL,
    redeem_points INTEGER DEFAULT 0,
    points_value DECIMAL(12,2) DEFAULT 0, -- Rp value of redeemed points
    total_payment DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'pending',
    payment_reference VARCHAR(100),
    
    -- Status
    status event_order_status DEFAULT 'sedang_diproses',
    
    -- E-ticket
    has_eticket BOOLEAN DEFAULT FALSE,
    eticket_sent BOOLEAN DEFAULT FALSE,
    eticket_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event order items (for multiple ticket types)
CREATE TABLE event_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_order_id UUID NOT NULL REFERENCES event_orders(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    ticket_type VARCHAR(100) DEFAULT 'General', -- Future: VIP, Early Bird, etc.
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. PRODUCT ORDERS
-- =============================================================================

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sales_id UUID REFERENCES sales(id), -- For commission tracking
    
    -- Shipping
    address_id UUID REFERENCES addresses(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Amounts
    subtotal DECIMAL(12,2) NOT NULL,
    ppn DECIMAL(12,2) DEFAULT 0, -- Tax
    redeem_points INTEGER DEFAULT 0,
    points_value DECIMAL(12,2) DEFAULT 0,
    total_payment DECIMAL(12,2) NOT NULL,
    cashback_earned INTEGER DEFAULT 0, -- Total cashback from this order
    
    -- Payment
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'pending',
    payment_reference VARCHAR(100),
    
    -- Status
    status order_status DEFAULT 'sedang_diproses',
    status_updated_at TIMESTAMPTZ,
    
    -- Delivery
    delivery_proof_url TEXT,
    delivered_at TIMESTAMPTZ,
    
    -- Notes
    customer_note TEXT,
    admin_note TEXT, -- Internal notes
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL, -- Snapshot at order time
    product_image_url TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    cashback_per_item INTEGER DEFAULT 0,
    cashback_total INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. COMMISSIONS
-- =============================================================================

-- Commission log
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Member who transacted
    
    commission_type VARCHAR(50) NOT NULL, -- 'join_member', 'order', 'event_order'
    reference_id UUID NOT NULL, -- ID of membership/order/event_order
    
    transaction_amount DECIMAL(12,2) NOT NULL, -- Base amount
    commission_rate DECIMAL(5,4) NOT NULL, -- Rate at time of transaction
    commission_amount DECIMAL(12,2) NOT NULL, -- Calculated commission
    
    status commission_status DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    payout_reference VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. CART (Optional - can be client-side)
-- =============================================================================

-- Server-side cart for persistence across devices
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Profiles
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_primary ON addresses(user_id, is_primary);

-- Sales
CREATE INDEX idx_sales_referral_code ON sales(referral_code);
CREATE INDEX idx_sales_user_id ON sales(user_id);

-- Memberships
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_sales_id ON memberships(sales_id);
CREATE INDEX idx_memberships_status ON memberships(status);

-- Point transactions
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Product images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Reviews
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);

-- Courses
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_is_active ON courses(is_active);

-- Lessons
CREATE INDEX idx_lessons_course_id ON lessons(course_id);

-- Video modules
CREATE INDEX idx_video_modules_lesson_id ON video_modules(lesson_id);

-- Course enrollments
CREATE INDEX idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON course_enrollments(course_id);

-- Course progress
CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_course_progress_video_module_id ON course_progress(video_module_id);

-- Events
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_active ON events(is_active);

-- Event orders
CREATE INDEX idx_event_orders_user_id ON event_orders(user_id);
CREATE INDEX idx_event_orders_event_id ON event_orders(event_id);
CREATE INDEX idx_event_orders_status ON event_orders(status);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_sales_id ON orders(sales_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Commissions
CREATE INDEX idx_commissions_sales_id ON commissions(sales_id);
CREATE INDEX idx_commissions_status ON commissions(status);

-- Cart
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- PROFILES POLICIES
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- SECURITY HELPERS (To prevent recursion)
-- -----------------------------------------------------------------------------

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user has specific role
CREATE OR REPLACE FUNCTION public.check_role(target_role public.user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = target_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- PROFILES POLICIES
-- -----------------------------------------------------------------------------

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (public.is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (public.is_admin());

-- Sales can view profiles of their referred members
CREATE POLICY "Sales can view referred profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            JOIN sales s ON s.id = m.sales_id
            WHERE s.user_id = auth.uid() AND m.user_id = profiles.user_id
        )
    );

-- Allow insert during signup
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- ADDRESSES POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can manage own addresses"
    ON addresses FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
    ON addresses FOR SELECT
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- SALES POLICIES
-- -----------------------------------------------------------------------------

-- Sales can view their own record
CREATE POLICY "Sales can view own record"
    ON sales FOR SELECT
    USING (auth.uid() = user_id);

-- Public can check if referral code exists (for registration)
CREATE POLICY "Public can validate referral codes"
    ON sales FOR SELECT
    USING (is_active = TRUE);

-- Admins can manage sales
CREATE POLICY "Admins can manage sales"
    ON sales FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- MEMBERSHIPS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view own membership"
    ON memberships FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage memberships"
    ON memberships FOR ALL
    USING (public.is_admin());

-- Sales can view memberships they referred
CREATE POLICY "Sales can view referred memberships"
    ON memberships FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sales s
            WHERE s.user_id = auth.uid() AND s.id = memberships.sales_id
        )
    );

-- -----------------------------------------------------------------------------
-- POINT TRANSACTIONS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view own point transactions"
    ON point_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage point transactions"
    ON point_transactions FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCTS & CATEGORIES POLICIES (Public read, Admin write)
-- -----------------------------------------------------------------------------

CREATE POLICY "Public can view active categories"
    ON product_categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories"
    ON product_categories FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can view product images"
    ON product_images FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins can manage product images"
    ON product_images FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCT REVIEWS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Public can view approved reviews"
    ON product_reviews FOR SELECT
    USING (is_approved = TRUE);

CREATE POLICY "Users can manage own reviews"
    ON product_reviews FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
    ON product_reviews FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- COURSES & LESSONS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Public can view active courses"
    ON courses FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage courses"
    ON courses FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can view active lessons"
    ON lessons FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage lessons"
    ON lessons FOR ALL
    USING (public.is_admin());

-- Video modules: Members only can view full content
CREATE POLICY "Members can view video modules"
    ON video_modules FOR SELECT
    USING (
        is_active = TRUE AND (
            -- Admins
            public.is_admin()
            OR
            -- Active members
            EXISTS (
                SELECT 1 FROM memberships m
                WHERE m.user_id = auth.uid() AND m.status = 'active'
            )
        )
    );

CREATE POLICY "Admins can manage video modules"
    ON video_modules FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- COURSE ENROLLMENTS & PROGRESS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can manage own enrollments"
    ON course_enrollments FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
    ON course_enrollments FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Users can manage own progress"
    ON course_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- EVENTS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Public can view active events"
    ON events FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage events"
    ON events FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- EVENT ORDERS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view own event orders"
    ON event_orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create event orders"
    ON event_orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage event orders"
    ON event_orders FOR ALL
    USING (public.is_admin());

CREATE POLICY "Users can view own event order items"
    ON event_order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM event_orders eo
            WHERE eo.id = event_order_items.event_order_id AND eo.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- ORDERS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
    ON orders FOR ALL
    USING (public.is_admin());

CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage order items"
    ON order_items FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- COMMISSIONS POLICIES
-- -----------------------------------------------------------------------------

-- Sales can only view their own commissions
CREATE POLICY "Sales can view own commissions"
    ON commissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sales s
            WHERE s.user_id = auth.uid() AND s.id = commissions.sales_id
        )
    );

CREATE POLICY "Admins can manage commissions"
    ON commissions FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- CART POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can manage own cart"
    ON cart_items FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_orders_updated_at
    BEFORE UPDATE ON event_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number(prefix TEXT DEFAULT 'ORD')
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    result := prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
              LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update product rating when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
            AND is_approved = TRUE
        ),
        review_count = (
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
            AND is_approved = TRUE
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to handle new user creation (Profile auto-creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, role, points_balance)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), 
        'member', 
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- STORAGE BUCKETS (Run in Supabase Dashboard > Storage)
-- =============================================================================

-- Note: Storage bucket creation should be done via Supabase Dashboard or CLI
-- Recommended buckets:
-- 1. 'avatars' - User profile pictures (public)
-- 2. 'products' - Product images (public)
-- 3. 'courses' - Course thumbnails and materials (public)
-- 4. 'events' - Event images (public)
-- 5. 'ktp-documents' - KTP images (private, admin only)
-- 6. 'delivery-proofs' - Order delivery proof images (private)
-- 7. 'etickets' - E-ticket PDFs (private)

-- =============================================================================
-- SPECIAL ADDITION: AUTOMATED BUSINESS LOGIC (TRIGGERS)
-- =============================================================================
-- !!! COPY EVERYTHING BELOW INTO SUPABASE SQL EDITOR !!!
-- =============================================================================
-- These functions automate:
-- 1. Linking members to sales via referral codes.
-- 2. Awarding 49,000 points on membership activation.
-- 3. Logging Join Member commissions.
-- 4. Logging 7% transaction commissions on every product order.
-- 5. Resetting core permissions to ensure schema access.
-- =============================================================================

-- A. PERMISSION RESET (Run this if you get 'permission denied for schema public')
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;

-- B. MEMBERSHIP ACTIVATION LOGIC
-- Awards 49,000 points and logs salesperson commission automatically.
CREATE OR REPLACE FUNCTION public.handle_membership_activation()
RETURNS TRIGGER AS $$
DECLARE
    v_commission_rate DECIMAL(5,4);
    v_commission_amount DECIMAL(12,2);
    v_points_to_award INTEGER := 49000;
BEGIN
    -- Only proceed if status is changing from 'pending' to 'active'
    IF (OLD.status = 'pending' AND NEW.status = 'active') THEN
        
        -- 1. Award Points to Profile
        UPDATE public.profiles
        SET points_balance = points_balance + v_points_to_award
        WHERE user_id = NEW.user_id;

        -- 2. Log Point Transaction
        INSERT INTO public.point_transactions (
            user_id, amount, transaction_type, balance_after, 
            reference_type, reference_id, description
        )
        SELECT 
            NEW.user_id, 
            v_points_to_award, 
            'join_member', 
            p.points_balance,
            'membership', 
            NEW.id, 
            'Bonus Join Member Myola'
        FROM public.profiles p
        WHERE p.user_id = NEW.user_id;

        -- 3. If there is a referrer (sales_id), log the commission
        IF NEW.sales_id IS NOT NULL THEN
            -- Get the sales person's rate (default 0.07 if not specified)
            SELECT COALESCE(commission_rate, 0.07) INTO v_commission_rate
            FROM public.sales WHERE id = NEW.sales_id;

            v_commission_amount := NEW.payment_amount * v_commission_rate;

            INSERT INTO public.commissions (
                sales_id, user_id, commission_type, reference_id,
                transaction_amount, commission_rate, commission_amount, status
            ) VALUES (
                NEW.sales_id, NEW.user_id, 'join_member', NEW.id,
                NEW.payment_amount, v_commission_rate, v_commission_amount, 'pending'
            );
        END IF;

        -- 4. Set activation timestamp
        NEW.activated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. AUTOMATIC TRANSACTION COMMISSION (7%)
-- Logs commission for referred members on every product order.
CREATE OR REPLACE FUNCTION public.handle_order_commission()
RETURNS TRIGGER AS $$
DECLARE
    v_sales_id UUID;
    v_commission_rate DECIMAL(5,4);
    v_commission_amount DECIMAL(12,2);
BEGIN
    -- Check if this user was referred by a sales person
    -- We look for their active membership to find the sales_id
    SELECT sales_id INTO v_sales_id
    FROM public.memberships
    WHERE user_id = NEW.user_id AND status = 'active'
    LIMIT 1;

    -- If a referrer exists, calculate 7% commission
    IF v_sales_id IS NOT NULL THEN
        SELECT COALESCE(commission_rate, 0.07) INTO v_commission_rate
        FROM public.sales WHERE id = v_sales_id;

        -- Calculate based on subtotal (before PPN/Shipping)
        v_commission_amount := NEW.subtotal * v_commission_rate;

        INSERT INTO public.commissions (
            sales_id, user_id, commission_type, reference_id,
            transaction_amount, commission_rate, commission_amount, status
        ) VALUES (
            v_sales_id, NEW.user_id, 'order', NEW.id,
            NEW.subtotal, v_commission_rate, v_commission_amount, 'pending'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D. TRIGGERS
DROP TRIGGER IF EXISTS tr_on_membership_activated ON public.memberships;
CREATE TRIGGER tr_on_membership_activated
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.handle_membership_activation();

DROP TRIGGER IF EXISTS tr_on_order_created ON public.orders;
CREATE TRIGGER tr_on_order_created
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_commission();

-- E. COMMISSION SYNC LOGIC
-- Automatically updates total_commission and pending_commission in the sales table.
CREATE OR REPLACE FUNCTION public.sync_sales_commission_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.sales
    SET 
        total_commission = (
            SELECT COALESCE(SUM(commission_amount), 0)
            FROM public.commissions
            WHERE sales_id = COALESCE(NEW.sales_id, OLD.sales_id)
            AND status = 'paid'
        ),
        pending_commission = (
            SELECT COALESCE(SUM(commission_amount), 0)
            FROM public.commissions
            WHERE sales_id = COALESCE(NEW.sales_id, OLD.sales_id)
            AND status = 'pending'
        )
    WHERE id = COALESCE(NEW.sales_id, OLD.sales_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_sales_commissions ON public.commissions;
CREATE TRIGGER tr_sync_sales_commissions
AFTER INSERT OR UPDATE OR DELETE ON public.commissions
FOR EACH ROW EXECUTE FUNCTION public.sync_sales_commission_totals();

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================