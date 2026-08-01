# Fire Bites

Fire Bites is a full-stack restaurant ordering and management application. Customers can browse the menu, manage a cart, place orders, make payments, reserve tables, and receive live updates. Staff members can manage dishes, orders, users, reservations, notifications, and business analytics through a protected dashboard.

## Features

### Customer experience

- Browse the Fire Bites menu and view dish details
- Create an account with email/password or Google authentication
- Sign in and maintain a protected customer profile
- Add dishes to a cart, update quantities, remove items, or clear the cart
- Start checkout through Paystack
- View personal orders and order status updates
- Make and manage table reservations
- Receive notifications and real-time order/reservation updates
- View payment success and failure states

### Staff dashboard

- Protected staff and administrator login
- Overview dashboard with business metrics
- Dish management, including image upload, editing, and deletion
- Order management and status updates
- Reservation management
- User and staff management
- Bulk staff-user import and downloadable import template
- Analytics for revenue, busy hours, and revenue over time
- Downloadable business reports
- Staff profile and password management
- Live dashboard updates through Socket.IO

## Technology stack

### Frontend

- React 19
- Vite
- React Router
- React Context for authentication, cart, dishes, orders, reservations, notifications, and theme state
- Socket.IO Client for real-time updates
- Chart.js and Recharts for dashboard visualizations
- Framer Motion for animations
- SweetAlert2 and React Icons for interface feedback and icons

### Backend

- Node.js and Express 5
- MongoDB with Mongoose
- JWT authentication with role-based staff authorization
- Socket.IO for real-time communication
- Paystack payment integration
- Google OAuth authentication
- Nodemailer for email notifications
- Twilio/WhatsApp Cloud API integration
- Sharp and Multer for image uploads and processing
- Helmet and CORS for basic HTTP security and cross-origin configuration
- PDFKit, XLSX, and CSV Parse for reports and bulk-user workflows

## Project structure

```text
fire bites/
├── backend/
│   ├── app.js                 # Express and Socket.IO server entry point
│   ├── controllers/           # Request handlers and business logic
│   ├── middlewares/           # Authentication and authorization middleware
│   ├── models/                # Mongoose data models
│   ├── routes/                # API route definitions
│   ├── services/              # Email and WhatsApp integrations
│   ├── sockets/               # Socket.IO setup
│   ├── uploads/               # Uploaded dish images and temporary files
│   └── utils/                 # Upload and image-processing utilities
└── frontend/
    ├── public/                # Static assets
    └── src/
        ├── components/        # Reusable UI components
        ├── context/           # React Context providers
        ├── hooks/             # Reusable application hooks
        ├── layouts/           # Public and dashboard layouts
        ├── pages/              # Customer, auth, food, and dashboard pages
        ├── sockets/            # Socket.IO client setup
        ├── styles/             # Feature-specific styles
        └── App.jsx             # Application routes
```

## Requirements

Install the following before running the project:

- Node.js 20 or newer
- npm
- A MongoDB database, either local or hosted
- A Google OAuth client if Google sign-in is enabled
- A Paystack account if online payments are enabled
- SMTP credentials if email notifications are enabled
- WhatsApp credentials if WhatsApp notifications are enabled

## Installation

Clone the repository and install dependencies separately for the frontend and backend:

```bash
git clone <repository-url>
cd "fire bites"

cd backend
npm install

cd ../frontend
npm install
```

## Environment variables

Create a `.env` file inside `backend/`:

