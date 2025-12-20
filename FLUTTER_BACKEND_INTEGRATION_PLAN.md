# KẾ HOẠCH TÍCH HỢP FLUTTER VỚI BACKEND

## 📋 TỔNG QUAN BACKEND

### Tech Stack Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Zod
- **Port**: 4000 (default)
- **CORS**: Enabled cho tất cả origins (`*`)

### API Base URL
- **Development**: `http://localhost:4000`
- **Production**: Cần config trong environment variables

---

## 🔐 AUTHENTICATION SYSTEM

### JWT Token Flow
1. User đăng nhập/đăng ký → Nhận JWT token
2. Token được lưu trong `localStorage` (web) hoặc `SharedPreferences` (Flutter)
3. Mỗi request cần gửi token trong header: `Authorization: Bearer <token>`
4. Token có thời hạn: **7 ngày**

### Token Structure
```dart
// JWT Payload
{
  "sub": "user_id",        // User ID
  "email": "user@email.com",
  "name": "User Name",
  "role": "user" | "admin",
  "iat": 1234567890,       // Issued at
  "exp": 1234567890        // Expires at (7 days)
}
```

### Flutter Implementation
```dart
// lib/services/auth_service.dart
class AuthService {
  static const String _tokenKey = 'auth_token';
  
  // Lưu token
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }
  
  // Lấy token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }
  
  // Xóa token (logout)
  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
  
  // Check if authenticated
  static Future<bool> isAuthenticated() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
```

---

## 📡 API ENDPOINTS DOCUMENTATION

### 1. Authentication Endpoints

#### POST `/api/auth/register`
**Description**: Đăng ký tài khoản mới

**Request Body**:
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (201)**:
```json
{
  "message": "Đăng ký thành công!",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "",
    "address": "",
    "role": "user",
    "balance": 0,
    "isApproved": true,
    "hasUsedFreeShare": false,
    "subscriptionExpiresAt": null,
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (409)**:
```json
{
  "error": "Email đã tồn tại"
}
```

**Flutter Implementation**:
```dart
// lib/services/api_service.dart
Future<AuthResponse> register({
  required String name,
  required String email,
  required String password,
}) async {
  final response = await http.post(
    Uri.parse('$baseUrl/api/auth/register'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'name': name,
      'email': email,
      'password': password,
    }),
  );
  
  if (response.statusCode == 201) {
    final data = jsonDecode(response.body);
    await AuthService.saveToken(data['token']);
    return AuthResponse.fromJson(data);
  } else {
    final error = jsonDecode(response.body);
    throw ApiException(error['error'] ?? 'Đăng ký thất bại');
  }
}
```

#### POST `/api/auth/login`
**Description**: Đăng nhập

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "",
    "address": "",
    "role": "user",
    "balance": 0,
    "isApproved": true,
    "hasUsedFreeShare": false,
    "subscriptionExpiresAt": null,
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (401)**:
```json
{
  "error": "Sai email hoặc mật khẩu"
}
```

---

### 2. User Endpoints (Require Authentication)

#### GET `/api/users/me`
**Description**: Lấy thông tin user hiện tại

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "",
  "address": "",
  "role": "user",
  "balance": 0,
  "isApproved": true,
  "shareCount": 5,
  "hasUsedFreeShare": true,
  "hasActiveSubscription": false,
  "subscriptionExpiresAt": null,
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

**Notes**:
- `shareCount` tự động reset về 0 mỗi ngày mới
- `hasActiveSubscription` được tính từ `subscriptionExpiresAt`

**Flutter Implementation**:
```dart
Future<User> getCurrentUser() async {
  final token = await AuthService.getToken();
  if (token == null) throw UnauthorizedException();
  
  final response = await http.get(
    Uri.parse('$baseUrl/api/users/me'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
  );
  
  if (response.statusCode == 200) {
    return User.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 401) {
    await AuthService.clearToken();
    throw UnauthorizedException();
  } else {
    throw ApiException('Không thể lấy thông tin user');
  }
}
```

#### PUT `/api/users/me`
**Description**: Cập nhật thông tin profile

**Headers**: `Authorization: Bearer <token>`

**Request Body** (tất cả fields optional):
```json
{
  "name": "Nguyễn Văn B",
  "email": "newemail@example.com",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận XYZ"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Nguyễn Văn B",
    "email": "newemail@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận XYZ",
    "role": "user"
  }
}
```

**Response Error (409)**:
```json
{
  "error": "Email đã được sử dụng bởi tài khoản khác"
}
```

#### GET `/api/users/today-new-users`
**Description**: Lấy số lượng user mới đăng ký hôm nay

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```json
{
  "count": 15,
  "date": "2025-01-15"
}
```

#### POST `/api/users/share-post`
**Description**: Chia sẻ bài viết lên các nhóm

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "postLink": "https://www.facebook.com/...",
  "groupIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "groupCount": 2
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "sharePost": {
    "id": "507f1f77bcf86cd799439013",
    "postLink": "https://www.facebook.com/...",
    "groupCount": 2,
    "isFreeShare": true,
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "message": "Chia sẻ miễn phí thành công! Lần tiếp theo bạn cần đăng ký gói để tiếp tục."
}
```

