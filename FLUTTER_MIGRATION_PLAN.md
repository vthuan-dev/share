# KẾ HOẠCH CHUYỂN ĐỔI DỰ ÁN SANG FLUTTER

## 📋 TỔNG QUAN DỰ ÁN

### Mô tả ứng dụng
Ứng dụng web cho phép người dùng chia sẻ bài viết Facebook lên các nhóm bất động sản ở 3 miền (Bắc - Trung - Nam) của Việt Nam.

### Tech Stack hiện tại (Client)
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.9.5
- **UI Library**: Radix UI components + Tailwind CSS 4.1.16
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Notifications**: Sonner (toast notifications)
- **Form Handling**: React Hook Form
- **Styling**: Tailwind CSS với custom theme

### Kiến trúc hiện tại
- **Layout**: Mobile-first, max-width 430px, centered container
- **Navigation**: Bottom navigation bar với 5 tabs
- **Color Scheme**: Red-600 primary, white background, gray accents
- **Design System**: Rounded corners (2xl, xl), shadows, transitions

---

## 🎯 PHÂN TÍCH KHẢ NĂNG CHUYỂN ĐỔI SANG FLUTTER

### ✅ KHẢ NĂNG CAO (Dễ chuyển đổi)

#### 1. UI Components & Layout
- **Bottom Navigation**: Flutter có `BottomNavigationBar` hoặc `CupertinoTabBar` - tương đương 100%
- **Cards & Containers**: `Card`, `Container` với `BorderRadius` - tương đương 100%
- **Lists**: `ListView`, `ListView.builder` - tương đương 100%
- **Buttons**: `ElevatedButton`, `TextButton`, `IconButton` - tương đương 100%
- **Input Fields**: `TextFormField`, `TextField` - tương đương 100%
- **Images**: `Image.network`, `CachedNetworkImage` - tương đương 100%
- **Icons**: `flutter_svg` hoặc icon packages - tương đương 100%

#### 2. Navigation & Routing
- **React Router** → **Flutter Navigator 2.0** hoặc **go_router**
- Tương đương 95%, cần cấu hình routes tương tự

#### 3. State Management
- **React Hooks** → **Flutter StatefulWidget** hoặc **Provider/Riverpod/Bloc**
- Tương đương 90%, cần refactor logic state

#### 4. HTTP Requests
- **Fetch API** → **http** package hoặc **dio**
- Tương đương 100%, chỉ cần thay đổi syntax

#### 5. Form Handling
- **React Hook Form** → **FormBuilder** hoặc native Flutter forms
- Tương đương 85%, cần custom validation

#### 6. Notifications/Toasts
- **Sonner** → **fluttertoast** hoặc **snackbar**
- Tương đương 90%, cần custom styling

### ⚠️ KHẢ NĂNG TRUNG BÌNH (Cần custom)

#### 1. Styling System
- **Tailwind CSS** → **Flutter Theme** + custom styling
- Tương đương 80%, cần:
  - Tạo ThemeData với colors tương tự
  - Custom TextStyles
  - Reusable widgets cho spacing, borders, shadows

#### 2. Modal/Dialog/Sheet
- **Radix UI Dialog** → **showDialog**, **showModalBottomSheet**
- Tương đương 85%, cần custom animations

#### 3. Image Loading & Fallback
- **ImageWithFallback component** → **CachedNetworkImage** với errorWidget
- Tương đương 90%, cần custom fallback logic

#### 4. Checkbox & Selection UI
- **Radix UI Checkbox** → **Checkbox** hoặc custom checkbox
- Tương đương 90%, cần custom styling

### 🔴 THÁCH THỨC (Cần giải pháp đặc biệt)

#### 1. Facebook Share Sheet UI
- **Vấn đề**: UI giống Facebook login/share sheet
- **Giải pháp**: 
  - Custom `showModalBottomSheet` với custom design
  - Sử dụng `flutter_facebook_auth` nếu cần tích hợp thực sự
  - Hoặc giữ UI tương tự nhưng chỉ là mockup

#### 2. Responsive Design
- **Vấn đề**: Web có max-width 430px, Flutter mobile cần responsive
- **Giải pháp**: 
  - Sử dụng `LayoutBuilder` để detect screen size
  - Constraint width trên tablet/web
  - MediaQuery cho breakpoints