```env
# Server and database
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/fire-bites
FRONTEND_URL=http://localhost:5173
APP_URL=http://localhost:4000

# Authentication
SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
DEFAULT_STAFF_PASSWORD=change-this-before-production

# Paystack
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_RECEIVER_EMAIL=payments@example.com

# SMTP email service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM="Fire Bites <no-reply@example.com>"

# WhatsApp Cloud API
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

`VITE_API_URL` must contain the backend origin without a trailing `/api`; the frontend appends paths such as `/api/dish` and `/api/user`. Never commit either `.env` file or expose backend secrets in frontend variables.

## Running locally

Start the backend in one terminal:

```bash
cd backend
node app.js
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the frontend terminal, normally [http://localhost:5173](http://localhost:5173). The backend normally listens on [http://localhost:4000](http://localhost:4000).

For a production frontend build:

```bash
cd frontend
npm run build
npm run preview
```

## Frontend routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Home page | Public |
| `/about` | About Fire Bites | Public |
| `/menu` | Browse dishes | Public |
| `/contact` | Contact and reservation form | Public |
| `/signup` | Customer registration | Public |
| `/login` | Customer login | Public |
| `/admin/login` | Staff login | Public |
| `/bag` | Cart and checkout | Authenticated customer |
| `/profile` | Customer profile | Authenticated customer |
| `/notifications` | Notifications | Signed-in user/staff |
| `/dashboard` | Dashboard overview | Staff |
| `/dashboard/dishes` | Dish management | Staff level 2+ |
| `/dashboard/orders` | Order management | Staff |
| `/dashboard/analytics` | Analytics and reports | Staff level 3+ |
| `/dashboard/users` | User and staff management | Staff level 4+ |
| `/dashboard/reservations` | Reservation management | Staff |

## API overview

The backend prefixes application routes with `/api`:

| Base path | Responsibility |
| --- | --- |
| `/api/user` | Customer/staff authentication, profiles, password changes, and bulk users |
| `/api/dish` | Public dish listing and protected dish management |
| `/api/cart` | Authenticated customer cart operations |
| `/api/order` | Order creation, personal orders, and staff order management |
| `/api/reserve` | Table reservations and staff reservation management |
| `/api/nots` | Notifications |
| `/api/dash` | Dashboard metrics, analytics, and reports |
| `/api/checkout` | Paystack checkout initialization |
| `/api/uploads` | Static access to uploaded dish images |
| `/payment/webhook` | Paystack webhook endpoint |
| `/payment/callback` | Paystack payment callback endpoint |

Authentication uses cookies/credentials for requests. Protected frontend requests should include credentials, and the backend CORS configuration must allow the URL in `FRONTEND_URL`.

## Authentication and staff levels

- Customer authentication is handled through the customer signup/login routes and JWT verification.
- Staff authentication uses the staff login route and staff authorization middleware.
- Dashboard permissions are enforced by `ProtectAdmin` on the frontend and `requireAdmin` on the backend.
- Higher staff levels include the permissions of lower levels. Dish management requires level 2+, analytics requires level 3+, and staff/user administration requires level 4+.

## Real-time updates

The application uses Socket.IO for live updates. The frontend connects to `VITE_API_URL`, while the backend accepts connections from `FRONTEND_URL`. Real-time events are used for areas such as:

- Order status changes
- Reservation creation and updates
- Notifications
- New staff users
- Dashboard and analytics refreshes

If real-time features do not work locally, verify that both URLs point to the correct origins and that the backend is running.

## Payments and webhooks

Paystack checkout is initialized by the backend. The payment callback redirects customers to the frontend after verification, while the webhook endpoint receives payment events.

When deploying Paystack:

1. Set `APP_URL` to the publicly reachable backend URL.
2. Configure the Paystack callback URL to point to `${APP_URL}/payment/callback`.
3. Configure the Paystack webhook URL to point to `${APP_URL}/payment/webhook`.
4. Set `FRONTEND_URL` to the deployed frontend URL.
5. Use production Paystack credentials only in the production environment.

## Deployment checklist

- Set a strong, unique `SECRET`.
- Replace the default staff password.
- Use a production MongoDB connection string.
- Configure `FRONTEND_URL` and `APP_URL` with HTTPS URLs.
- Configure Paystack callback and webhook URLs.
- Configure SMTP and WhatsApp services if those features are enabled.
- Confirm uploaded-file storage is persistent in the hosting environment.
- Restrict CORS to the deployed frontend origin.
- Keep `.env` files, API keys, JWT secrets, and payment secrets out of source control.
- Run the frontend lint and production build before deployment.

## Useful commands

### Frontend

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

### Backend

```bash
node app.js       # Start the Express and Socket.IO server
```

The backend currently does not define an npm `start` or test script, so it is started directly with `node app.js`.

## Troubleshooting

### The frontend cannot reach the API

- Confirm the backend is running.
- Check that `frontend/.env` contains the correct `VITE_API_URL`.
- Restart Vite after changing an environment variable.
- Confirm that backend `FRONTEND_URL` exactly matches the frontend origin.

### Authentication requests fail

- Confirm `SECRET` is set on the backend.
- Make sure frontend requests include credentials where required.
- Clear stale cookies and sign in again.
- Confirm the backend and frontend are using the same environment URLs.

### Images do not load

- Confirm the backend is running and `/api/uploads` is reachable.
- Check that the `backend/uploads/dishes` directory exists and is writable.
- Confirm `VITE_API_URL` does not include an extra path segment.

### Payments do not complete

- Verify the Paystack secret key and receiver email.
- Confirm `APP_URL` is publicly reachable for hosted callbacks/webhooks.
- Check Paystack dashboard webhook configuration and backend logs.

## License

This project currently does not declare a production license. Add a license before distributing or publishing the application.
