import { Group } from '../models/Group.js';

export async function listGroups(req, res) {
  const rows = await Group.find({}, { name: 1, region: 1, createdAt: 1 }).sort({ _id: 1 }).lean();
  const groups = rows.map(g => ({ id: g._id.toString(), name: g.name, region: g.region, createdAt: g.createdAt }));
  res.json(groups);
}


