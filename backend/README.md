# Share Backend (Express MVC)

## Run

```bash
cd backend
npm install
# create .env
# PORT=4000
# JWT_SECRET=change_me_in_production
# MONGO_URL=mongodb://127.0.0.1:27017/shareapp
npm run dev
```

Server runs at http://localhost:4000

## API
- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password }
- GET  /api/users/me (Authorization: Bearer <token>)
- GET  /api/groups

## Notes
- DB: MongoDB (local or Atlas). Set `MONGO_URL`.
- Seed/reset sample groups: `npm run db:reset`


