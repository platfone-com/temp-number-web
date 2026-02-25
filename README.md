# Temp Number Web

A modern Vue.js web application that provides a user-friendly interface for managing temporary phone numbers for SMS verification. It offers seamless authentication, real-time number activation and payment processing.

## Features

- 🔐 Authentication with Firebase (Email, Telegram, OAuth)
- 📱 Real-time temporary phone number management
- 💳 Payment processing (Stripe integration)
- 🌍 Internationalization (i18n) support
- 📊 Transaction history and active numbers tracking
- 🔔 Real-time status updates
- 📱 Responsive design for mobile and desktop
- ⚡ Fast and optimized with Vite

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia
- **Routing**: Vue Router
- **Form Validation**: Vee-Validate + Yup
- **Authentication**: Firebase Auth
- **Payment**: Stripe.js
- **Internationalization**: Vue I18n
- **HTTP Client**: Axios

## Prerequisites

- Node.js >= 22.x
- npm or yarn

## Getting Started

### 🚀 Recommended: Automated Deployment

The easiest way to get started is using our **[temp-number-deploy](https://github.com/platfone-com/temp-number-deploy)** repository, which provides automated deployment scripts for the complete stack (MySQL, Backend, Web UI):

- **Production**: Google Cloud deployment with automated setup
- **Local Development**: Docker Compose environment with one command

👉 **[Go to temp-number-deploy →](https://github.com/platfone-com/temp-number-deploy)**


▶ [Watch the guide on YouTube](https://youtu.be/SXoU-PhTg5U)
<p align="center">
  <a href="https://youtu.be/SXoU-PhTg5U">
    <img src="https://img.youtube.com/vi/SXoU-PhTg5U/hqdefault.jpg" alt="Temp-Number iOS guide video" />
  </a>
</p>

### Manual Installation

For manual setup or custom configurations:

```bash
# Clone the repository
git clone https://github.com/platfone-com/temp-number-web.git
cd temp-number-web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with required credentials
```

### Environment Variables

Key environment variables to configure:

```env
# Firebase Configuration
VITE_FIREBASE_WEB_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_TEMP_NUMBER_BACKEND_API_BASE_PATH=https://api.yourdomain.com
VITE_TEMP_NUMBER_FRONTEND_BASE_APP_URL=https://yourdomain.com/app

# Payments Configuration
VITE_TEMP_NUMBER_WEB_ENABLED_PAYMENT_GATEWAYS=['your_payment_gateway']

# Other params
VITE_TELEGRAM_BOT_ID=your_bot_id
VITE_RECAPTCHA_ENTERPRISE_ENABLED=1
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=google_recaptcha_key
VITE_CDN_BASE_URL=your_cdn_url
VITE_ALIPAY_QQ_WECHAT_STORE_URL=your_store_url
VITE_CRISP_WEBSITE_ID=your_crisp_website_id
VITE_CSP_ENABLED=0
```

### Running the Application

```bash
# Development mode (standard app)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will start at `http://localhost:3300`

## Project Structure

```
├── src/
│   ├── assets/              # Static assets (images, CSS)
│   ├── components/          # Vue components
│   │   ├── Activation/      # Number activation components
│   │   ├── Auth/            # Authentication components
│   │   ├── Funds/           # Payment and funds management
│   │   ├── Help/            # Help and support components
│   │   ├── Layout/          # Layout components
│   │   ├── Modals/          # Modal dialogs
│   │   ├── Numbers/         # Phone number management
│   │   ├── Order/           # Order processing
│   │   └── Shared/          # Shared/reusable components
│   ├── composables/         # Vue composables (reusable logic)
│   │   ├── api/             # API composables
│   │   └── wl/              # White-label composables
│   ├── directives/          # Custom Vue directives
│   ├── layouts/             # Page layouts
│   ├── router/              # Vue Router configuration
│   ├── services/            # External services (Firebase, i18n)
│   ├── stores/              # Pinia stores (state management)
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── views/               # Page components
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── config.ts            # App configuration
├── public/                  # Public static files
├── docs/                    # Documentation
├── Dockerfile               # Docker configuration
├── nginx.conf               # Nginx configuration for deployment
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Features

### Authentication

Multiple authentication methods supported:
- Email/Password registration and login
- Telegram authentication
- Password reset and email change functionality

### Phone Number Management

- Browse available phone numbers by country and service
- Real-time activation status updates
- SMS message retrieval
- Favorites and recent numbers
- Order history tracking

### Payment Integration

- Stripe payment processing
- Multiple payment methods support
- Transaction history
- Funds management

## Development

### Code Style

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Run linting
npm run lint

# Format code
npm run format
```

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check
```

### Git Hooks

The project uses Husky and lint-staged for pre-commit hooks to ensure code quality.

## Deployment

### Docker Deployment

This application is containerized for easy deployment:

```bash
# Build Docker image
docker build -t temp-number-web .

# Run container
docker run -p 80:80 temp-number-web
```

### Production Build

The production build is optimized and served with Nginx:

```bash
# Build for production
npm run build

# The dist/ folder contains the production-ready files
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License with API Restriction Clause - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@platfone.com
- 🐛 Issues: [GitHub Issues](https://github.com/platfone-com/temp-number-nodejs-web/issues)
- 📚 Documentation: [platfone.com/docs](https://platfone.com/docs)

## Acknowledgments

Built with ❤️ by the Platfone team
```
