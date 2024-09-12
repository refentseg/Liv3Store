
# E-Commerce Store

This project is a modern E-Commerce platform built with Next.js, Prisma, Amazon RDS, and Amazon SES. It includes an Admin Page for managing inventory and uses Recharts for visualizing sales and inventory data.

## Features

- **User Authentication**: Secure login and registration using JWT authentication.
- **Product Management**: Admins can add, edit, and delete products from the inventory.
- **Order Processing**: Customers can browse products, add them to the cart, and proceed with checkout.
- **Email Notifications**: Order confirmations and other notifications sent via Amazon SES.
- **Data Visualization**: Sales and inventory trends visualized using Recharts.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Amazon RDS (PostgreSQL)
- **Email Service**: Amazon SES
- **Charts and Graphs**: Recharts

## Demo Videos

### Store 
[![E-Commerce Store Demo](![image](https://github.com/user-attachments/assets/bd774882-8733-44d8-ba6f-3073e203d5e6))](https://youtu.be/gV97dNs4D50)

### Admin Page

[![Admin Page](![image](https://github.com/user-attachments/assets/ee5693b1-eb43-413d-baa9-43397ca2aa6b))](https://youtu.be/FvMgiYEcRMI)

## Getting Started

### Prerequisites

- Node.js v16+
- PostgreSQL database instance (Amazon RDS recommended)
- Amazon SES account for email notifications
- AWS credentials for accessing RDS and SES

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/refentseg/Liv3Store.git
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   DATABASE_URL=postgresql://username:password@host:port/database
   GOOGLE_CLIENT_ID='your_client_id'
   GOOGLE_CLIENT_SECRET='your-secret'

   CLOUDINARY_CLOUD_NAME="your_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_secret_key"

   AUTH_SECRET=your_secret_key
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_SES_REGION=your_aws_region

   ```

4. Push the database schema to your PostgreSQL database:

   ```bash
   npx prisma db push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The application should be running at `http://localhost:3000`.

### Deployment

To deploy the application to a production environment:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

### Admin Page

The admin page is accessible at `/admin`. Here, you can manage the product inventory, add new products, and monitor sales trends via Recharts.

### Email Notifications

Amazon SES is used to send email notifications. Make sure you have a verified email address in SES, and set it up in your `.env` file.

## Database Management

Prisma is used as the ORM for database interactions. You can manage migrations and updates using the following commands:

- **Generate Prisma Client**:

  ```bash
  npx prisma generate
  ```

- **Run Migrations**:

  ```bash
  npx prisma migrate dev --name init
  ```

- **Push Schema**:

  ```bash
  npx prisma db push
  ```
