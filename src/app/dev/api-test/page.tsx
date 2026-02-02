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
    <div className="flex h-screen bg-[#0F172A] text-gray-300 overflow-hidden">
      {/* Sidebar */}
      <div className="w-[400px] bg-[#1E293B] border-r border-gray-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 bg-[#1E293B]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-pink-500 rounded-lg shadow-lg shadow-pink-900/20">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <h1 className="font-bold text-white text-base tracking-tight">MYOLA API LAB</h1>
            </div>
            <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold border border-green-500/20">
              CONNECTED
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search APIs..."
              className="w-full bg-[#0F172A] border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-pink-500 transition-colors text-white placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Info Banner */}
          <div className="mt-3 p-2.5 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Database size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-blue-400 leading-relaxed">
                <span className="font-semibold">Data Fetching</span> endpoints query the database directly. Use these to get IDs for testing.
              </p>
            </div>
          </div>
        </div>

        {/* API List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {filteredCollections.map((group, idx) => (
            <div key={idx} className="bg-[#0F172A]/50 rounded-xl border border-gray-800/50 overflow-hidden">
              <button
                onClick={() => toggleGroup(group.group)}
                className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#1E293B]/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wide">{group.group}</h3>
                  {group.description && (
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{group.description}</p>
                  )}
                </div>
                {expandedGroups.has(group.group) ? (
                  <ChevronDown size={14} className="text-gray-500 flex-shrink-0 ml-2" />
                ) : (
                  <ChevronRight size={14} className="text-gray-500 flex-shrink-0 ml-2" />
                )}
              </button>
              {expandedGroups.has(group.group) && (
                <div className="px-2 pb-2 space-y-1">
                  {group.endpoints.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => selectEndpoint(item)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#1E293B] transition-colors group flex flex-col gap-1.5 ${endpoint === item.path ? 'bg-[#1E293B] border border-pink-500/30' : 'border border-transparent'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold w-11 px-1.5 rounded flex items-center justify-center h-4 flex-shrink-0 ${item.method === 'GET' ? 'bg-green-500/10 text-green-400' :
                          item.method === 'POST' ? 'bg-blue-500/10 text-blue-400' :
                            item.method === 'PATCH' ? 'bg-orange-500/10 text-orange-400' :
                              'bg-red-500/10 text-red-400'
                          }`}>{item.method}</span>
                        <span className={`text-[11px] font-medium flex-1 leading-tight ${endpoint === item.path ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{item.label}</span>
                      </div>
                      {item.description && (
                        <p className="text-[9px] text-gray-600 leading-relaxed pl-[3.25rem]">{item.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-3 bg-[#0F172A]/50 border-t border-gray-800">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1E293B] border border-gray-800">
            <div className="w-9 h-9 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-pink-900/20">
              {user?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{user?.full_name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck size={10} className="text-pink-500" />
                <span className="text-[9px] text-pink-500 uppercase font-bold tracking-wider">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* URL Bar */}
        <div className="p-6 border-b border-gray-800 bg-[#1E293B]/20">
          <div className="flex gap-3 max-w-6xl mx-auto">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-[#0F172A] border border-gray-700 rounded-xl px-6 py-3 text-pink-500 font-bold text-sm outline-none focus:border-pink-500 shadow-lg transition-colors cursor-pointer hover:border-pink-500/50"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                <Globe size={14} />
                <span className="text-[10px] font-bold tracking-tight opacity-50">LOCALHOST:3000</span>
              </div>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full h-full bg-[#0F172A] border border-gray-700 rounded-xl pl-36 pr-4 outline-none focus:border-pink-500 text-white font-medium text-sm shadow-lg transition-colors"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 active:scale-[0.98] disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              SEND
            </button>
          </div>
        </div>

        {/* Builder Tabs */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0F172A]/30">
          <div className="px-6 border-b border-gray-800 bg-[#1E293B]/10">
            <div className="flex gap-8">
              {["params", "authorization", "headers", "body"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab ? 'border-pink-500 text-white' : 'border-transparent text-gray-600 hover:text-gray-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto h-full">
              {activeTab === 'body' && (
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='// Enter JSON request body here...'
                  className="w-full h-full bg-transparent border-none outline-none text-blue-400 text-sm resize-none custom-scrollbar leading-relaxed font-mono"
                />
              )}
              {activeTab === 'authorization' && (
                <div className="space-y-6">
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                      <Key size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-1.5">Bearer Token Authentication</p>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                        Protected routes require a valid Supabase JWT. This token is automatically refreshed and injected into your headers.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Active Access Token</label>
                      <button
                        onClick={() => { navigator.clipboard.writeText(token); toast.info("Token copied"); }}
                        className="text-[10px] text-pink-500 font-bold flex items-center gap-1.5 hover:bg-pink-500/10 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Copy size={12} /> COPY
                      </button>
                    </div>
                    <textarea
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl p-6 text-[11px] text-gray-500 outline-none focus:border-pink-500 font-mono resize-none leading-relaxed shadow-inner"
                      rows={10}
                    />
                  </div>
                </div>
              )}
              {activeTab === 'headers' && (
                <div className="space-y-3">
                  <div className="flex gap-4 text-[10px] font-bold text-gray-600 uppercase mb-4 px-2">
                    <span className="w-44">Header Key</span>
                    <span>Value</span>
                  </div>
                  {[
                    { k: "Content-Type", v: "application/json" },
                    { k: "Authorization", v: `Bearer ${token.slice(0, 40)}...` }
                  ].map((h, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <input readOnly value={h.k} className="w-44 bg-[#1E293B]/50 border border-gray-800 rounded-xl px-4 py-3 text-xs text-pink-500 font-bold" />
                      <input readOnly value={h.v} className="flex-1 bg-[#1E293B]/50 border border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-500 truncate font-mono" />
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'params' && (
                <div className="h-full flex flex-col items-center justify-center text-gray-700/50">
                  <Layout size={64} className="mb-6 opacity-5" />
                  <p className="text-base font-bold uppercase tracking-wider">Query Parameters</p>
                  <p className="text-sm mt-2 text-gray-600">Modify URL params directly in the endpoint bar above.</p>
                  <p className="text-xs mt-1.5 text-gray-700">Example: /api/admin/products?id=UUID_HERE</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="h-[500px] bg-[#0F172A] border-t border-gray-800 flex flex-col shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#1E293B]/10">
            <div className="flex items-center gap-8">
              <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Server Response</h2>
              {status && (
                <div className="flex gap-6 items-center">
                  <div className={`px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-lg ${status < 300 ? 'bg-green-500 text-white shadow-green-900/20' : 'bg-red-500 text-white shadow-red-900/20'}`}>
                    {status}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={12} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">{response?.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Database size={12} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">{response?.size}</span>
                  </div>
                </div>
              )}
            </div>
            {response && (
              <button
                onClick={() => { navigator.clipboard.writeText(JSON.stringify(response.data, null, 2)); toast.info("JSON response copied"); }}
                className="text-[10px] font-bold text-pink-500 hover:text-white hover:bg-pink-500 transition-all px-4 py-2 rounded-lg border border-pink-500/30 uppercase tracking-wide"
              >
                Copy JSON
              </button>
            )}
          </div>
          <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-[#020617]/50">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                <Loader2 className="animate-spin text-pink-500/20" size={48} />
                <span className="text-[11px] font-bold uppercase tracking-wider animate-pulse">Exchanging Signals...</span>
              </div>
            ) : response ? (
              <pre className="text-sm text-blue-300 leading-loose font-mono bg-transparent">
                <code>{JSON.stringify(response.data, null, 2)}</code>
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-800 gap-3">
                <div className="p-5 bg-gray-900/50 rounded-2xl border border-gray-800/50">
                  <Send size={40} className="opacity-10" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-20">Awaiting Instruction</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}