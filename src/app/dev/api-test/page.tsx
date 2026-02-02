/** @format */

"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  Terminal,
  Send,
  Copy,
  Trash2,
  Loader2,
  Code2,
  Database,
  Key,
  ShieldAlert,
  Search,
  Globe,
  Lock,
  Zap,
  Layout,
  LogIn,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContexts";
import { createClient } from "@/utils/supabase/client";
import * as AdminService from "@/lib/service/admin/admin-service";

// API Endpoint Type
interface ApiEndpoint {
  label: string;
  method: string;
  path: string;
  description?: string;
  body?: string;
  queryParams?: { key: string; value: string; description: string }[];
  requiresId?: boolean;
  idPlaceholder?: string;
}

interface ApiCollection {
  group: string;
  description?: string;
  endpoints: ApiEndpoint[];
}

export default function ApiTestPage() {
  const isDev = process.env.NODE_ENV === "development";
  const { user, isInitialLoading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("SERVICE:adminGetProducts");
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<"params" | "authorization" | "headers" | "body">("authorization");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Data Fetching (GET)", "Admin: Products & Categories"]));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRequestPanelExpanded, setIsRequestPanelExpanded] = useState(false);

  const collections: ApiCollection[] = [
    {
      group: "Data Fetching (GET)",
      description: "Fetch data to get IDs for testing other endpoints",
      endpoints: [
        {
          label: "Get All Products",
          method: "GET",
          path: "SERVICE:adminGetProducts",
          description: "Fetch all products with categories and images"
        },
        {
          label: "Get Product by ID",
          method: "GET",
          path: "SERVICE:adminGetProductById:PRODUCT_UUID_HERE",
          description: "Fetch specific product details by ID",
          requiresId: true,
          idPlaceholder: "PRODUCT_UUID_HERE"
        },
        {
          label: "Get All Categories",
          method: "GET",
          path: "SERVICE:adminGetCategories",
          description: "Fetch all product categories"
        },
        {
          label: "Get Category by ID",
          method: "GET",
          path: "SERVICE:adminGetCategoryById:CATEGORY_UUID_HERE",
          description: "Fetch specific category details by ID",
          requiresId: true,
          idPlaceholder: "CATEGORY_UUID_HERE"
        },
        {
          label: "Get All Courses",
          method: "GET",
          path: "SERVICE:adminGetCourses",
          description: "Fetch all academy courses"
        },
        {
          label: "Get Course by ID",
          method: "GET",
          path: "SERVICE:adminGetCourseById:COURSE_UUID_HERE",
          description: "Fetch specific course details by ID",
          requiresId: true,
          idPlaceholder: "COURSE_UUID_HERE"
        },
        {
          label: "Get Lessons by Course ID",
          method: "GET",
          path: "SERVICE:adminGetLessons:COURSE_UUID_HERE",
          description: "Fetch all lessons for a specific course",
          requiresId: true,
          idPlaceholder: "COURSE_UUID_HERE"
        },
        {
          label: "Get Video Modules by Lesson ID",
          method: "GET",
          path: "SERVICE:adminGetVideoModules:LESSON_UUID_HERE",
          description: "Fetch all video modules for a specific lesson",
          requiresId: true,
          idPlaceholder: "LESSON_UUID_HERE"
        },
        {
          label: "Get All Members",
          method: "GET",
          path: "SERVICE:adminGetMembers",
          description: "Fetch all members with membership status"
        },
        {
          label: "Get All Sales",
          method: "GET",
          path: "SERVICE:adminGetSales",
          description: "Fetch all sales representatives with stats"
        },
        {
          label: "Get All Orders",
          method: "GET",
          path: "SERVICE:adminGetAllOrders",
          description: "Fetch all product orders"
        },
        {
          label: "Get All Events",
          method: "GET",
          path: "SERVICE:adminGetEvents",
          description: "Fetch all events"
        },
        {
          label: "Get Commission Reports",
          method: "GET",
          path: "SERVICE:adminGetCommissionReports",
          description: "Fetch all commission records"
        },
        {
          label: "Get Dashboard Stats",
          method: "GET",
          path: "SERVICE:adminGetDashboardStats",
          description: "Fetch dashboard statistics"
        },
      ]
    },
    {
      group: "Admin: Products & Categories",
      description: "Manage products, categories, and inventory",
      endpoints: [
        {
          label: "Create Product",
          method: "POST",
          path: "/api/admin/products",
          description: "Create a new product with images",
          body: JSON.stringify({
            name: "Premium Coffee Beans",
            category_id: "CATEGORY_UUID_HERE",
            description: "High-quality arabica coffee beans",
            price: 75000,
            cashback_points: 5000,
            stock: 20,
            imageUrls: ["https://example.com/image1.jpg"]
          }, null, 2)
        },
        {
          label: "Update Product",
          method: "PATCH",
          path: "/api/admin/products",
          description: "Update existing product details",
          body: JSON.stringify({
            id: "PRODUCT_UUID_HERE",
            name: "Updated Product Name",
            price: 85000,
            stock: 15,
            imageUrls: ["https://example.com/new-image.jpg"]
          }, null, 2)
        },
        {
          label: "Delete Product",
          method: "DELETE",
          path: "/api/admin/products?id=PRODUCT_UUID_HERE",
          description: "Delete a product by ID",
          requiresId: true,
          idPlaceholder: "PRODUCT_UUID_HERE"
        },
        {
          label: "Create Category",
          method: "POST",
          path: "/api/admin/categories",
          description: "Create a new product category",
          body: JSON.stringify({
            name: "Coffee & Beverages",
            description: "All coffee and beverage products"
          }, null, 2)
        },
        {
          label: "Delete Category",
          method: "DELETE",
          path: "/api/admin/categories?id=CATEGORY_UUID_HERE",
          description: "Delete a category by ID",
          requiresId: true,
          idPlaceholder: "CATEGORY_UUID_HERE"
        },
      ]
    },
    {
      group: "Admin: Academy (Courses)",
      description: "Manage courses, lessons, and video modules",
      endpoints: [
        {
          label: "Create Course",
          method: "POST",
          path: "/api/admin/akademi",
          description: "Create a new course",
          body: JSON.stringify({
            title: "Digital Marketing Masterclass",
            description: "Learn advanced digital marketing strategies",
            instructor: "John Doe",
            level: "Intermediate",
            thumbnail_url: "https://example.com/course-thumb.jpg"
          }, null, 2)
        },
        {
          label: "Update Course",
          method: "PATCH",
          path: "/api/admin/akademi",
          description: "Update course details",
          body: JSON.stringify({
            id: "COURSE_UUID_HERE",
            title: "Updated Course Title",
            is_active: true,
            level: "Advanced"
          }, null, 2)
        },
        {
          label: "Delete Course",
          method: "DELETE",
          path: "/api/admin/akademi?id=COURSE_UUID_HERE",
          description: "Delete a course by ID",
          requiresId: true,
          idPlaceholder: "COURSE_UUID_HERE"
        },
        {
          label: "Add Lesson to Course",
          method: "POST",
          path: "/api/admin/akademi/lessons",
          description: "Add a new lesson to a course",
          body: JSON.stringify({
            course_id: "COURSE_UUID_HERE",
            title: "Introduction to SEO",
            duration: "15 mins",
            level: "Beginner",
            thumbnail_url: "https://example.com/lesson-thumb.jpg"
          }, null, 2)
        },
        {
          label: "Update Lesson",
          method: "PATCH",
          path: "/api/admin/akademi/lessons",
          description: "Update lesson details",
          body: JSON.stringify({
            id: "LESSON_UUID_HERE",
            title: "Advanced SEO Techniques",
            duration: "20 mins"
          }, null, 2)
        },
        {
          label: "Delete Lesson",
          method: "DELETE",
          path: "/api/admin/akademi/lessons?id=LESSON_UUID_HERE",
          description: "Delete a lesson by ID",
          requiresId: true,
          idPlaceholder: "LESSON_UUID_HERE"
        },
        {
          label: "Add Video Module",
          method: "POST",
          path: "/api/admin/akademi/video-modules",
          description: "Add a video module to a lesson",
          body: JSON.stringify({
            lesson_id: "LESSON_UUID_HERE",
            title: "Part 1: Keyword Research",
            description: "Learn how to find profitable keywords",
            youtube_url: "https://youtube.com/watch?v=example",
            duration: "8:30",
            sort_order: 0
          }, null, 2)
        },
        {
          label: "Update Video Module",
          method: "PATCH",
          path: "/api/admin/akademi/video-modules",
          description: "Update video module details",
          body: JSON.stringify({
            id: "VIDEO_MODULE_UUID_HERE",
            title: "Updated Video Title",
            youtube_url: "https://youtube.com/watch?v=new-video",
            is_active: true
          }, null, 2)
        },
        {
          label: "Delete Video Module",
          method: "DELETE",
          path: "/api/admin/akademi/video-modules?id=VIDEO_MODULE_UUID_HERE",
          description: "Delete a video module by ID",
          requiresId: true,
          idPlaceholder: "VIDEO_MODULE_UUID_HERE"
        },
      ]
    },
    {
      group: "Admin: Users & Memberships",
      description: "Manage users, memberships, and sales accounts",
      endpoints: [
        {
          label: "Approve Member",
          method: "POST",
          path: "/api/admin/approve-member",
          description: "Approve a pending membership",
          body: JSON.stringify({
            userId: "USER_UUID_HERE"
          }, null, 2)
        },
        {
          label: "Update Member Status",
          method: "POST",
          path: "/api/admin/members/update-status",
          description: "Update membership status",
          body: JSON.stringify({
            userId: "USER_UUID_HERE",
            status: "active"
          }, null, 2)
        },
        {
          label: "Create Sales Account",
          method: "POST",
          path: "/api/admin/create-sales",
          description: "Create a new sales representative account",
          body: JSON.stringify({
            email: "sales@example.com",
            password: "SecurePassword123!",
            fullName: "Jane Sales",
            phone: "081234567890",
            referralCode: "SALES001"
          }, null, 2)
        },
      ]
    },
    {
      group: "Admin: Commissions",
      description: "Manage sales commissions and payouts",
      endpoints: [
        {
          label: "Approve Commission",
          method: "POST",
          path: "/api/admin/commissions/approve",
          description: "Approve and mark commission as paid",
          body: JSON.stringify({
            commissionId: "COMMISSION_UUID_HERE",
            reference: "BANK-TRANSFER-REF-123"
          }, null, 2)
        },
      ]
    },
    {
      group: "Admin: File Upload",
      description: "Upload files to storage",
      endpoints: [
        {
          label: "Upload File",
          method: "POST",
          path: "/api/admin/upload",
          description: "Upload file to Supabase Storage (use FormData)",
          body: "// Use FormData in your application:\n// const formData = new FormData();\n// formData.append('file', fileInput.files[0]);\n// formData.append('folder', 'products');"
        },
      ]
    },
    {
      group: "Member: Registration & Auth",
      description: "Member registration and authentication",
      endpoints: [
        {
          label: "Register New Member",
          method: "POST",
          path: "/api/member/register",
          description: "Register a new member account",
          body: JSON.stringify({
            email: "member@example.com",
            password: "SecurePassword123!",
            namaLengkap: "John Member",
            nomorKTP: "1234567890123456",
            referralCode: "SALES001",
            noHp: "081234567890",
            tempatLahir: "Jakarta",
            tanggalLahir: "1990-01-01",
            jenisKelamin: "L"
          }, null, 2)
        },
        {
          label: "Upload KTP",
          method: "POST",
          path: "/api/member/upload-ktp",
          description: "Upload KTP image during registration",
          body: "// Use FormData:\n// const formData = new FormData();\n// formData.append('file', ktpFile);\n// formData.append('userId', 'USER_UUID_HERE');"
        },
        {
          label: "Get KTP Signed URL (Admin)",
          method: "GET",
          path: "/api/member/upload-ktp?path=ktp/filename.jpg",
          description: "Get signed URL for KTP image (admin only)",
          requiresId: true,
          idPlaceholder: "ktp/filename.jpg"
        },
        {
          label: "Finalize Membership Payment",
          method: "POST",
          path: "/api/member/membership/finalize",
          description: "Finalize membership payment and activate account",
          body: JSON.stringify({
            userId: "USER_UUID_HERE",
            paymentReference: "PAYMENT-REF-123",
            paymentMethod: "Bank Transfer"
          }, null, 2)
        },
      ]
    },
    {
      group: "Member: Orders",
      description: "Product and event orders",
      endpoints: [
        {
          label: "Get My Orders",
          method: "GET",
          path: "/api/member/orders",
          description: "Fetch all orders for the logged-in member"
        },
        {
          label: "Get Order by Number",
          method: "GET",
          path: "/api/member/orders/ORD-1234567890-123",
          description: "Fetch specific order details by order number",
          requiresId: true,
          idPlaceholder: "ORD-1234567890-123"
        },
        {
          label: "Create Product Order",
          method: "POST",
          path: "/api/member/orders",
          description: "Create a new product order",
          body: JSON.stringify({
            items: [
              {
                productId: "PRODUCT_UUID_HERE",
                name: "Product Name",
                image: "https://example.com/image.jpg",
                price: 75000,
                quantity: 2,
                cashback: 5000
              }
            ],
            subtotal: 150000,
            redeemPoints: 10000,
            totalAfterRedeem: 140000,
            ppn: 15400,
            shippingCost: 15000,
            totalBayar: 170400,
            totalCashback: 10000,
            address: {
              recipientName: "John Doe",
              phoneNumber: "081234567890",
              fullAddress: "Jl. Example No. 123, Jakarta"
            },
            paymentMethod: "Bank Transfer"
          }, null, 2)
        },
        {
          label: "Create Event Order",
          method: "POST",
          path: "/api/member/events/order",
          description: "Create a new event order",
          body: JSON.stringify({
            eventId: "EVENT_UUID_HERE",
            customerName: "John Doe",
            customerPhone: "081234567890",
            customerEmail: "john@example.com",
            subtotal: 500000,
            redeemPoints: 50000,
            totalPayment: 450000,
            paymentMethod: "QRIS"
          }, null, 2)
        },
      ]
    },
    {
      group: "Member: Academy",
      description: "Course enrollment and progress",
      endpoints: [
        {
          label: "Enroll in Course",
          method: "POST",
          path: "/api/member/akademi/enroll",
          description: "Enroll the logged-in member in a course",
          body: JSON.stringify({
            courseId: "COURSE_UUID_HERE"
          }, null, 2)
        },
      ]
    },
    {
      group: "Member: Product Reviews",
      description: "Submit and manage product reviews",
      endpoints: [
        {
          label: "Submit Product Review",
          method: "POST",
          path: "/api/member/products/review",
          description: "Submit a review for a product",
          body: JSON.stringify({
            productId: "PRODUCT_UUID_HERE",
            rating: 5,
            title: "Excellent Product!",
            comment: "This product exceeded my expectations. Highly recommended!"
          }, null, 2)
        },
      ]
    }
  ];

  useEffect(() => {
    const syncToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      }
    };
    syncToken();
  }, [user, supabase]);

  if (!isDev) return notFound();

  // 1. Loading State
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-500 w-12 h-12" />
      </div>
    );
  }

  // 2. Guest Guard
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <div className="bg-[#1E293B] p-10 rounded-3xl max-w-md w-full border border-gray-800 shadow-2xl">
          <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-pink-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 text-center">Access Restricted</h2>
          <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">
            This laboratory requires <span className="text-pink-500 font-semibold">Administrator</span> authorization.
          </p>
          <button
            onClick={() => router.push("/auth/login?redirect=/dev/api-test")}
            className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-900/30 active:scale-[0.98]"
          >
            <LogIn size={18} /> Login as Admin
          </button>
        </div>
      </div>
    );
  }

  // 3. Admin Role Guard
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <div className="bg-[#1E293B] p-10 rounded-3xl max-w-md w-full border border-gray-800 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 text-center">Unauthorized</h2>
          <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">
            Your account role (<span className="text-white font-semibold">{user.role}</span>) does not have sufficient permissions.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => signOut().then(() => router.push("/auth/login?redirect=/dev/api-test"))}
              className="text-pink-500 font-medium text-sm hover:underline w-full"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setStatus(null);

    try {
      const startTime = Date.now();
      let data: any;
      let statusCode = 200;

      // Check if this is a SERVICE call
      if (endpoint.startsWith("SERVICE:")) {
        const servicePath = endpoint.replace("SERVICE:", "");
        const [functionName, ...params] = servicePath.split(":");

        // Call the appropriate service function
        const serviceFunction = (AdminService as any)[functionName];
        if (!serviceFunction) {
          throw new Error(`Service function '${functionName}' not found`);
        }

        // Call with parameters if provided
        data = params.length > 0 ? await serviceFunction(...params) : await serviceFunction();
        statusCode = 200;
        toast.success("Service call successful");
      } else {
        // Regular API call
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
        };

        if (["POST", "PATCH", "PUT", "DELETE"].includes(method) && requestBody && !requestBody.startsWith("//")) {
          options.body = requestBody;
        }

        const res = await fetch(endpoint, options);
        const text = await res.text();
        try { data = JSON.parse(text); } catch { data = text; }
        statusCode = res.status;

        if (res.ok) toast.success(`Request Success: ${res.status}`);
        else toast.error(`Request Failed: ${res.status}`);
      }

      const duration = Date.now() - startTime;
      const dataString = JSON.stringify(data);

      setStatus(statusCode);
      setResponse({
        time: `${duration}ms`,
        size: `${(dataString.length / 1024).toFixed(2)} KB`,
        data
      });

    } catch (error: any) {
      toast.error(error.message);
      setResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const selectEndpoint = (item: ApiEndpoint) => {
    setMethod(item.method);
    setEndpoint(item.path);
    if (item.body) {
      setRequestBody(item.body);
      setActiveTab("body");
    } else {
      setRequestBody("");
      if (item.method === "GET") {
        setActiveTab("authorization");
      } else {
        setActiveTab("params");
      }
    }
  };

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredCollections = collections.map(group => ({
    ...group,
    endpoints: group.endpoints.filter(e =>
      e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.path.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.endpoints.length > 0);




  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-700 overflow-hidden font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* Collapsible Sidebar */}
      <div
        className={`${isSidebarOpen ? 'w-[400px]' : 'w-[80px]'} bg-slate-100/80 backdrop-blur-sm border-r border-slate-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out relative flex-shrink-0`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-pink-600 z-50 transition-colors"
        >
          {isSidebarOpen ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />}
        </button>

        {/* Header */}
        <div className={`p-6 border-b border-slate-200 bg-white/50 ${!isSidebarOpen && 'flex flex-col items-center px-2'}`}>
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pink-600 rounded-2xl shadow-lg shadow-pink-100">
                <Zap size={20} className="text-white fill-white" />
              </div>
              {isSidebarOpen && <h1 className="font-extrabold text-slate-900 text-lg tracking-tight whitespace-nowrap">MYOLA API LAB</h1>}
            </div>
            {isSidebarOpen && (
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100 tracking-wider whitespace-nowrap">
                CONNECTED
              </div>
            )}
          </div>

          {/* Search */}
          {isSidebarOpen ? (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search endpoints..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          ) : (
            <button
              className="p-3 bg-white border border-slate-200 rounded-xl hover:border-pink-500 transition-colors group"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Search size={20} className="text-slate-400 group-hover:text-pink-600" />
            </button>
          )}

          {/* Info Banner */}
          {isSidebarOpen && (
            <div className="mt-4 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-start gap-3">
                <Database size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  <span className="font-bold">Data Fetching (GET)</span> endpoints query the database directly. Perfect for retrieving IDs for other tests.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* API List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {filteredCollections.map((group, idx) => (
            <div key={idx} className={`${isSidebarOpen ? 'bg-white rounded-2xl border border-slate-200' : 'flex flex-col items-center'} overflow-hidden shadow-sm`}>
              {isSidebarOpen ? (
                <>
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    <div className="flex-1 text-left">
                      <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest truncate max-w-[200px]">{group.group}</h3>
                      {group.description && (
                        <p className="text-[10px] text-slate-500 mt-1 leading-snug font-medium truncate max-w-[220px]">{group.description}</p>
                      )}
                    </div>
                    {expandedGroups.has(group.group) ? (
                      <ChevronDown size={16} className="text-slate-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {expandedGroups.has(group.group) && (
                    <div className="p-2 space-y-1 bg-slate-50/30">
                      {group.endpoints.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => selectEndpoint(item)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm border transition-all group flex flex-col gap-2 ${endpoint === item.path ? 'bg-white border-pink-200 shadow-sm' : 'border-transparent'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black w-12 px-1.5 rounded-lg flex items-center justify-center h-5 flex-shrink-0 tracking-tighter shadow-sm ${item.method === 'GET' ? 'bg-emerald-500 text-white' :
                              item.method === 'POST' ? 'bg-blue-600 text-white' :
                                item.method === 'PATCH' ? 'bg-amber-500 text-white' :
                                  'bg-rose-600 text-white'
                              }`}>{item.method}</span>
                            <span className={`text-[12px] font-bold flex-1 leading-tight truncate ${endpoint === item.path ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{item.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full flex flex-col gap-2">
                  {/* Collapsed Group Icons - could be enhanced to show popovers */}
                  <div
                    title={group.group}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-200 cursor-pointer shadow-sm transition-all text-[10px] font-black"
                  >
                    {group.group.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className={`p-4 bg-white border-t border-slate-200 ${!isSidebarOpen && 'flex justify-center'}`}>
          <div className={`flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner ${!isSidebarOpen && 'p-0 bg-transparent border-none shadow-none'}`}>
            <div className={`w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-pink-100 flex-shrink-0`}>
              {user?.full_name?.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-black text-slate-900 truncate">{user?.full_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={12} className="text-pink-600" />
                  <span className="text-[10px] text-pink-600 uppercase font-black tracking-widest">{user?.role}</span>
                </div>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => signOut()}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogIn size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header - URL Bar */}
        <div className="p-6 border-b border-slate-200 bg-white flex-shrink-0 z-20">
          <div className="flex gap-4 max-w-6xl mx-auto items-center">
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-8 pr-10 py-4 text-slate-900 font-black text-sm outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 shadow-sm transition-all cursor-pointer hover:bg-slate-100"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="flex-1 relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2.5 text-slate-400 group-focus-within:text-pink-600 transition-colors pointer-events-none">
                <Globe size={16} />
              </div>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl pl-36 pr-6 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-50 text-slate-900 font-bold text-sm shadow-sm transition-all placeholder:text-slate-300"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-pink-600 hover:bg-pink-500 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-pink-100 transition-all flex items-center gap-3 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed group"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              SEND
            </button>
          </div>
        </div>

        {/* Collapsible Request Config Panel */}
        <div className={`flex flex-col bg-slate-50 border-b border-slate-200 transition-all duration-300 ease-in-out ${isRequestPanelExpanded ? 'h-[400px]' : 'h-[60px]'} flex-shrink-0 overflow-hidden`}>
          <div className="px-8 border-b border-slate-200 bg-white flex items-center justify-center relative flex-shrink-0 h-[60px]">
            <div className="flex gap-10">
              {["params", "authorization", "headers", "body"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab as any); setIsRequestPanelExpanded(true); }}
                  className={`py-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all relative ${activeTab === tab && isRequestPanelExpanded ? 'border-pink-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {activeTab === tab && isRequestPanelExpanded && <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-pink-600 shadow-sm" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsRequestPanelExpanded(!isRequestPanelExpanded)}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              title={isRequestPanelExpanded ? "Collapse Request Panel" : "Expand Request Panel"}
            >
              {isRequestPanelExpanded ? <ChevronDown size={20} className="rotate-180" /> : <ChevronDown size={20} />}
            </button>
          </div>

          <div className={`flex-1 p-8 overflow-auto custom-scrollbar bg-white ${!isRequestPanelExpanded && 'pointer-events-none opacity-0'}`}>
            <div className="max-w-6xl mx-auto h-full">
              {activeTab === 'body' && (
                <div className="h-full bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-inner">
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder='// Enter JSON request body here...'
                    className="w-full h-full bg-transparent border-none outline-none text-slate-700 text-sm resize-none custom-scrollbar leading-relaxed font-mono font-medium placeholder:text-slate-300"
                  />
                </div>
              )}
              {activeTab === 'authorization' && (
                <div className="space-y-8 max-w-4xl">
                  <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-6 shadow-sm">
                    <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-sm">
                      <Key size={32} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Bearer Token System</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Communication with protected endpoints requires a valid Supabase JWT. We handle the handshake automatically using your session data.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Token Payload</label>
                      <button
                        onClick={() => { navigator.clipboard.writeText(token); toast.success("Token copied to clipboard"); }}
                        className="text-[10px] text-blue-600 font-black flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all border border-blue-200 shadow-sm"
                      >
                        <Copy size={12} /> COPY SECRET
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-[11px] text-slate-400 outline-none focus:border-blue-500 font-mono resize-none leading-relaxed shadow-inner"
                        rows={8}
                      />
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Lock size={48} className="text-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'headers' && (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                    <span className="w-56 tracking-[0.2em]">Header Key</span>
                    <span className="tracking-[0.2em]">Computed Value</span>
                  </div>
                  {[
                    { k: "Content-Type", v: "application/json" },
                    { k: "Authorization", v: `Bearer ${token.slice(0, 40)}...` },
                    { k: "X-Requested-With", v: "MyolaLab" }
                  ].map((h, i) => (
                    <div key={i} className="flex gap-4 items-center group">
                      <input readOnly value={h.k} className="w-56 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-xs text-slate-900 font-black shadow-sm group-hover:border-slate-300 transition-colors" />
                      <input readOnly value={h.v} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs text-slate-400 truncate font-mono font-medium shadow-inner" />
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'params' && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <div className="p-10 bg-slate-50 rounded-full mb-8 shadow-inner border border-slate-100">
                    <Layout size={80} className=" opacity-30 text-slate-400" />
                  </div>
                  <h5 className="text-lg font-black text-slate-900 uppercase tracking-widest">Query Layer</h5>
                  <p className="text-sm mt-3 text-slate-500 font-medium text-center max-w-md">Modify your request parameters directly in the URL bar for real-time validation.</p>
                  <p className="text-xs mt-6 px-6 py-2 bg-slate-100 rounded-full text-slate-400 font-mono italic">Example: /api/admin/products?limit=20&sort=newest</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flexible Response Panel */}
        <div className="flex-1 min-h-0 bg-white border-t border-slate-200 flex flex-col shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)] relative z-10">
          <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md flex-shrink-0">
            <div className="flex items-center gap-10">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Server Response</h2>
              {status && (
                <div className="flex gap-8 items-center">
                  <div className={`px-5 py-2 rounded-xl text-[12px] font-black shadow-lg tracking-tight ${status < 300 ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'}`}>
                    HTTP {status}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Clock size={14} className="text-amber-500" />
                    <span className="text-[12px] font-bold tracking-tight">{response?.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <Database size={14} className="text-blue-500" />
                    <span className="text-[12px] font-bold tracking-tight">{response?.size}</span>
                  </div>
                </div>
              )}
            </div>
            {response && (
              <div className="flex gap-4">
                <button
                  onClick={() => { navigator.clipboard.writeText(JSON.stringify(response.data, null, 2)); toast.success("JSON Payload mirrored to clipboard"); }}
                  className="text-[11px] font-black text-slate-600 hover:bg-white transition-all px-6 py-2.5 rounded-xl border border-slate-200 uppercase tracking-widest flex items-center gap-2 shadow-sm"
                >
                  <Copy size={14} /> Copy Payload
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto p-8 custom-scrollbar bg-slate-50/30">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-100 blur-3xl rounded-full animate-pulse" />
                  <Loader2 className="animate-spin text-pink-500 relative z-10" size={56} strokeWidth={3} />
                </div>
                <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Syncing Lab...</span>
              </div>
            ) : response ? (
              <pre
                className="text-[13px] leading-relaxed font-mono selection:bg-pink-100 outline-none w-full"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const json = JSON.stringify(response.data, null, 2);
                    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                        let cls = 'json-number';
                        if (/^"/.test(match)) {
                          if (/:$/.test(match)) {
                            cls = 'json-key';
                          } else {
                            cls = 'json-string';
                          }
                        } else if (/true|false/.test(match)) {
                          cls = 'json-boolean';
                        } else if (/null/.test(match)) {
                          cls = 'json-null';
                        }
                        return '<span class="' + cls + '">' + match + '</span>';
                      });
                  })()
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm opacity-60">
                  <Send size={48} className="text-slate-300" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Awaiting Signal</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* JSON Syntax Highlighting */
        .json-key { color: #8b5cf6; font-weight: 600; }     /* Violet-500 */
        .json-string { color: #059669; }    /* Emerald-600 */
        .json-number { color: #d946ef; }    /* Fuchsia-500 */
        .json-boolean { color: #2563eb; font-weight: bold; } /* Blue-600 */
        .json-null { color: #94a3b8; font-weight: bold; }    /* Slate-400 */

        pre {
          font-family: 'JetBrains Mono', monospace;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        input::placeholder, textarea::placeholder {
          font-weight: 500;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}