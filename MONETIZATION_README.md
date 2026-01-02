# Skillytics Monetization Implementation

This document outlines the comprehensive monetization strategy implemented for Skillytics-AIML, including subscription tiers, certifications, marketplace, enterprise features, and payment processing.

## 📋 Overview

The monetization system includes:

- **Freemium Subscription Model**: Free, Pro ($29/month), and Enterprise ($149/month) tiers
- **Certification System**: 6 professional certifications with PDF generation
- **Content Marketplace**: Creator economy with revenue sharing (60/40 split)
- **Enterprise Features**: Team management, SSO, custom learning paths
- **Stripe Integration**: Complete payment processing with webhooks

---

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Price IDs (Create in Stripe Dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_ANNUAL_PRICE_ID="price_..."
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID="price_..."
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID="price_..."

# SSO Encryption (for enterprise features)
SSO_ENCRYPTION_KEY="your-256-bit-encryption-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema changes
bun run db:push

# Seed monetization data
bun prisma/monetization-seed.ts
```

### 3. Stripe Setup

1. Create products and prices in Stripe Dashboard:
   - Pro Monthly ($29)
   - Pro Annual ($249)
   - Enterprise Monthly ($149)
   - Enterprise Annual ($1,299)

2. Configure webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`

3. Add price IDs to environment variables

### 4. Start Development Server

```bash
bun run dev
```

Visit `http://localhost:3000/pricing` to see the pricing page.

---

## 📁 File Structure

```
prisma/
├── schema.prisma              # Original schema
├── monetization-schema.prisma # Monetization additions
└── monetization-seed.ts       # Seed data for plans & certs

src/
├── lib/
│   ├── stripe.ts             # Stripe integration service
│   └── certificate.ts        # PDF certificate generation
├── middleware.ts             # Content gating middleware
├── components/
│   ├── pricing-page.tsx      # Pricing plans UI
│   ├── certification-dashboard.tsx  # Certification management
│   ├── marketplace.tsx       # Marketplace UI
│   └── enterprise-dashboard.tsx     # Enterprise team management
└── app/
    ├── pricing/page.tsx      # /pricing route
    ├── certifications/page.tsx # /certifications route
    ├── marketplace/page.tsx  # /marketplace route
    ├── enterprise/page.tsx   # /enterprise route
    ├── dashboard/subscription/page.tsx # Subscription management
    ├── api/
    │   ├── subscriptions/route.ts      # Subscription API
    │   ├── certifications/route.ts     # Certification API
    │   ├── marketplace/route.ts        # Marketplace API
    │   ├── enterprise/route.ts         # Enterprise API
    │   └── webhooks/stripe/route.ts    # Stripe webhooks
```

---

## 💰 Subscription Tiers

### Free Tier
- **Price**: $0
- **Access**: Modules 1-3 (40 missions)
- **Features**:
  - Basic progress tracking
  - Community forum access
  - Limited analytics

### Pro Tier
- **Price**: $29/month or $249/year
- **Access**: All 320 missions across 16 modules
- **Features**:
  - Advanced analytics dashboard
  - Skill profiling & heatmaps
  - Downloadable certificates
  - Priority support
  - Career portfolio building
  - Interview preparation guide

### Enterprise Tier
- **Price**: $149/month or $1,299/year
- **Access**: Everything in Pro + team features
- **Features**:
  - Team management dashboard
  - Custom learning paths
  - SSO integration (Okta, Azure AD, Google)
  - LMS integration (SCORM, xAPI)
  - Advanced team analytics
  - Progress reporting & exports
  - Dedicated account manager
  - Custom mission development
  - API access

---

## 🎓 Certification System

### Available Certifications

| Certification | Requirements | Points |
|--------------|--------------|--------|
| **ML Engineer** | Complete all 320 missions (80% avg) | 500 |
| **Data Scientist** | Modules 2-7 (75% avg) | 400 |
| **MLOps Engineer** | Modules 12-14 (80% avg) | 400 |
| **Computer Vision** | Modules 9-10 (80% avg) | 350 |
| **NLP Engineer** | Modules 9, 11 (80% avg) | 350 |
| **AI Professional** | Modules 15-16 (85% avg) | 300 |

### Features
- Automated progress tracking
- PDF certificate generation with unique verification hash
- Online verification via unique URL
- 2-year validity with recertification option
- LinkedIn-ready certificates

---

## 🛒 Marketplace

### Item Types
- **Mission Bundles**: Curated mission packages ($9.99-$49.99)
- **Study Guides**: PDF study materials ($9.99-$29.99)
- **Video Courses**: Supplementary video content ($29.99-$99.99)
- **Templates**: Code templates and snippets ($4.99-$19.99)
- **Practice Exams**: Mock certification exams ($19.99-$49.99)
- **Interview Prep**: Interview preparation materials ($49.99-$199.99)

### Revenue Sharing
- **Creators**: 60% of sales
- **Platform**: 40% (covers payment processing, hosting, moderation)

### Creator Features
- Creator profile pages
- Revenue dashboard
- Payout management (PayPal, bank transfer, Stripe)
- Quality review system

---

## 🏢 Enterprise Features

### Team Management
- Invite members via email
- Role-based access (Owner, Admin, Member)
- Domain-based auto-join
- Member activity tracking

### Single Sign-On (SSO)
- **Supported Providers**: Okta, Azure AD, Google Workspace
- **Protocols**: SAML 2.0, OIDC
- **Configuration**: Admin dashboard with encrypted config storage

### Learning Paths
- Custom curriculum creation
- Target deadline setting
- Progress tracking per path
- Module grouping

### Analytics
- Team-wide mission completion rates
- Skill distribution analysis
- Individual member progress
- Comparative leaderboards
- Exportable reports

---

## 🔒 Content Gating

### Middleware Protection

The `middleware.ts` file implements content gating based on subscription tier:

```typescript
// Free users can access:
- Landing page (/pricing)
- Missions 1-40 (Modules 1-3)
- Community features

// Pro users can access:
- All missions (1-320)
- Analytics dashboard
- Certifications
- Marketplace

// Enterprise users can access:
- Team management
- SSO configuration
- Learning path creation
- Advanced analytics
```

### Mission-Level Access
- Missions 1-40: Free
- Missions 41-320: Pro/Enterprise only
- Premium modules (4-16): Pro/Enterprise only

---

## 💳 Payment Processing

### Stripe Integration

#### Checkout Flows
1. **Subscription Checkout**: Monthly/annual recurring billing
2. **One-Time Payment**: For marketplace items, credits
3. **Billing Portal**: Self-service subscription management

#### Webhook Events Handled
- `checkout.session.completed` - Purchase confirmation
- `invoice.paid` - Recurring payment success
- `invoice.payment_failed` - Payment failure notification
- `customer.subscription.updated` - Plan changes
- `customer.subscription.deleted` - Cancellations

#### Idempotency
All webhook handlers are idempotent to prevent duplicate processing.

---

## 🛠️ API Endpoints

### Subscriptions
```
GET    /api/subscriptions          # Get current subscription & plans
POST   /api/subscriptions          # Create checkout, cancel, billing portal
```

### Certifications
```
GET    /api/certifications         # Get certifications & progress
POST   /api/certifications         # Claim certification
GET    /api/certifications/download?hash=xxx  # Download PDF
```

### Marketplace
```
GET    /api/marketplace            # List items (with filters)
POST   /api/marketplace            # Create/update/submit items
PUT    /api/marketplace            # Purchase item
```

### Enterprise
```
GET    /api/enterprise             # Get org data, team, analytics
POST   /api/enterprise             # Create org, invite members, configure SSO
```

### Webhooks
```
POST   /api/webhooks/stripe        # Stripe event handling
```

---

## 🔧 Configuration

### Stripe Dashboard Setup

1. **Products & Prices**
   - Create 4 products (Free, Pro Monthly, Pro Annual, Enterprise)
   - Add prices to each product
   - Copy price IDs to environment variables

2. **Webhook Configuration**
   - Endpoint: `/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `invoice.paid`
     - `invoice.payment_failed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`

3. **Tax Settings**
   - Configure tax behavior in Stripe Dashboard
   - Enable automatic tax calculation if needed

### Testing

Use Stripe test mode:
- Test card numbers: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)
- Use test mode API keys starting with `sk_test_` and `pk_test_`

---

## 📊 Analytics & Reporting

### User Analytics
- Mission completion rates
- Time spent per mission
- Hint usage patterns
- Skill progression over time

### Revenue Analytics
- MRR/ARR tracking
- Churn rates
- Revenue by tier
- Marketplace GMV

### Team Analytics (Enterprise)
- Team completion velocity
- Skill gap analysis
- Learning path adoption
- Individual performance comparisons

---

## 🚀 Deployment

### Vercel
1. Connect repository to Vercel
2. Add environment variables
3. Deploy

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables for Production
- Use Vercel Environment Variables or Docker secrets
- Enable Stripe live mode
- Configure production database (PostgreSQL recommended)

---

## 📈 Future Enhancements

### Planned Features
- [ ] Stripe Connect for marketplace payouts
- [ ] In-app credit purchasing
- [ ] Gift subscriptions
- [ ] Team challenges/competitions
- [ ] White-label options for partners
- [ ] API rate limiting & usage billing
- [ ] A/B testing for pricing
- [ ] Cohort analysis
- [ ] Churn prediction

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 🤝 Support

For questions or issues:
- GitHub Issues: https://github.com/jitenkr2030/Skillytics-AIML/issues
- Documentation: See `/docs` folder

---

Built with ❤️ by the Skillytics Team