**Response Error (403)** - Cần đăng ký gói:
```json
{
  "error": "Bạn cần đăng ký gói để tiếp tục chia sẻ. Lần đầu chia sẻ miễn phí, từ lần 2 cần đăng ký gói.",
  "requiresSubscription": true
}
```

**Response Error (400)**:
```json
{
  "error": "Vui lòng nhập link bài viết"
}
```
hoặc
```json
{
  "error": "Vui lòng chọn ít nhất một nhóm"
}
```

**Business Logic**:
- Lần đầu share: Miễn phí (`isFreeShare: true`)
- Từ lần 2: Cần có active subscription
- `shareCount` tự động tăng theo số nhóm share
- `shareCount` reset về 0 mỗi ngày mới

#### GET `/api/users/share-posts`
**Description**: Lấy danh sách bài viết đã share

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```json
{
  "success": true,
  "posts": [
    {
      "id": "507f1f77bcf86cd799439013",
      "postLink": "https://www.facebook.com/...",
      "groupCount": 2,
      "groups": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Bất Động Sản Hà Nội",
          "region": "Bắc",
          "province": "Hà Nội"
        }
      ],
      "isFreeShare": true,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Groups Endpoints

#### GET `/api/groups`
**Description**: Lấy danh sách nhóm (có thể filter theo region/province)

**Query Parameters**:
- `region` (optional): "Bắc", "Trung", "Nam"
- `province` (optional): Tên tỉnh thành

**Example**: `/api/groups?region=Bắc&province=Hà Nội`

**Response Success (200)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Bất Động Sản Hà Nội",
    "region": "Bắc",
    "province": "Hà Nội",
    "provinceCode": "HN",
    "image": "https://example.com/image.jpg",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
]
```

**Flutter Implementation**:
```dart
Future<List<Group>> getGroups({
  String? region,
  String? province,
}) async {
  final queryParams = <String, String>{};
  if (region != null) queryParams['region'] = region;
  if (province != null) queryParams['province'] = province;
  
  final uri = Uri.parse('$baseUrl/api/groups')
    .replace(queryParameters: queryParams);
  
  final response = await http.get(uri);
  
  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(response.body);
    return data.map((json) => Group.fromJson(json)).toList();
  } else {
    throw ApiException('Không thể tải danh sách nhóm');
  }
}
```

#### GET `/api/groups/regions`
**Description**: Lấy danh sách các miền

**Response Success (200)**:
```json
["Bắc", "Trung", "Nam"]
```

#### GET `/api/groups/provinces`
**Description**: Lấy danh sách các tỉnh thành

**Query Parameters**:
- `region` (optional): Filter theo miền

**Example**: `/api/groups/provinces?region=Bắc`

**Response Success (200)**:
```json
["Hà Nội", "Hải Phòng", "Quảng Ninh", ...]
```

---

### 4. Subscription Endpoints

#### GET `/api/subscription/plans`
**Description**: Lấy danh sách gói đăng ký (Public - không cần auth)

**Response Success (200)**:
```json
{
  "success": true,
  "plans": [
    {
      "id": "6months",
      "name": "Gói 6 tháng",
      "duration": 6,
      "price": 500000,
      "priceFormatted": "500k"
    },
    {
      "id": "12months",
      "name": "Gói 1 năm",
      "duration": 12,
      "price": 1000000,
      "priceFormatted": "1000k"
    }
  ]
}
```