#### 3. Web-specific Features
- **Vấn đề**: `window.open()` cho Facebook links
- **Giải pháp**: 
  - `url_launcher` package cho mobile
  - `html` package cho web (nếu build Flutter web)

---

## 📐 UI/UX SPECIFICATIONS (Phải giống 100%)

### Color Palette
```dart
// Primary Colors
Color red600 = Color(0xFFDC2626); // #DC2626
Color red700 = Color(0xFFB91C1C); // #B91C1C
Color red50 = Color(0xFFFEF2F2); // #FEF2F2

// Neutral Colors
Color gray50 = Color(0xFFF9FAFB);
Color gray100 = Color(0xFFF3F4F6);
Color gray200 = Color(0xFFE5E7EB);
Color gray400 = Color(0xFF9CA3AF);
Color gray500 = Color(0xFF6B7280);
Color gray600 = Color(0xFF4B5563);
Color gray700 = Color(0xFF374151);
Color gray900 = Color(0xFF111827);

// Accent Colors
Color blue50 = Color(0xFFEFF6FF);
Color blue500 = Color(0xFF3B82F6);
Color blue600 = Color(0xFF2563EB);
Color green500 = Color(0xFF10B981);
Color green600 = Color(0xFF059669);
Color white = Color(0xFFFFFFFF);
Color black = Color(0xFF000000);

// Facebook Colors
Color facebookBlue = Color(0xFF1877F2);
Color facebookBlueDark = Color(0xFF166FE5);
```

### Typography
```dart
// Font Family: Inter (hoặc Roboto trên Android, SF Pro trên iOS)
TextStyle(
  fontFamily: 'Inter',
  fontSize: 16, // base
  fontWeight: FontWeight.normal, // 400
  height: 1.5,
)

// Sizes
- text-xs: 12px
- text-sm: 14px
- text-base: 16px
- text-lg: 18px
- text-xl: 20px
- text-2xl: 24px
```

### Spacing System
```dart
// Based on 4px grid
double spacing1 = 4.0;   // 1 unit
double spacing2 = 8.0;   // 2 units
double spacing3 = 12.0;  // 3 units
double spacing4 = 16.0;  // 4 units
double spacing6 = 24.0;  // 6 units
double spacing8 = 32.0;  // 8 units
```

### Border Radius
```dart
BorderRadius radiusXl = BorderRadius.circular(12.0);      // rounded-xl
BorderRadius radius2xl = BorderRadius.circular(16.0);     // rounded-2xl
BorderRadius radius32 = BorderRadius.circular(32.0);     // rounded-[32px]
BorderRadius radiusFull = BorderRadius.circular(9999.0); // rounded-full
```

### Shadows
```dart
BoxShadow shadowSm = BoxShadow(
  color: Colors.black.withOpacity(0.05),
  blurRadius: 1,
  offset: Offset(0, 1),
);

BoxShadow shadowMd = BoxShadow(
  color: Colors.black.withOpacity(0.1),
  blurRadius: 4,
  offset: Offset(0, 2),
);

BoxShadow shadowLg = BoxShadow(
  color: Colors.black.withOpacity(0.1),
  blurRadius: 10,
  offset: Offset(0, 4),
);

BoxShadow shadow2xl = BoxShadow(
  color: Colors.black.withOpacity(0.25),
  blurRadius: 25,
  offset: Offset(0, 10),
);
```

### Layout Constraints
```dart
// Max width container (giống web)
ConstrainedBox(
  constraints: BoxConstraints(maxWidth: 430),
  child: Container(...),
)

// Safe area padding cho bottom nav
Padding(
  padding: EdgeInsets.only(
    bottom: MediaQuery.of(context).padding.bottom,
  ),
)
```

---

## 🏗️ KIẾN TRÚC FLUTTER

