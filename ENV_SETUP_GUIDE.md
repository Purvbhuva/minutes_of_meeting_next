# Environment Configuration Guide

## Current .env Setup

Your `.env` file has been configured with the following:

```env
# Database Configuration (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret for Authentication
JWT_SECRET="your-super-secret-jwt-key-for-mom-change-in-production"
NEXTAUTH_SECRET="your-super-secret-jwt-key-for-mom"

# Node Environment
NODE_ENV="development"

# API Base URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## 🔑 Environment Variables Explanation

### `DATABASE_URL`
- **Current:** `file:./prisma/dev.db` (SQLite)
- **Purpose:** Connection string for the database
- **Development:** SQLite (recommended for local)
- **Production:** Use PostgreSQL or MySQL

**To switch databases:**

#### PostgreSQL (Production):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mom_db"
```

#### MySQL:
```env
DATABASE_URL="mysql://user:password@localhost:3306/mom_db"
```

### `JWT_SECRET`
- **Current:** Placeholder secret key
- **Purpose:** Signs and verifies JWT tokens
- **Security:** Change this to a strong random string in production

**Generate a secure secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### `NEXTAUTH_SECRET`
- **Current:** Placeholder secret
- **Purpose:** Session encryption
- **Note:** Can use same value as JWT_SECRET if needed

### `NODE_ENV`
- **Options:** "development", "production"
- **Current:** "development"
- **Impact:** Affects logging, optimization, security headers

### `NEXT_PUBLIC_API_URL`
- **Current:** `http://localhost:3000`
- **Purpose:** Frontend API endpoint
- **Important:** Prefix with `NEXT_PUBLIC_` for browser access
- **Update for:** Different server hostname/port

---

## 🚀 Production Setup

### 1. Update Database
```env
# Instead of SQLite:
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/mom_production"
```

### 2. Generate Secure Secrets
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate strong NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Update Environment
```env
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://your-domain.com"
JWT_SECRET="<your-secure-random-key>"
NEXTAUTH_SECRET="<your-secure-random-key>"
DATABASE_URL="postgresql://user:password@your-db-host:5432/mom_db"
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔄 Environment Variables by Use Case

### Local Development
```env
NODE_ENV="development"
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_API_URL="http://localhost:3000"
JWT_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
```

### Docker/Container Deployment
```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@postgres:5432/mom"
NEXT_PUBLIC_API_URL="http://your-container-domain"
JWT_SECRET="<generated-secret>"
NEXTAUTH_SECRET="<generated-secret>"
```

### Cloud Deployment (Vercel/AWS/GCP)
```env
NODE_ENV="production"
DATABASE_URL="<cloud-database-url>"
NEXT_PUBLIC_API_URL="https://your-app-domain.com"
JWT_SECRET="<generated-secret>"
NEXTAUTH_SECRET="<generated-secret>"
```

---

## 🗄️ Switching Databases

### From SQLite to PostgreSQL

1. **Install PostgreSQL**
2. **Update .env**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mom_db"
   ```
3. **Create new migration**
   ```bash
   npm run prisma:generate
   npx prisma migrate dev --name init
   ```
4. **Seed new database**
   ```bash
   npm run seed
   ```

---

## 🔐 Security Best Practices

### Development ✅
- Keep using current setup
- Never commit real secrets to git
- Use `.env.local` for local overrides

### Production ⚠️
- Never hardcode secrets
- Use environment variable services:
  - Vercel Secrets
  - AWS Secrets Manager
  - GCP Secret Manager
  - HashiCorp Vault
- Rotate secrets regularly
- Use strong, random values
- Enable HTTPS only
- Set secure cookie flags

### CI/CD Pipeline
```bash
# Use environment-specific files
.env.production  # Committed (no secrets)
.env.local       # Local overrides (gitignored)
```

---

## 📝 .env.example (Template)

Create a `.env.example` for sharing without secrets:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/mom_db"

# JWT Authentication
JWT_SECRET="your-secure-jwt-secret-here"
NEXTAUTH_SECRET="your-secure-nextauth-secret-here"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## ⚙️ Prisma Configuration

### Current Setup
- **Provider:** SQLite
- **Location:** `./prisma/schema.prisma`
- **Database File:** `./prisma/dev.db`

### To Change Provider

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change to your database
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

---

## 🧪 Testing Environment Variables

Verify your setup:

```bash
# Check database connectivity
npx prisma db execute --stdin < prisma/schema.prisma

# Generate Prisma client
npm run prisma:generate

# Test login with default credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "EmailAddress": "admin@demo.com",
    "Password": "admin123"
  }'
```

---

## 🆘 Troubleshooting

### Error: "Can't reach database"
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# For PostgreSQL, verify connection
psql postgresql://user:password@localhost:5432/mom_db -c "SELECT 1"
```

### Error: "JWT_SECRET not found"
```bash
# Verify .env exists in project root
ls -la .env

# Check JWT_SECRET is set
grep JWT_SECRET .env
```

### Database migrations failing
```bash
# Reset and recreate
npm run prisma:generate
npx prisma migrate reset
npm run seed
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [JWT.io](https://jwt.io)
- [PostgreSQL Setup](https://www.postgresql.org/download)

---

## ✅ Configuration Checklist

- ✅ DATABASE_URL configured
- ✅ JWT_SECRET configured
- ✅ NEXTAUTH_SECRET configured
- ✅ NODE_ENV set to "development"
- ✅ NEXT_PUBLIC_API_URL set
- ✅ .env file created in project root
- ✅ Database initialized
- ✅ Seeding successful
- ✅ Application tested

---

**Your application is ready to run!** 🎉
