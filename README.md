# EZRoute API [In Development]

A high-performance, enterprise-grade URL shortening and link management platform built with NestJS. EZRoute provides users with powerful tools to create, manage, and track shortened links across workspaces with comprehensive analytics and CRM integration.

## Overview

EZRoute is a SaaS platform that enables users to:
- Create and manage shortened URLs with custom UTM parameters
- Organize links across multiple workspaces
- Invite team members and manage permissions
- Scale to 100M+ URL generations per day with sub-millisecond latency

## Key Features

### Authentication & User Management
- Multi-method authentication (email/password, user handle)
- Self-service sign-up with email verification
- Password recovery via secure email links
- Profile management (email, handle, credentials)
- Account deletion with data cleanup

### Workspace Management
- Multi-workspace support with workspace-level ownership
- Team member invitations via links or email
- Role-based workspace access control
- Workspace-specific link and member quotas

### Subscription Plans
Support for flexible tier-based plans:

| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|--------|--------|--------|--------|
| Workspaces | 1 | 3 | 6 | 12 |
| Members/Workspace | 3 | 5 | 10 | 20 |
| Links/Workspace | 15 | 30 | 60 | 120 |

### Link Management
- Create shortened URLs with alphanumeric characters (a-z, A-Z, 0-9)
- UTM parameter configuration at creation time
- Plan-based rate limiting and quotas
- Long-term retention (10-year minimum storage)

### Analytics & CRM
- Event tracking via Amplitude with Ampli CLI standardization
- Real-time dashboard metrics (click tracking, user engagement)
- Braze integration for personalized messaging
- User property sync across analytics platforms

## Tech Stack

### Core Framework
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Express.js** - HTTP server

### Data Layer
- **PostgreSQL** - Relational data (users, workspaces, accounts)
- **Apache Cassandra** - Time-series data (link analytics, events)
- **Redis** - Caching and rate limiting

### External Integrations
- **Amplitude + Ampli CLI** - Event tracking and analytics
- **Braze SDK** - CRM and messaging
- **Resend** - Email delivery
- **Custom Analytics Service** - Multi-platform event ingestion

## Project Structure

```
src/
├── config/              # Configuration management
├── domain/              # Domain models and interfaces
│   ├── repositories/    # Repository contracts
│   └── types/          # Core domain types
├── infrastructure/      # External services & adapters
│   ├── cache/          # Redis integration
│   ├── database/       # PostgreSQL & Cassandra
│   └── external/       # Third-party services (Amplitude, Braze, etc.)
└── modules/            # Feature modules
    ├── auth/           # Authentication & authorization
    ├── user/           # User management
    ├── workspace/      # Workspace operations
    ├── link/           # Link creation & management
    └── redirect/       # URL redirection & tracking
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Apache Cassandra 4.0+
- Redis 7+

## Getting Started

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=3001
NODE_ENV=development

# Database - PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/ezroute

# Database - Cassandra
CASSANDRA_CONTACT_POINTS=localhost
CASSANDRA_PORT=9042
CASSANDRA_KEYSPACE=ezroute

# Cache
REDIS_URL = redis://localhost:6379

# External Services
AMPLITUDE_API_KEY=your_amplitude_key
AMPLITUDE_API_SECRET=your_amplitude_secret
BRAZE_API_KEY=your_braze_key
BRAZE_API_ENDPOINT=your_braze_endpoint
RESEND_API_KEY=your_resend_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600
```

### Database Setup

```bash
# Run PostgreSQL migrations
npm run migrate:up

# Initialize Cassandra keyspace
npm run cassandra:init
```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Watch mode
npm run start:watch
```

The API will be available at `http://localhost:3001`

## API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json
- **ReDoc**: http://localhost:3001/api/redoc

### Core Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Sign in user
- `POST /auth/password-recovery` - Request password reset
- `POST /auth/password-reset` - Reset password with token

#### Users
- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update user profile
- `POST /users/upgrade-plan` - Upgrade subscription
- `POST /users/downgrade-plan` - Downgrade subscription

#### Workspaces
- `POST /workspaces` - Create new workspace
- `GET /workspaces` - List user workspaces
- `POST /workspaces/:id/members/invite` - Invite team member
- `GET /workspaces/:id/members` - List workspace members

#### Links
- `POST /links` - Create shortened link
- `GET /links` - List workspace links
- `GET /links/:shortCode` - Retrieve link details
- `PATCH /links/:id` - Update link
- `DELETE /links/:id` - Delete link

#### Analytics
- `GET /analytics/links/:id` - Get link click statistics
- `GET /analytics/workspace/:id` - Get workspace analytics

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## Analytics Integration

### Amplitude Events

Events are defined and managed through Amplitude using Ampli CLI. Core events tracked:

**Authentication**
- `user_signed_up` - User registration
- `user_signed_in` - User login

**Workspace**
- `workspace_created` - New workspace created
- `workspace_invited_user` - Member invitation sent

**Plans**
- `plan_upgraded` - Subscription upgraded
- `plan_downgraded` - Subscription downgraded

**Links**
- `link_created` - Shortened link created
- `link_clicked` - Link clicked (tracked redirect)

For adding new events:
```bash
ampli pull
# Edit events in Amplitude
ampli push
```

### Braze Integration

Users are automatically synced to Braze with:
- **External ID**: Unique user identifier
- **User Attributes**: plan_tier, workspace_count, created_at
- **Custom Events**: Aligned with Amplitude event taxonomy

## Performance & Scalability

### Design Targets
- **URL Generation**: 100M+ per day capacity
- **Redirect Latency**: < 10ms p99
- **Read/Write Ratio**: 10:1 (optimized for reads)
- **Concurrent Users**: 100k+

### Optimization Strategies
- Redis caching layer for hot links
- Cassandra partitioning for time-series data
- PostgreSQL connection pooling
- Async event processing
- CDN ready (link redirects)

## Error Handling

The API uses standard HTTP status codes with detailed error responses:

```json
{
  "statusCode": 400,
  "message": "Email already registered",
  "error": "BadRequestException"
}
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Test coverage minimum: 80%
- Pre-commit hooks validate code quality

## License

This project is proprietary.

## Support & Contact

For issues, feature requests, or technical questions:
- Create an issue in the repository
- Contact the development team at contact@marcoslandi.com 

## Thank You
<img src="https://media.tenor.com/zoAy0wwDAs4AAAAi/ok-okey.gif">