### Project Structure
```
lib/
├── main.dart
├── app.dart
├── config/
│   ├── theme.dart          # Theme configuration
│   ├── colors.dart         # Color constants
│   ├── typography.dart     # Text styles
│   └── api_config.dart     # API base URL
├── models/
│   ├── user.dart
│   ├── group.dart
│   ├── share_post.dart
│   └── subscription.dart
├── services/
│   ├── api_service.dart     # HTTP client
│   ├── auth_service.dart   # Authentication
│   └── storage_service.dart # LocalStorage
├── providers/              # State management (Provider/Riverpod)
│   ├── auth_provider.dart
│   ├── groups_provider.dart
│   └── subscription_provider.dart
├── screens/
│   ├── login/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── overview/
│   │   └── overview_screen.dart
│   ├── groups/
│   │   ├── groups_list_screen.dart
│   │   └── regional_groups_screen.dart
│   ├── share/
│   │   └── share_posts_screen.dart
│   └── account/
│       ├── account_screen.dart
│       ├── profile_screen.dart
│       ├── settings_screen.dart
│       └── security_screen.dart
├── widgets/
│   ├── common/
│   │   ├── bottom_nav.dart
│   │   ├── header.dart
│   │   ├── custom_button.dart
│   │   ├── custom_card.dart
│   │   └── loading_indicator.dart
│   ├── groups/
│   │   ├── group_item.dart
│   │   └── group_selection_item.dart
│   ├── account/
│   │   ├── account_overview_card.dart
│   │   └── subscription_status_card.dart
│   └── share/
│       └── facebook_share_sheet.dart
└── utils/
    ├── validators.dart
    ├── helpers.dart
    └── constants.dart
```

### State Management Strategy
**Recommendation: Provider hoặc Riverpod**

**Provider** (đơn giản hơn):
- `ChangeNotifierProvider` cho global state
- `Consumer` hoặc `Selector` để rebuild widgets
- Dễ học, phù hợp với team mới Flutter

**Riverpod** (modern hơn):
- Type-safe, compile-time errors
- Better testing
- More powerful features

### Navigation Strategy
**Recommendation: go_router**

```dart
final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => MainApp(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => RegisterScreen(),
    ),
    // ... more routes
  ],
);
```

---

## 📦 DEPENDENCIES CẦN THIẾT

### Core Dependencies
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  provider: ^6.1.1
  # hoặc
  # flutter_riverpod: ^2.4.9
  
  # Navigation
  go_router: ^13.0.0
  
  # HTTP
  http: ^1.1.0
  # hoặc
  # dio: ^5.4.0
  
  # Local Storage
  shared_preferences: ^2.2.2
  
  # Image Loading
  cached_network_image: ^3.3.0
  
  # Icons
  flutter_svg: ^2.0.9
  # hoặc
  # font_awesome_flutter: ^10.6.0
  
  # URL Launcher
  url_launcher: ^6.2.2
  
  # Toast/Notifications
  fluttertoast: ^8.2.4
  # hoặc
  # awesome_snackbar_content: ^0.3.2
  
  # Form Validation
  form_builder_validators: ^9.1.0
  
  # Icons (Lucide alternatives)
  # Có thể dùng Material Icons hoặc tìm package tương tự
```

### Dev Dependencies
```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

---

## 🎨 UI COMPONENTS MAPPING

### React Component → Flutter Widget

| React Component | Flutter Widget | Notes |
|----------------|----------------|-------|
| `<div className="...">` | `Container()` | Với decoration |
| `<button>` | `ElevatedButton()` / `TextButton()` | Tùy style |
| `<input>` | `TextFormField()` | Với validator |
| `<img>` | `Image.network()` / `CachedNetworkImage()` | Với error handling |
| `<svg>` | `SvgPicture.asset()` / `SvgPicture.network()` | Từ flutter_svg |
| BottomNav | `BottomNavigationBar()` | Custom với 5 items |
| Header | `AppBar()` hoặc custom `Container()` | Custom design |
| Card | `Card()` hoặc `Container()` với `BoxDecoration` | |
| Modal/Dialog | `showDialog()` / `showModalBottomSheet()` | Custom design |
| Toast | `Fluttertoast.showToast()` | Custom styling |
| Checkbox | `Checkbox()` | Custom styling |
| List | `ListView.builder()` | Với itemBuilder |

---

## 📱 SCREEN-BY-SCREEN BREAKDOWN

### 1. Main App Screen (App.tsx → main_screen.dart)
**Features:**
- Container max-width 430px, centered
- Header component
- Content area với tab switching
- Bottom navigation

**Flutter Implementation:**
```dart
class MainScreen extends StatefulWidget {
  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    OverviewScreen(),
    GroupsListScreen(),
    SharePostsScreen(),
    AccountScreen(),
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 430),
          child: _screens[_currentIndex],
        ),
      ),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}
```