#### GET `/api/subscription/status`
**Description**: Kiểm tra trạng thái subscription

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:
```json
{
  "success": true,
  "hasActiveSubscription": false,
  "canShareFree": false,
  "subscriptionExpiresAt": null,
  "hasUsedFreeShare": true,
  "pendingRequest": {
    "id": "507f1f77bcf86cd799439014",
    "planName": "Gói 6 tháng",
    "price": 500000,
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Response khi không có pending request**:
```json
{
  "success": true,
  "hasActiveSubscription": false,
  "canShareFree": false,
  "subscriptionExpiresAt": null,
  "hasUsedFreeShare": true,
  "pendingRequest": null
}
```

#### POST `/api/subscription/purchase`
**Description**: Mua gói đăng ký (tạo pending request)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "planId": "6months",
  "paymentNote": "GOI 6 THANG WEB SHARE" // Optional
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Đã gửi yêu cầu đăng ký Gói 6 tháng. Vui lòng chờ admin xác nhận.",
  "request": {
    "id": "507f1f77bcf86cd799439014",
    "planId": "6months",
    "planName": "Gói 6 tháng",
    "price": 500000,
    "status": "pending",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Response Error (400)**:
```json
{
  "error": "Gói đăng ký không hợp lệ"
}
```

---

## 🏗️ FLUTTER API SERVICE ARCHITECTURE

### Project Structure
```
lib/
├── services/
│   ├── api_service.dart          # Main API client
│   ├── auth_service.dart          # Authentication service
│   └── storage_service.dart      # Local storage service
├── models/
│   ├── user.dart                  # User model
│   ├── group.dart                 # Group model
│   ├── share_post.dart            # SharePost model
│   ├── subscription_plan.dart     # SubscriptionPlan model
│   └── subscription_status.dart   # SubscriptionStatus model
├── exceptions/
│   ├── api_exception.dart         # Custom API exceptions
│   └── unauthorized_exception.dart
└── config/
    └── api_config.dart            # API configuration
```

### API Service Implementation

```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../exceptions/api_exception.dart';
import '../services/auth_service.dart';

class ApiService {
  static const String baseUrl = ApiConfig.baseUrl;
  
