import 'dotenv/config';
import { connectMongo } from '../db/index.js';
import { Group } from '../models/Group.js';
import { User } from '../models/User.js';

await connectMongo();
await User.deleteMany({});
await Group.deleteMany({});
await Group.insertMany([
  { name: 'Mua Bán Bất Động Sản Hà Nội_Không Trung Gian', region: 'north' },
  { name: 'Bất động sản Hà Nội', region: 'north' },
  { name: 'Bất Động Sản Hà Nội', region: 'north' },
  { name: 'Mua Bán Bất Động Sản HÀ NỘI', region: 'north' },
  { name: 'MUA BÁN BẤT ĐỘNG SẢN THỔ CƯ HÀ NỘI', region: 'north' },
  { name: 'Bất Động Sản Đà Nẵng', region: 'central' },
  { name: 'Nhà Đất Huế - Thừa Thiên Huế', region: 'central' },
  { name: 'BĐS Quảng Nam - Hội An', region: 'central' },
  { name: 'Mua Bán Bất Động Sản Đà Nẵng', region: 'central' },
  { name: 'Bất Động Sản TP.HCM', region: 'south' },
  { name: 'Mua Bán Nhà Đất Sài Gòn', region: 'south' },
  { name: 'BẤT ĐỘNG SẢN VIỆT NAM', region: 'south' },
  { name: 'Nhà Đất Bình Dương - Đồng Nai', region: 'south' },
  { name: 'BĐS ĐỒNG NAI - BIÊN HÒA', region: 'south' }
]);

console.log('Mongo database reset complete.');


