# E-commerce System

A modern, scalable e-commerce backend built with NestJS, TypeScript, and PostgreSQL. This project provides a robust foundation for building online stores with user authentication, product management, and secure API endpoints.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system with password hashing
- **Product Management**: Full CRUD operations for products with stock tracking
- **Database Integration**: PostgreSQL with Prisma ORM for type-safe database operations
- **RESTful API**: Well-structured REST API following best practices
- **TypeScript**: Full TypeScript support for type safety and better development experience
- **Testing**: Comprehensive unit and e2e testing setup
- **Code Quality**: ESLint and Prettier for consistent code formatting

## 🛠️ Tech Stack

- **Backend Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Jest
- **Code Linting**: ESLint
- **Code Formatting**: Prettier

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e-commerce-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
```

### 4. Database Setup

Ensure PostgreSQL is running and create a database:

```sql
CREATE DATABASE ecommerce;
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Database Migrations

```bash
npx prisma db push
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will start in watch mode with hot reloading on `http://localhost:3000`.

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

## 📊 Database Schema

The application uses the following main entities:

### Users
```typescript
interface User {
  id: number
  name: string
  email: string (unique)
  password: string (hashed)
  createdAt: DateTime
}
```

### Products
```typescript
interface Product {
  id: number
  name: string
  price: number
  description?: string
  stock: number
  createdAt: DateTime
}
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | User login and JWT token generation |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user information |
| DELETE | `/users/:id` | Delete user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/:id` | Update product information |
| DELETE | `/products/:id` | Delete product |

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## 📝 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.module.ts       # Auth module configuration
│   ├── auth.service.ts     # Auth business logic
│   └── jwt.strategy.ts     # JWT strategy implementation
├── products/               # Products module
│   ├── products.controller.ts
│   ├── products.module.ts
│   └── products.service.ts
├── users/                   # Users module
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── prisma/                  # Prisma database service
│   └── prisma.service.ts
├── app.controller.ts        # Main application controller
├── app.module.ts           # Main application module
├── app.service.ts          # Main application service
└── main.ts                 # Application entry point
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application in development mode |
| `npm run start:dev` | Start with hot reloading |
| `npm run start:debug` | Start in debug mode |
| `npm run build` | Build the application for production |
| `npm run lint` | Run ESLint and fix issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage report |

## 🛡️ Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation using DTOs
- **CORS**: Cross-Origin Resource Sharing configured
- **Environment Variables**: Sensitive data stored in environment variables

## 📈 Performance Considerations

- **Database Indexing**: Optimized database queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Caching**: Ready for Redis integration
- **Lazy Loading**: Modules loaded on demand

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-production-jwt-secret"
PORT=3000
NODE_ENV=production
```

### Docker Deployment (Optional)

You can containerize the application using Docker:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED license.

## 🆘 Support

For support and questions, please open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Product categories and tags
- [ ] Shopping cart functionality
- [ ] Order management system
- [ ] Payment integration (Stripe, PayPal)
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Email notifications
- [ ] Redis caching
- [ ] API rate limiting
- [ ] File upload for product images
- [ ] Search functionality
- [ ] Multi-language support

---

Built with ❤️ using [NestJS](https://nestjs.com/)
