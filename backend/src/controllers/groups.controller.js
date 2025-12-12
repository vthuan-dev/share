import { Group } from '../models/Group.js';

// Lấy danh sách nhóm với filter
export async function listGroups(req, res) {
  try {
    const { region, province } = req.query;
    
    const query = {};
    if (region) query.region = region;
    if (province) query.province = province;
    
    const rows = await Group.find(query, { 
      name: 1, 
      region: 1, 
      province: 1, 
      provinceCode: 1,
      image: 1,
      createdAt: 1 
    }).sort({ region: 1, province: 1, name: 1 }).lean();
    
    const groups = rows.map(g => ({ 
      id: g._id.toString(), 
      name: g.name, 
      region: g.region || '',
      province: g.province || '',
      provinceCode: g.provinceCode || '',
      image: g.image || '',
      createdAt: g.createdAt 
    }));
    
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách nhóm' });
  }
}

// Lấy danh sách các miền
export async function getRegions(req, res) {
  try {
    const regions = await Group.distinct('region');
    res.json(regions.filter(r => r)); // Loại bỏ null/undefined
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách miền' });
  }
}

// Lấy danh sách các tỉnh thành
export async function getProvinces(req, res) {
  try {
    const { region } = req.query;
    const query = region ? { region } : {};
    const provinces = await Group.distinct('province', query);
    res.json(provinces.filter(p => p)); // Loại bỏ null/undefined
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tỉnh thành' });
  }
}


