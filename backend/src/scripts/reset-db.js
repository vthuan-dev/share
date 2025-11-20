import 'dotenv/config';
import { connectMongo } from '../db/index.js';
import { Group } from '../models/Group.js';
import { User } from '../models/User.js';

await connectMongo();
await User.deleteMany({});
await Group.deleteMany({});
await Group.insertMany([
  // MIỀN BẮC - 20 nhóm
  { name: 'Mua Bán Bất Động Sản Hà Nội_Không Trung Gian', region: 'north' },
  { name: 'Bất động sản Hà Nội', region: 'north' },
  { name: 'Bất Động Sản Hà Nội', region: 'north' },
  { name: 'Mua Bán Bất Động Sản HÀ NỘI', region: 'north' },
  { name: 'MUA BÁN BẤT ĐỘNG SẢN THỔ CƯ HÀ NỘI', region: 'north' },
  { name: 'BẤT ĐỘNG SẢN HÀ NỘI', region: 'north' },
  { name: 'Nhà Đất Hà Nội - Mua Bán', region: 'north' },
  { name: 'BĐS Hà Nội - Bất Động Sản Việt Nam', region: 'north' },
  
  // Nhóm Hải Phòng
  { name: 'Bất Động Sản Hải Phòng', region: 'north' },
  { name: 'Hội Mua Bán Nhà Đất Giá Rẻ Hải Phòng', region: 'north' },
  { name: 'BẤT ĐỘNG SẢN HẢI PHÒNG', region: 'north' },
  { name: 'Mua Bán Bất Động Sản Hải Phòng', region: 'north' },
  { name: 'Nhà Đất Hải Phòng - Mua Bán Cho Thuê', region: 'north' },
  { name: 'Mua Bán Nhà Đất Huyện An Dương - Hải Phòng', region: 'north' },
  { name: 'Mua Bán Nhà Đất Quận An Dương - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản An Dương - Hải Phòng', region: 'north' },
  { name: 'Bất động sản Hải Dương', region: 'north' },
  { name: 'Mua bán nhà đất quận An Dương, Hải Phòng', region: 'north' },
  { name: 'BẤT ĐỘNG SẢN HẢI PHÒNG', region: 'north' },
  { name: 'Bất động sản Hải Dương', region: 'north' },
  { name: 'Mua Bán Nhà Đất Huyện An Dương - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Hải Phòng', region: 'north' },
  { name: 'Mua Bán Nhà Đất Quận An Dương - Hải Phòng', region: 'north' },
  { name: 'Bất động sản An Dương - Hải Phòng', region: 'north' },
  { name: 'Mua bán nhà đất Hải Phòng giá rẻ', region: 'north' },
  { name: 'Nhóm Bất Động Sản Hải Phòng Uy Tín', region: 'north' },
  { name: 'Chợ Bất Động Sản Hải Phòng', region: 'north' },
  { name: 'Mua Bán Đất Nền Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Quận Lê Chân - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Quận Ngô Quyền - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Quận Hồng Bàng - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Quận Kiến An - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Huyện Thủy Nguyên - Hải Phòng', region: 'north' },
  { name: 'Bất Động Sản Huyện An Lão - Hải Phòng', region: 'north' },
  { name: 'Nhà Đất Đô Thị Hải Phòng', region: 'north' },
  { name: 'Mua Bán Căn Hộ Chung Cư Hải Phòng', region: 'north' },
  
  { name: 'Bất Động Sản Quảng Ninh - Hạ Long', region: 'north' },
  { name: 'Nhà Đất Bắc Ninh - Từ Sơn', region: 'north' },
  { name: 'BĐS Hải Dương - Chí Linh', region: 'north' },
  { name: 'Mua Bán Bất Động Sản Nam Định', region: 'north' },
  { name: 'Nhà Đất Thái Bình', region: 'north' },
  { name: 'Bất Động Sản Ninh Bình - Tam Cốc', region: 'north' },
  { name: 'BĐS Thanh Hóa - Sầm Sơn', region: 'north' },
  { name: 'Mua Bán Nhà Đất Nghệ An - Vinh', region: 'north' },
  { name: 'Bất Động Sản Hưng Yên', region: 'north' },
  { name: 'Nhà Đất Vĩnh Phúc - Phúc Yên', region: 'north' },
  { name: 'BĐS Phú Thọ - Việt Trì', region: 'north' },
  
  // MIỀN TRUNG - 20 nhóm
  { name: 'Bất Động Sản Đà Nẵng', region: 'central' },
  { name: 'Nhà Đất Huế - Thừa Thiên Huế', region: 'central' },
  { name: 'BĐS Quảng Nam - Hội An', region: 'central' },
  { name: 'Mua Bán Bất Động Sản Đà Nẵng', region: 'central' },
  { name: 'BẤT ĐỘNG SẢN MIỀN TRUNG', region: 'central' },
  { name: 'Nhà Đất Quảng Bình - Đồng Hới', region: 'central' },
  { name: 'Bất Động Sản Nha Trang - Khánh Hòa', region: 'central' },
  { name: 'Mua Bán BĐS Quy Nhơn - Bình Định', region: 'central' },
  { name: 'Bất Động Sản Phú Yên - Tuy Hòa', region: 'central' },
  { name: 'Nhà Đất Quảng Ngãi', region: 'central' },
  { name: 'BĐS Quảng Trị - Đông Hà', region: 'central' },
  { name: 'Mua Bán Nhà Đất Hà Tĩnh', region: 'central' },
  { name: 'Bất Động Sản Đắk Lắk - Buôn Ma Thuột', region: 'central' },
  { name: 'Nhà Đất Gia Lai - Pleiku', region: 'central' },
  { name: 'BĐS Kon Tum', region: 'central' },
  { name: 'Mua Bán Bất Động Sản Đắk Nông', region: 'central' },
  { name: 'Nhà Đất Cam Ranh - Khánh Hòa', region: 'central' },
  { name: 'BĐS Ninh Thuận - Phan Rang', region: 'central' },
  { name: 'Mua Bán Nhà Đất Tam Kỳ - Quảng Nam', region: 'central' },
  { name: 'Bất Động Sản Tây Nguyên', region: 'central' },
  
  // MIỀN NAM - 20 nhóm
  { name: 'Bất Động Sản TP.HCM', region: 'south' },
  { name: 'Mua Bán Nhà Đất Sài Gòn', region: 'south' },
  { name: 'BẤT ĐỘNG SẢN VIỆT NAM', region: 'south' },
  { name: 'Nhà Đất Bình Dương - Đồng Nai', region: 'south' },
  { name: 'BĐS ĐỒNG NAI - BIÊN HÒA', region: 'south' },
  { name: 'Mua Bán Bất Động Sản Vũng Tàu', region: 'south' },
  { name: 'Nhà Đất Cần Thơ - ĐBSCL', region: 'south' },
  { name: 'Bất Động Sản Long An - Tân An', region: 'south' },
  { name: 'BĐS Đà Lạt - Lâm Đồng', region: 'south' },
  { name: 'Mua Bán Nhà Đất Phan Thiết - Bình Thuận', region: 'south' },
  { name: 'Bất Động Sản Tiền Giang - Mỹ Tho', region: 'south' },
  { name: 'Nhà Đất Bến Tre', region: 'south' },
  { name: 'BĐS An Giang - Châu Đốc', region: 'south' },
  { name: 'Mua Bán Bất Động Sản Vĩnh Long', region: 'south' },
  { name: 'Nhà Đất Sóc Trăng', region: 'south' },
  { name: 'Bất Động Sản Kiên Giang - Phú Quốc', region: 'south' },
  { name: 'BĐS Tây Ninh', region: 'south' },
  { name: 'Mua Bán Nhà Đất Bà Rịa - Vũng Tàu', region: 'south' },
  { name: 'Bất Động Sản Bạc Liêu', region: 'south' },
  { name: 'Nhà Đất Trà Vinh', region: 'south' }
]);

console.log('Mongo database reset complete.');


