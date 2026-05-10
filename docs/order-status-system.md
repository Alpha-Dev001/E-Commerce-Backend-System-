# Order Status System Documentation

## Overview
This document describes the comprehensive Order Status System implemented for the e-commerce application. The system provides robust order lifecycle management with proper status transitions, validation, and business logic.

## Order Status Flow

### Status Types
- **PENDING**: Initial status when order is created
- **CONFIRMED**: Order confirmed and being prepared
- **PROCESSING**: Order is being processed/shipped
- **SHIPPED**: Order has been shipped to customer
- **DELIVERED**: Order has been delivered to customer
- **CANCELLED**: Order was cancelled (stock restored)
- **REFUNDED**: Order was refunded after delivery

### Valid Status Transitions
```
PENDING → CONFIRMED, CANCELLED
CONFIRMED → PROCESSING, CANCELLED
PROCESSING → SHIPPED, CANCELLED
SHIPPED → DELIVERED, REFUNDED
DELIVERED → REFUNDED
CANCELLED → (no transitions)
REFUNDED → (no transitions)
```

## API Endpoints

### Order Management
- `POST /order/checkout` - Create new order from cart
- `GET /order/my-orders` - Get current user's orders
- `GET /order/:id` - Get specific order details
- `GET /order` - Get all orders (admin)
- `GET /order/status/:status` - Get orders by status

### Status Management
- `PUT /order/:id/status` - Update order status
  ```json
  {
    "status": "CONFIRMED"
  }
  ```
- `PUT /order/:id/cancel` - Cancel order (restores stock)

## Database Schema

### Order Model
```prisma
model Order {
  id         Int         @id @default(autoincrement())
  userId     Int
  total      Float
  status     OrderStatus @default(PENDING)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  shippedAt  DateTime?
  deliveredAt DateTime?
  
  user  User        @relation(fields: [userId], references: [id])
  items OrderItem[]
}
```

### OrderStatus Enum
```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

## Business Logic

### Order Cancellation
- Orders can only be cancelled in PENDING or CONFIRMED status
- Stock is automatically restored when order is cancelled
- Transaction ensures data consistency

### Status Validation
- All status transitions are validated against allowed transitions
- Timestamps are automatically set for SHIPPED and DELIVERED statuses
- Comprehensive error handling with meaningful messages

### Stock Management
- Stock is decremented when order is created
- Stock is restored when order is cancelled
- All stock operations are transactional

## Usage Examples

### Update Order Status
```bash
curl -X PUT http://localhost:3000/order/1/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

### Cancel Order
```bash
curl -X PUT http://localhost:3000/order/1/cancel \
  -H "Authorization: Bearer <token>"
```

### Get User Orders
```bash
curl -X GET http://localhost:3000/order/my-orders \
  -H "Authorization: Bearer <token>"
```

## Error Handling

The system provides comprehensive error handling:
- **NotFoundException**: Order not found
- **BadRequestException**: Invalid status transition or cancellation attempt
- **Validation Errors**: Invalid request data

## Security

- All endpoints require JWT authentication
- Users can only access their own orders (except admin endpoints)
- Status transitions are validated to prevent unauthorized changes

## Testing

To test the system:
1. Ensure database is running and migrated
2. Create test users and products
3. Add items to cart
4. Checkout to create orders
5. Test status transitions and cancellations

## Future Enhancements

Potential improvements:
- Email notifications for status changes
- Order tracking integration
- Bulk status updates
- Advanced filtering and search
- Order analytics and reporting
