import 'dotenv/config';
import { connectMongo } from '../db/index.js';
import { Group } from '../models/Group.js';

// Danh sách 64 tỉnh thành Việt Nam
const provinces = [
  // Miền Bắc
  { name: 'Hà Nội', code: 'HN', region: 'Bắc' },
  { name: 'Hải Phòng', code: 'HP', region: 'Bắc' },
  { name: 'Quảng Ninh', code: 'QN', region: 'Bắc' },
  { name: 'Bắc Ninh', code: 'BN', region: 'Bắc' },
  { name: 'Hải Dương', code: 'HD', region: 'Bắc' },
  { name: 'Hưng Yên', code: 'HY', region: 'Bắc' },
  { name: 'Hà Nam', code: 'HN2', region: 'Bắc' },
  { name: 'Nam Định', code: 'ND', region: 'Bắc' },
  { name: 'Thái Bình', code: 'TB', region: 'Bắc' },
  { name: 'Ninh Bình', code: 'NB', region: 'Bắc' },
  { name: 'Vĩnh Phúc', code: 'VP', region: 'Bắc' },
  { name: 'Bắc Giang', code: 'BG', region: 'Bắc' },
  { name: 'Bắc Kạn', code: 'BK', region: 'Bắc' },
  { name: 'Cao Bằng', code: 'CB', region: 'Bắc' },
  { name: 'Điện Biên', code: 'DB', region: 'Bắc' },
  { name: 'Hà Giang', code: 'HG', region: 'Bắc' },
  { name: 'Lào Cai', code: 'LC', region: 'Bắc' },
  { name: 'Lai Châu', code: 'LCh', region: 'Bắc' },
  { name: 'Phú Thọ', code: 'PT', region: 'Bắc' },
  { name: 'Sơn La', code: 'SL', region: 'Bắc' },
  { name: 'Thái Nguyên', code: 'TN', region: 'Bắc' },
  { name: 'Tuyên Quang', code: 'TQ', region: 'Bắc' },
  { name: 'Yên Bái', code: 'YB', region: 'Bắc' },
  { name: 'Lạng Sơn', code: 'LS', region: 'Bắc' },
  
  // Miền Trung
  { name: 'Đà Nẵng', code: 'DN', region: 'Trung' },
  { name: 'Quảng Nam', code: 'QN2', region: 'Trung' },
  { name: 'Quảng Ngãi', code: 'QNg', region: 'Trung' },
  { name: 'Bình Định', code: 'BD', region: 'Trung' },
  { name: 'Phú Yên', code: 'PY', region: 'Trung' },
  { name: 'Khánh Hòa', code: 'KH', region: 'Trung' },
  { name: 'Ninh Thuận', code: 'NT', region: 'Trung' },
  { name: 'Bình Thuận', code: 'BT', region: 'Trung' },
  { name: 'Thanh Hóa', code: 'TH', region: 'Trung' },
  { name: 'Nghệ An', code: 'NA', region: 'Trung' },
  { name: 'Hà Tĩnh', code: 'HT', region: 'Trung' },
  { name: 'Quảng Bình', code: 'QB', region: 'Trung' },
  { name: 'Quảng Trị', code: 'QT', region: 'Trung' },
  { name: 'Thừa Thiên Huế', code: 'TTH', region: 'Trung' },
  { name: 'Kon Tum', code: 'KT', region: 'Trung' },
  { name: 'Gia Lai', code: 'GL', region: 'Trung' },
  { name: 'Đắk Lắk', code: 'DL', region: 'Trung' },
  { name: 'Đắk Nông', code: 'DN2', region: 'Trung' },
  { name: 'Lâm Đồng', code: 'LD', region: 'Trung' },
  
  // Miền Nam
  { name: 'Hồ Chí Minh', code: 'HCM', region: 'Nam' },
  { name: 'Bình Dương', code: 'BD2', region: 'Nam' },
  { name: 'Đồng Nai', code: 'DN3', region: 'Nam' },
  { name: 'Bà Rịa - Vũng Tàu', code: 'BRVT', region: 'Nam' },
  { name: 'Tây Ninh', code: 'TN2', region: 'Nam' },
  { name: 'Bình Phước', code: 'BP', region: 'Nam' },
  { name: 'Long An', code: 'LA', region: 'Nam' },
  { name: 'Tiền Giang', code: 'TG', region: 'Nam' },
  { name: 'Bến Tre', code: 'BT2', region: 'Nam' },
  { name: 'Trà Vinh', code: 'TV', region: 'Nam' },
  { name: 'Vĩnh Long', code: 'VL', region: 'Nam' },
  { name: 'Đồng Tháp', code: 'DT', region: 'Nam' },
  { name: 'An Giang', code: 'AG', region: 'Nam' },
  { name: 'Kiên Giang', code: 'KG', region: 'Nam' },
  { name: 'Cần Thơ', code: 'CT', region: 'Nam' },
  { name: 'Hậu Giang', code: 'HG2', region: 'Nam' },
  { name: 'Sóc Trăng', code: 'ST', region: 'Nam' },
  { name: 'Bạc Liêu', code: 'BL', region: 'Nam' },
  { name: 'Cà Mau', code: 'CM', region: 'Nam' },
];