### 2. Header Component (Header.tsx → header_widget.dart)
**Features:**
- Red-600 background
- Logo (64x64, rounded-16px)
- Avatar + Greeting text
- Welcome message banner

**Flutter Implementation:**
```dart
class HeaderWidget extends StatelessWidget {
  final String userName;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.red600,
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          // Logo + Avatar row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Logo
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: Colors.white,
                ),
                child: Image.asset('assets/images/logo.png'),
              ),
              // Avatar + Greeting
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundImage: NetworkImage('...'),
                  ),
                  SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(getGreeting(), style: TextStyle(...)),
                      Text(userName, style: TextStyle(...)),
                    ],
                  ),
                ],
              ),
            ],
          ),
          // Welcome banner
          Container(
            margin: EdgeInsets.only(top: 16),
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text('Chào mừng bạn đến với...'),
          ),
        ],
      ),
    );
  }
}
```

### 3. Bottom Navigation (BottomNav.tsx → bottom_nav_widget.dart)
**Features:**
- 5 items: Overview, Groups, Share (special), Posts, Account
- Share button là floating button (red-600, 52x52, rounded-full)
- Active state với color change
- Icons từ Lucide (cần tìm alternatives)

**Flutter Implementation:**
```dart
class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.gray200)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.home, 'Tổng quan'),
          _buildNavItem(1, Icons.people, 'Nhóm chia sẻ'),
          _buildSpecialButton(), // Share button
          _buildNavItem(2, Icons.article, 'Bài viết'),
          _buildNavItem(3, Icons.menu, 'Tài khoản'),
        ],
      ),
    );
  }
  
  Widget _buildSpecialButton() {
    return GestureDetector(
      onTap: () => onTap(2), // Share action
      child: Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          color: AppColors.red600,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 8,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Icon(Icons.share, color: Colors.white, size: 24),
        margin: EdgeInsets.only(bottom: 24), // Floating effect
      ),
    );
  }
}
```

### 4. Account Overview (AccountOverview.tsx → overview_screen.dart)
**Features:**
- 2 cards: Share count, New users today
- Grid layout (2 columns)
- Icons, numbers, descriptions

**Flutter Implementation:**
```dart
class OverviewScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          HeaderWidget(),
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                Text('Tổng quan tài khoản', style: TextStyle(...)),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildStatCard('Tin đăng', shareCount)),
                    SizedBox(width: 12),
                    Expanded(child: _buildStatCard('Liên hệ', newUsers)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatCard(String label, int value) {
    return Container(
      height: 128,
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.gray100,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon + Label
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.share, color: Colors.white, size: 16),
              ),
              SizedBox(width: 8),
              Text(label, style: TextStyle(...)),
            ],
          ),
          Spacer(),
          // Value
          Text('$value nhóm', style: TextStyle(fontSize: 24)),
          Text('Đã chia sẻ', style: TextStyle(...)),
        ],
      ),
    );
  }
}
```

### 5. Groups List (GroupsList.tsx → groups_list_screen.dart)
**Features:**
- Select all button
- Group items với:
  - Checkbox (hoặc check icon khi selected)
  - Group image (56x56, rounded-xl)
  - Group name
  - Status badge
  - Verified icon
  - Local badge (Home icon)

**Flutter Implementation:**
```dart
class GroupsListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: groups.length,
      itemBuilder: (context, index) {
        final group = groups[index];
        final isSelected = selectedGroups.contains(group.id);
        
        return GestureDetector(
          onTap: () => toggleSelection(group.id),
          child: Container(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.red50 : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: isSelected 
                ? Border.all(color: AppColors.red600, width: 2)
                : null,
              boxShadow: [AppShadows.shadowSm],
            ),
            child: Row(
              children: [
                // Checkbox
                isSelected
                  ? Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.green500, width: 2),
                        color: Colors.white,
                      ),
                      child: Icon(Icons.check, size: 12, color: AppColors.green500),
                    )
                  : Checkbox(
                      value: false,
                      onChanged: (val) => toggleSelection(group.id),
                    ),
                SizedBox(width: 12),
                // Image
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: CachedNetworkImage(
                    imageUrl: group.image,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    errorWidget: (context, url, error) => 
                      Container(color: AppColors.gray200),
                  ),
                ),
                SizedBox(width: 12),
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              group.name,
                              style: TextStyle(...),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (group.verified)
                            Icon(Icons.verified, size: 16, color: AppColors.green500),
                        ],
                      ),
                      SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isSelected ? AppColors.green500 : AppColors.blue500,
                            ),
                          ),
                          SizedBox(width: 6),
                          Text(
                            isSelected ? 'Đã chọn' : group.status,
                            style: TextStyle(...),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
```