  // Helper method để tạo headers với auth token
  static Future<Map<String, String>> _getHeaders({
    bool requiresAuth = false,
  }) async {
    final headers = {
      'Content-Type': 'application/json',
    };
    
    if (requiresAuth) {
      final token = await AuthService.getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    
    return headers;
  }
  
  // Helper method để handle response
  static dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return null;
      }
      return jsonDecode(response.body);
    } else if (response.statusCode == 401) {
      // Unauthorized - clear token
      AuthService.clearToken();
      throw UnauthorizedException('Phiên đăng nhập đã hết hạn');
    } else {
      final error = jsonDecode(response.body);
      throw ApiException(
        error['error'] ?? 'Có lỗi xảy ra',
        statusCode: response.statusCode,
      );
    }
  }
  
  // ========== AUTH ENDPOINTS ==========
  
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );
    
    final data = _handleResponse(response);
    if (data != null && data['token'] != null) {
      await AuthService.saveToken(data['token']);
    }
    return data;
  }
  
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    final data = _handleResponse(response);
    if (data != null && data['token'] != null) {
      await AuthService.saveToken(data['token']);
    }
    return data;
  }
  
  // ========== USER ENDPOINTS ==========
  
  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users/me'),
      headers: await _getHeaders(requiresAuth: true),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? email,
    String? phone,
    String? address,
  }) async {
    final body = <String, dynamic>{};
    if (name != null) body['name'] = name;
    if (email != null) body['email'] = email;
    if (phone != null) body['phone'] = phone;
    if (address != null) body['address'] = address;
    
    final response = await http.put(
      Uri.parse('$baseUrl/api/users/me'),
      headers: await _getHeaders(requiresAuth: true),
      body: jsonEncode(body),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> getTodayNewUsers() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users/today-new-users'),
      headers: await _getHeaders(requiresAuth: true),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> sharePost({
    required String postLink,
    required List<String> groupIds,
    required int groupCount,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/users/share-post'),
      headers: await _getHeaders(requiresAuth: true),
      body: jsonEncode({
        'postLink': postLink,
        'groupIds': groupIds,
        'groupCount': groupCount,
      }),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> getSharePosts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users/share-posts'),
      headers: await _getHeaders(requiresAuth: true),
    );
    
    return _handleResponse(response);
  }
  
  // ========== GROUPS ENDPOINTS ==========
  
  Future<List<dynamic>> getGroups({
    String? region,
    String? province,
  }) async {
    final queryParams = <String, String>{};
    if (region != null) queryParams['region'] = region;
    if (province != null) queryParams['province'] = province;
    
    final uri = Uri.parse('$baseUrl/api/groups')
      .replace(queryParameters: queryParams);
    
    final response = await http.get(
      uri,
      headers: await _getHeaders(),
    );
    
    return _handleResponse(response) ?? [];
  }
  
  Future<List<String>> getRegions() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/groups/regions'),
      headers: await _getHeaders(),
    );
    
    return List<String>.from(_handleResponse(response) ?? []);
  }
  
  Future<List<String>> getProvinces({String? region}) async {
    final queryParams = <String, String>{};
    if (region != null) queryParams['region'] = region;
    
    final uri = Uri.parse('$baseUrl/api/groups/provinces')
      .replace(queryParameters: queryParams);
    
    final response = await http.get(
      uri,
      headers: await _getHeaders(),
    );
    
    return List<String>.from(_handleResponse(response) ?? []);
  }
  
  // ========== SUBSCRIPTION ENDPOINTS ==========
  
  Future<Map<String, dynamic>> getSubscriptionPlans() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/subscription/plans'),
      headers: await _getHeaders(),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> getSubscriptionStatus() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/subscription/status'),
      headers: await _getHeaders(requiresAuth: true),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> purchasePlan({
    required String planId,
    String? paymentNote,
  }) async {
    final body = <String, dynamic>{
      'planId': planId,
    };
    if (paymentNote != null) body['paymentNote'] = paymentNote;
    
    final response = await http.post(
      Uri.parse('$baseUrl/api/subscription/purchase'),
      headers: await _getHeaders(requiresAuth: true),
      body: jsonEncode(body),
    );
    
    return _handleResponse(response);
  }
}
```

### API Configuration

```dart
// lib/config/api_config.dart
class ApiConfig {
  // Development
  static const String baseUrl = 'http://localhost:4000';
  
  // Production (cần config từ environment)
  // static const String baseUrl = 'https://api.yourdomain.com';
  
  // Timeout settings
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
```

### Exception Handling

```dart
// lib/exceptions/api_exception.dart
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  
  ApiException(this.message, {this.statusCode});
  
  @override
  String toString() => message;
}