// Tên nhóm mẫu (không gắn ảnh cố định để tránh trùng lặp)
const sampleGroups = [
  'Mua Bán Bất Động Sản',
  'Cho Thuê Nhà Đất',
  'Bất Động Sản',
  'Nhà Đất',
  'Đất Nền',
  'Chung Cư',
  'Mua Bán Nhà Đất',
  'Đất Thổ Cư',
  'Đầu Tư BĐS',
  'Nhà Đất Giá Rẻ',
  'Mua Bán Chung Cư',
  'Cho Thuê Phòng Trọ',
  'Môi Giới Nhà Đất',
  'BĐS Chính Chủ'
];

// Kho ảnh đa dạng, tránh trùng lặp nhiều
const imageParams = 'auto=format&fit=crop&w=200&h=200&q=80';
const imagePool = [
  // city/skyline
  `https://images.unsplash.com/photo-1582407947304-fd86f028f716?${imageParams}`,
  `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?${imageParams}`,
  `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?${imageParams}`,
  `https://images.unsplash.com/photo-1505691938895-1758d7feb511?${imageParams}`,
  `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`,
  `https://images.unsplash.com/photo-1449844908441-8829872d2607?${imageParams}`,
  `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`,
  `https://images.unsplash.com/photo-1523217582562-09d0def993a6?${imageParams}`,
  // apartments / houses
  `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?${imageParams}`,
  `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?${imageParams}`,
  `https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?${imageParams}`,
  `https://images.unsplash.com/photo-1518780664697-55e3ad937233?${imageParams}`,
  `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?${imageParams}`,
  `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?${imageParams}`,
  `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?${imageParams}`,
  `https://images.unsplash.com/photo-1484154218962-a197022b5858?${imageParams}`,
  // land / construction
  `https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?${imageParams}`,
  `https://images.unsplash.com/photo-1505691938895-1758d7feb511?${imageParams}`,
  `https://images.unsplash.com/photo-1529429617124-aee0b0142c0f?${imageParams}`,
  `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`,
  // interiors / rental
  `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?${imageParams}`,
  `https://images.unsplash.com/photo-1484154218962-a197022b5858?${imageParams}`,
  `https://images.unsplash.com/photo-1505691938895-1758d7feb511?${imageParams}`,
  // fallback extras
  `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${imageParams}`,
  `https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?${imageParams}`,
  `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${imageParams}`,
  `https://images.unsplash.com/photo-1460472178825-e5240623afd5?${imageParams}`,
  `https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?${imageParams}`,
  `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?${imageParams}`
];

async function seedGroups() {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    let createdCount = 0;
    let updatedCount = 0;
    let globalImageIndex = 0;

    for (const province of provinces) {
      // Tạo 12-14 nhóm mẫu cho mỗi tỉnh, dùng ảnh xoay vòng để tránh trùng nhiều
      const numGroups = Math.min(14, sampleGroups.length);
      
      for (let i = 0; i < numGroups; i++) {
        const groupNameTemplate = sampleGroups[i % sampleGroups.length];
        const groupName = `${groupNameTemplate} ${province.name}`;
        const imageUrl = imagePool[globalImageIndex % imagePool.length];
        globalImageIndex++;
        
        // Kiểm tra xem nhóm đã tồn tại chưa
        const existing = await Group.findOne({ 
          name: groupName,
          province: province.name 
        });
        
        if (!existing) {
          await Group.create({
            name: groupName,
            region: province.region,
            province: province.name,
            provinceCode: province.code,
            image: imageUrl,
          });
          createdCount++;
        } else {
          // Cập nhật ảnh nếu nhóm đã tồn tại nhưng chưa có ảnh hoặc ảnh không đúng
          if (!existing.image || !existing.image.includes('unsplash.com')) {
            await Group.findByIdAndUpdate(existing._id, {
              image: imageUrl,
            });
            updatedCount++;
          }
        }
      }
    }

    // Cập nhật tất cả nhóm không có ảnh
    const groupsWithoutImage = await Group.find({ 
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
        { image: { $not: /unsplash\.com/ } }
      ]
    });
    
    for (const group of groupsWithoutImage) {
      // Tìm ảnh phù hợp dựa trên tên nhóm
      const matchedImage = imagePool[globalImageIndex % imagePool.length];
      globalImageIndex++;
      await Group.findByIdAndUpdate(group._id, {
        image: matchedImage,
      });
      updatedCount++;
    }

    console.log(`✅ Created ${createdCount} new groups`);
    console.log(`🔄 Updated ${updatedCount} groups with images`);
    console.log(`📊 Total groups in database: ${await Group.countDocuments()}`);
    console.log(`🖼️  Groups with images: ${await Group.countDocuments({ image: { $regex: /unsplash\.com/ } })}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding groups:', error);
    process.exit(1);
  }
}

seedGroups();