### 6. Facebook Share Sheet (FacebookShareSheet.tsx → facebook_share_sheet.dart)
**Features:**
- Modal bottom sheet
- 2 steps: Login → Share
- Facebook-style UI
- Form inputs
- Group list display

**Flutter Implementation:**
```dart
void showFacebookShareSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => FacebookShareSheet(),
  );
}

class FacebookShareSheet extends StatefulWidget {
  @override
  State<FacebookShareSheet> createState() => _FacebookShareSheetState();
}

class _FacebookShareSheetState extends State<FacebookShareSheet> {
  int _step = 0; // 0: login, 1: share
  
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            margin: EdgeInsets.only(top: 12),
            width: 48,
            height: 6,
            decoration: BoxDecoration(
              color: AppColors.gray300,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
          // Content based on step
          _step == 0 ? _buildLoginStep() : _buildShareStep(),
        ],
      ),
    );
  }
  
  Widget _buildLoginStep() {
    return Expanded(
      child: Column(
        children: [
          // Header
          Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SizedBox(width: 32),
                Text('Đăng nhập Facebook', style: TextStyle(...)),
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          // Facebook Logo
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.facebookBlue,
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.facebook, color: Colors.white, size: 32),
          ),
          SizedBox(height: 24),
          // Form
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                TextFormField(
                  decoration: InputDecoration(
                    hintText: 'Email hoặc số điện thoại',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                SizedBox(height: 16),
                TextFormField(
                  obscureText: true,
                  decoration: InputDecoration(
                    hintText: 'Mật khẩu',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => setState(() => _step = 1),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.facebookBlue,
                    minimumSize: Size(double.infinity, 48),
                  ),
                  child: Text('Đăng nhập'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildShareStep() {
    // Similar structure for share step
  }
}
```

---

## 🔄 API INTEGRATION