// lib/exceptions/unauthorized_exception.dart
class UnauthorizedException extends ApiException {
  UnauthorizedException([String? message])
      : super(message ?? 'Phiên đăng nhập đã hết hạn', statusCode: 401);
}
```

---

## 📦 DATA MODELS

### User Model

```dart
// lib/models/user.dart
class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String address;
  final String role;
  final int balance;
  final bool isApproved;
  final int shareCount;
  final bool hasUsedFreeShare;
  final bool hasActiveSubscription;
  final DateTime? subscriptionExpiresAt;
  final DateTime createdAt;
  
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.address,
    required this.role,
    required this.balance,
    required this.isApproved,
    required this.shareCount,
    required this.hasUsedFreeShare,
    required this.hasActiveSubscription,
    this.subscriptionExpiresAt,
    required this.createdAt,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      address: json['address'] ?? '',
      role: json['role'] ?? 'user',
      balance: json['balance'] ?? 0,
      isApproved: json['isApproved'] ?? false,
      shareCount: json['shareCount'] ?? 0,
      hasUsedFreeShare: json['hasUsedFreeShare'] ?? false,
      hasActiveSubscription: json['hasActiveSubscription'] ?? false,
      subscriptionExpiresAt: json['subscriptionExpiresAt'] != null
          ? DateTime.parse(json['subscriptionExpiresAt'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'address': address,
      'role': role,
      'balance': balance,
      'isApproved': isApproved,
      'shareCount': shareCount,
      'hasUsedFreeShare': hasUsedFreeShare,
      'hasActiveSubscription': hasActiveSubscription,
      'subscriptionExpiresAt': subscriptionExpiresAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
```

### Group Model

```dart
// lib/models/group.dart
class Group {
  final String id;
  final String name;
  final String? region;
  final String? province;
  final String? provinceCode;
  final String? image;
  final DateTime createdAt;
  
  Group({
    required this.id,
    required this.name,
    this.region,
    this.province,
    this.provinceCode,
    this.image,
    required this.createdAt,
  });
  
  factory Group.fromJson(Map<String, dynamic> json) {
    return Group(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      region: json['region'],
      province: json['province'],
      provinceCode: json['provinceCode'],
      image: json['image'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'region': region,
      'province': province,
      'provinceCode': provinceCode,
      'image': image,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
```

### SharePost Model

```dart
// lib/models/share_post.dart
class SharePost {
  final String id;
  final String postLink;
  final int groupCount;
  final List<Group> groups;
  final bool isFreeShare;
  final DateTime createdAt;
  
  SharePost({
    required this.id,
    required this.postLink,
    required this.groupCount,
    required this.groups,
    required this.isFreeShare,
    required this.createdAt,
  });
  
  factory SharePost.fromJson(Map<String, dynamic> json) {
    return SharePost(
      id: json['id'] ?? json['_id'] ?? '',
      postLink: json['postLink'] ?? '',
      groupCount: json['groupCount'] ?? 0,
      groups: (json['groups'] as List<dynamic>?)
          ?.map((g) => Group.fromJson(g))
          .toList() ?? [],
      isFreeShare: json['isFreeShare'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
```

### Subscription Models

```dart
// lib/models/subscription_plan.dart
class SubscriptionPlan {
  final String id;
  final String name;
  final int duration; // months
  final int price;
  final String priceFormatted;
  
  SubscriptionPlan({
    required this.id,
    required this.name,
    required this.duration,
    required this.price,
    required this.priceFormatted,
  });
  
  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) {
    return SubscriptionPlan(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      duration: json['duration'] ?? 0,
      price: json['price'] ?? 0,
      priceFormatted: json['priceFormatted'] ?? '',
    );
  }
}

// lib/models/subscription_status.dart
class SubscriptionStatus {
  final bool hasActiveSubscription;
  final bool canShareFree;
  final DateTime? subscriptionExpiresAt;
  final bool hasUsedFreeShare;
  final PendingRequest? pendingRequest;
  
  SubscriptionStatus({
    required this.hasActiveSubscription,
    required this.canShareFree,
    this.subscriptionExpiresAt,
    required this.hasUsedFreeShare,
    this.pendingRequest,
  });
  
  factory SubscriptionStatus.fromJson(Map<String, dynamic> json) {
    return SubscriptionStatus(
      hasActiveSubscription: json['hasActiveSubscription'] ?? false,
      canShareFree: json['canShareFree'] ?? false,
      subscriptionExpiresAt: json['subscriptionExpiresAt'] != null
          ? DateTime.parse(json['subscriptionExpiresAt'])
          : null,
      hasUsedFreeShare: json['hasUsedFreeShare'] ?? false,
      pendingRequest: json['pendingRequest'] != null
          ? PendingRequest.fromJson(json['pendingRequest'])
          : null,
    );
  }
}

class PendingRequest {
  final String id;
  final String planName;
  final int price;
  final DateTime createdAt;
  
  PendingRequest({
    required this.id,
    required this.planName,
    required this.price,
    required this.createdAt,
  });
  
  factory PendingRequest.fromJson(Map<String, dynamic> json) {
    return PendingRequest(
      id: json['id'] ?? json['_id'] ?? '',
      planName: json['planName'] ?? '',
      price: json['price'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
```

---

## 🔄 STATE MANAGEMENT INTEGRATION

### Using Provider

```dart
// lib/providers/auth_provider.dart
import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;
  
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  
  final ApiService _apiService = ApiService();
  
  // Check if user is already logged in
  Future<void> checkAuth() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        await fetchUser();
      }
    } catch (e) {
      _error = e.toString();
      await AuthService.clearToken();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Login
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _apiService.login(
        email: email,
        password: password,
      );
      _user = User.fromJson(response['user']);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Register
  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _apiService.register(
        name: name,
        email: email,
        password: password,
      );
      _user = User.fromJson(response['user']);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Fetch current user
  Future<void> fetchUser() async {
    try {
      final data = await _apiService.getCurrentUser();
      _user = User.fromJson(data);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _user = null;
      notifyListeners();
    }
  }
  
  // Logout
  Future<void> logout() async {
    await AuthService.clearToken();
    _user = null;
    _error = null;
    notifyListeners();
  }
}
```

---

## 🛠️ ERROR HANDLING & RETRY LOGIC

### Network Error Handling

```dart
// lib/services/api_service.dart (enhanced)
import 'dart:io';

class ApiService {
  // ... existing code ...
  
  static Future<http.Response> _makeRequest(
    Future<http.Response> Function() request, {
    int maxRetries = 3,
  }) async {
    int attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        final response = await request();
        return response;
      } on SocketException {
        // Network error
        if (attempts == maxRetries - 1) {
          throw ApiException('Không có kết nối mạng. Vui lòng kiểm tra lại.');
        }
        await Future.delayed(Duration(seconds: 2 * (attempts + 1)));
      } on HttpException {
        // HTTP error
        if (attempts == maxRetries - 1) {
          throw ApiException('Lỗi kết nối server. Vui lòng thử lại sau.');
        }
        await Future.delayed(Duration(seconds: 2 * (attempts + 1)));
      } catch (e) {
        // Other errors - don't retry
        rethrow;
      }
      attempts++;
    }
    
    throw ApiException('Không thể kết nối đến server');
  }
}
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Setup (Week 1)
- [ ] Tạo API service structure
- [ ] Setup HTTP client (http package)
- [ ] Tạo exception classes
- [ ] Setup SharedPreferences cho token storage
- [ ] Tạo API config file
- [ ] Test connection với backend (health check)

### Phase 2: Authentication (Week 1-2)
- [ ] Implement AuthService (token management)
- [ ] Implement login API
- [ ] Implement register API
- [ ] Implement getCurrentUser API
- [ ] Create AuthProvider (state management)
- [ ] Test authentication flow

### Phase 3: User Features (Week 2)
- [ ] Implement updateProfile API
- [ ] Implement getTodayNewUsers API
- [ ] Implement sharePost API
- [ ] Implement getSharePosts API
- [ ] Create UserProvider
- [ ] Test user features

### Phase 4: Groups Features (Week 2-3)
- [ ] Implement getGroups API
- [ ] Implement getRegions API
- [ ] Implement getProvinces API
- [ ] Create GroupsProvider
- [ ] Test groups features

### Phase 5: Subscription Features (Week 3)
- [ ] Implement getSubscriptionPlans API
- [ ] Implement getSubscriptionStatus API
- [ ] Implement purchasePlan API
- [ ] Create SubscriptionProvider
- [ ] Test subscription features

### Phase 6: Error Handling & Polish (Week 4)
- [ ] Implement retry logic
- [ ] Implement network error handling
- [ ] Add loading states
- [ ] Add error messages
- [ ] Test error scenarios
- [ ] Performance optimization

---

## 🚨 IMPORTANT NOTES

### 1. Token Management
- Token được lưu trong SharedPreferences
- Token tự động được thêm vào header mỗi request cần auth
- Khi nhận 401, tự động clear token và logout user

### 2. Error Handling
- Tất cả API errors được catch và convert thành ApiException
- Network errors được retry (max 3 lần)
- User-friendly error messages

### 3. Date/Time Handling
- Backend sử dụng UTC+7 (Vietnam timezone)
- Flutter cần convert dates properly
- `shareCount` reset mỗi ngày mới (theo Vietnam timezone)

### 4. Business Logic
- **Free Share**: Lần đầu share miễn phí, từ lần 2 cần subscription
- **Share Count**: Reset về 0 mỗi ngày mới
- **Subscription**: Pending request chờ admin approve

### 5. Testing
- Test với backend development server
- Test error scenarios (network error, 401, 400, etc.)
- Test token expiration
- Test concurrent requests

---

## ✅ SUCCESS CRITERIA

- ✅ Tất cả API endpoints được implement
- ✅ Authentication flow hoạt động đúng
- ✅ Token được lưu và tự động thêm vào requests
- ✅ Error handling đầy đủ
- ✅ Loading states cho tất cả async operations
- ✅ Retry logic cho network errors
- ✅ State management hoạt động tốt
- ✅ Models được serialize/deserialize đúng

---

**Tài liệu này cung cấp đầy đủ thông tin để implement Flutter app kết nối với backend. Hãy follow theo checklist và implement từng phase một.**

