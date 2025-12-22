# PROMPT CHUYỂN ĐỔI DỰ ÁN SANG FLUTTER

## CONTEXT
Tôi có một ứng dụng web React/TypeScript cho phép người dùng chia sẻ bài viết Facebook lên các nhóm bất động sản ở 3 miền Việt Nam. Tôi muốn chuyển đổi phần client sang Flutter mobile app với UI phải giống 100% so với web version.

## YÊU CẦU CHÍNH

### 1. UI/UX Requirements (BẮT BUỘC - 100% giống)
- **Layout**: Mobile-first, max-width 430px, centered container
- **Color Scheme**: 
  - Primary: Red-600 (#DC2626)
  - Background: White (#FFFFFF)
  - Accents: Gray scale (50-900), Blue (50-600), Green (500-600)
  - Facebook Blue: #1877F2
- **Typography**: Inter font (hoặc system default), sizes: 12px, 14px, 16px, 18px, 20px, 24px
- **Spacing**: 4px grid system (4, 8, 12, 16, 24, 32px)
- **Border Radius**: 12px (xl), 16px (2xl), 32px, full circle
- **Shadows**: sm, md, lg, 2xl với opacity tương ứng
- **Bottom Navigation**: 5 tabs với share button là floating button (red-600, 52x52, rounded-full)
- **Header**: Red-600 background, logo (64x64) + avatar + greeting text

### 2. Core Features
1. **Authentication**: Login/Register screens
2. **Overview Screen**: 2 stat cards (share count, new users)
3. **Groups List**: 
   - Select all button
   - Group items với checkbox, image, name, status, verified badge
   - Selection mode với visual feedback
4. **Regional Groups**: 
   - 3 tabs (Bắc/Trung/Nam)
   - Province filter dropdown
   - Group list tương tự
5. **Facebook Share Sheet**:
   - Modal bottom sheet
   - 2 steps: Login → Share
   - Facebook-style UI (blue header, form inputs)
   - Group selection display
6. **Share Posts Panel**: List of shared posts
7. **Account Screen**: 
   - Subscription status card
   - Menu items (Profile, Settings, Security, Subscription)
   - Logout button

### 3. Technical Requirements
- **State Management**: Provider hoặc Riverpod
- **Navigation**: go_router
- **HTTP**: http package hoặc dio
- **Image Loading**: cached_network_image với fallback
- **Local Storage**: shared_preferences
- **Toast Notifications**: fluttertoast
- **Form Validation**: form_builder_validators

### 4. API Integration
- Base URL: http://localhost:4000 (configurable)
- Endpoints:
  - POST /api/auth/login
  - POST /api/auth/register
  - GET /api/users/me
  - GET /api/groups?region=...&province=...
  - GET /api/groups/regions
  - GET /api/groups/provinces?region=...
  - POST /api/users/share-post
  - GET /api/users/share-posts
  - GET /api/subscription/status
  - POST /api/subscription/purchase
- Authentication: Bearer token trong header

### 5. Component Mapping
- React `<div>` → Flutter `Container`
- React `<button>` → Flutter `ElevatedButton`/`TextButton`
- React `<input>` → Flutter `TextFormField`
- React `<img>` → Flutter `CachedNetworkImage`
- React BottomNav → Flutter `BottomNavigationBar` (custom)
- React Modal → Flutter `showModalBottomSheet`
- React Toast → Flutter `Fluttertoast.showToast`

### 6. Project Structure
```
lib/
├── main.dart
├── config/ (theme, colors, typography, api)
├── models/ (user, group, share_post, subscription)
├── services/ (api_service, auth_service, storage_service)
├── providers/ (state management)
├── screens/ (all screen widgets)
├── widgets/ (reusable components)
└── utils/ (helpers, validators, constants)
```

## DELIVERABLES

1. **Flutter App** với:
   - Tất cả screens từ web version
   - UI giống 100% (colors, spacing, typography, layout)
   - Full API integration
   - State management hoàn chỉnh
   - Error handling & loading states
   - Form validation

2. **Documentation**:
   - Setup instructions
   - API configuration guide
   - Component usage examples

## CONSTRAINTS

- **KHÔNG được thay đổi UI design** - phải giống 100%
- **KHÔNG được thay đổi API structure** - phải compatible với backend hiện tại
- **KHÔNG được thay đổi business logic** - flow phải giống y hệt
- **PHẢI responsive** - hoạt động tốt trên các screen sizes khác nhau
- **PHẢI có error handling** - graceful error messages
- **PHẢI có loading states** - loading indicators khi fetch data

## TIMELINE

- **Week 1**: Setup & Foundation
- **Week 2-3**: Core Screens
- **Week 4**: Advanced Features
- **Week 5**: Integration & Polish
- **Week 6**: Testing & Refinement

**Total: 6-7 weeks**

## SUCCESS CRITERIA

✅ UI matches web version 100% (pixel-perfect)
✅ All features work as expected
✅ API integration complete
✅ No crashes or critical bugs
✅ Smooth animations and transitions
✅ Proper error handling
✅ Loading states for all async operations
✅ Form validation working
✅ Responsive on different screen sizes

## NOTES

- Web version sử dụng Tailwind CSS - cần replicate styling trong Flutter Theme
- Web version có max-width 430px - Flutter cần ConstrainedBox với maxWidth: 430
- Web version có bottom nav với floating share button - cần custom implementation
- Web version có Facebook-style share sheet - cần custom modal bottom sheet design
- Icons từ Lucide React - cần tìm Flutter alternatives (Material Icons hoặc custom SVG)

---

**Hãy bắt đầu với việc setup project và tạo theme configuration trước, sau đó implement từng screen một theo thứ tự: Main App → Header → Bottom Nav → Overview → Groups → Share Sheet → Account.**