### API Service Structure
```dart
class ApiService {
  static const String baseUrl = 'http://localhost:4000';
  static String? _token;
  
  static Future<Map<String, dynamic>> request(
    String path, {
    String method = 'GET',
    Map<String, dynamic>? body,
  }) async {
    final url = Uri.parse('$baseUrl$path');
    final headers = {
      'Content-Type': 'application/json',
      if (_token != null) 'Authorization': 'Bearer $_token',
    };
    
    final response = await http.Request(method, url)
      ..headers.addAll(headers)
      ..body = body != null ? jsonEncode(body) : null;
    
    final streamedResponse = await response.send();
    final responseBody = await streamedResponse.stream.bytesToString();
    
    if (streamedResponse.statusCode >= 200 && 
        streamedResponse.statusCode < 300) {
      return jsonDecode(responseBody);
    } else {
      throw ApiException(responseBody);
    }
  }
  
  // Auth methods
  static Future<Map<String, dynamic>> login(String email, String password) {
    return request('/api/auth/login', 
      method: 'POST',
      body: {'email': email, 'password': password},
    );
  }
  
  // Groups methods
  static Future<List<dynamic>> getGroups({String? region, String? province}) {
    final queryParams = <String, String>{};
    if (region != null) queryParams['region'] = region;
    if (province != null) queryParams['province'] = province;
    
    final uri = Uri.parse('$baseUrl/api/groups')
      .replace(queryParameters: queryParams);
    
    return request(uri.path + '?' + uri.query);
  }
  
  // ... more methods
}
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Setup & Foundation (Week 1)
- [ ] Tạo Flutter project
- [ ] Setup dependencies (provider, go_router, http, etc.)
- [ ] Tạo theme configuration (colors, typography, spacing)
- [ ] Tạo base widgets (Button, Card, Input)
- [ ] Setup API service structure
- [ ] Setup navigation structure

### Phase 2: Core Screens (Week 2-3)
- [ ] Main App Screen với bottom navigation
- [ ] Header component
- [ ] Overview Screen
- [ ] Groups List Screen
- [ ] Regional Groups Screen
- [ ] Account Screen

### Phase 3: Advanced Features (Week 4)
- [ ] Facebook Share Sheet (Login + Share steps)
- [ ] Share Posts Panel
- [ ] Profile Screen
- [ ] Settings Screen
- [ ] Security Screen
- [ ] Subscription Purchase Screen

### Phase 4: Integration & Polish (Week 5)
- [ ] API integration cho tất cả screens
- [ ] State management implementation
- [ ] Error handling & loading states
- [ ] Toast notifications
- [ ] Image loading với fallback
- [ ] Form validation

### Phase 5: Testing & Refinement (Week 6)
- [ ] UI/UX review (so sánh với web version)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Responsive design testing
- [ ] Final polish

---

## 🎯 CRITICAL REQUIREMENTS

### UI Fidelity (100% Match)
1. **Colors**: Phải match chính xác hex codes
2. **Spacing**: Phải match padding/margin values
3. **Border Radius**: Phải match rounded values
4. **Typography**: Font size, weight, line height phải giống
5. **Shadows**: Box shadows phải giống
6. **Layout**: Max-width 430px, centered container
7. **Bottom Nav**: 5 items, share button floating
8. **Header**: Red background, logo + avatar layout

### Functionality (100% Match)
1. **Navigation**: Tab switching hoạt động giống
2. **Group Selection**: Checkbox behavior giống
3. **Form Validation**: Error messages giống
4. **API Calls**: Endpoints và payloads giống
5. **State Management**: Data persistence giống

### User Experience (100% Match)
1. **Loading States**: Loading indicators giống
2. **Error Handling**: Error messages giống
3. **Success Feedback**: Toast notifications giống
4. **Animations**: Transitions giống (nếu có)

---

## 🚨 POTENTIAL ISSUES & SOLUTIONS

### Issue 1: Icon Differences
**Problem**: Lucide icons không có sẵn trong Flutter
**Solution**: 
- Sử dụng Material Icons tương tự
- Hoặc tạo custom SVG icons
- Hoặc dùng package `lucide_flutter` nếu có

### Issue 2: Web-specific Code
**Problem**: `window.open()` không hoạt động trên mobile
**Solution**: 
- Dùng `url_launcher` package
- Check platform và handle accordingly

### Issue 3: Responsive Design
**Problem**: Web có fixed width, mobile cần responsive
**Solution**: 
- Dùng `LayoutBuilder` để constraint width
- MediaQuery cho breakpoints
- Flexible/Expanded widgets cho layout

### Issue 4: Image Loading Performance
**Problem**: Nhiều images có thể slow
**Solution**: 
- `CachedNetworkImage` với cache
- Lazy loading với `ListView.builder`
- Placeholder và error handling

---

## 📊 ESTIMATED EFFORT

### Development Time
- **Setup & Foundation**: 1 week
- **Core Screens**: 2-3 weeks
- **Advanced Features**: 1 week
- **Integration & Polish**: 1 week
- **Testing & Refinement**: 1 week

**Total: 6-7 weeks** (với 1 developer full-time)

### Complexity Rating
- **UI Replication**: ⭐⭐⭐⭐ (4/5) - Cần attention to detail
- **State Management**: ⭐⭐⭐ (3/5) - Standard Flutter patterns
- **API Integration**: ⭐⭐ (2/5) - Straightforward HTTP calls
- **Navigation**: ⭐⭐ (2/5) - Standard routing
- **Overall**: ⭐⭐⭐ (3/5) - Moderate complexity

---

## ✅ CONCLUSION

**Khả năng chuyển đổi: CAO (90%)**

Ứng dụng này hoàn toàn có thể chuyển đổi sang Flutter với:
- ✅ UI components đều có Flutter equivalents
- ✅ Logic business đơn giản, dễ port
- ✅ API structure rõ ràng
- ✅ Không có dependencies phức tạp

**Yêu cầu quan trọng:**
1. Phải match UI 100% (colors, spacing, typography)
2. Phải test kỹ trên mobile devices
3. Phải đảm bảo responsive design
4. Phải maintain API compatibility

**Recommendation**: 
Nên bắt đầu với prototype của 1-2 screens để validate approach, sau đó scale lên toàn bộ app.

