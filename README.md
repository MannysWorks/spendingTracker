# Spending Tracker
Track my spending and net worth. I used to do this on a Google spreadsheet lol, so I built an app for it.

Link: [spendingtracker.mannys.works](https://spendingtracker.mannys.works)

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite (build tool and dev server)
- React Router for navigation
- React Hook Form for form management
- Material-UI (MUI) components
- Bootstrap & React Bootstrap
- Framer Motion for animations
- Lucide React & FontAwesome icons
- DayJS for date handling

**Backend**
- Spring Boot 3.0+
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL database
- Maven build system
- JJWT (JSON Web Token library)
- Lombok for boilerplate reduction
- JavaMail (email sending)

## Deployment

This app is deployed and live at **[spendingtracker.mannys.works](https://spendingtracker.mannys.works)**.

- **Frontend:** Hosted on [Vercel](https://vercel.com), deployed from the `spending-tracker-frontend` directory
- **Backend:** Containerized with Docker, hosted on [Render](https://render.com), available at `api.mannys.works` secured, but the code is all here anyways
- **Database:** MySQL hosted on [Aiven](https://aiven.io)
- **Domain:** `mannys.works`, registered and DNS-managed through Cloudflare

> Note: the backend runs on Render's free tier, which spins down after ~15 minutes of inactivity. The first request after idle time may take 30-50 seconds while the container restarts.

## Project Structure

```
.
├── SpendingTrackerBackend/         # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tracker/SpendingTracker/
│   │   │   │   ├── auth/          # JWT authentication logic
│   │   │   │   ├── controllers/   # REST API endpoints
│   │   │   │   │   ├── ResetPasswordController.java    # Password reset endpoints
│   │   │   │   │   └── ...        # Other controllers
│   │   │   │   ├── entities/      # JPA entity models
│   │   │   │   ├── models/        # Data models
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── spendingTracker.java
│   │   │   │   │   └── PasswordReset.java    # Password reset model
│   │   │   │   ├── repositories/  # Data access layer
│   │   │   │   │   ├── UserRepo.java
│   │   │   │   │   ├── SpendingTrackerRepo.java
│   │   │   │   │   └── PasswordResetRepo.java    # Password reset repository
│   │   │   │   ├── services/      # Business logic
│   │   │   │   │   ├── SpendingTrackerServices.java
│   │   │   │   │   └── EmailSenderService.java    # Email sending service
│   │   │   │   └── config/        # Spring security config
│   │   │   └── resources/
│   │   │       └── application.properties    # Database, JWT, & Mail config
│   │   └── test/                  # Unit tests
│   ├── pom.xml                    # Maven dependencies
│   └── mvnw / mvnw.cmd           # Maven wrapper
│
├── spending-tracker-frontend/      # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/                 # Route pages
│   │   │   ├── HomePage.tsx       # Dashboard with Wallet component
│   │   │   ├── EntriesPage.tsx    # Spending entries tracking
│   │   │   └── ...                # Other pages
│   │   ├── components/            # Reusable React components
│   │   │   ├── Navbar.tsx         # Navigation with improved accessibility
│   │   │   ├── Wallet.tsx         # Main wallet/hero section (formerly HeroBanner)
│   │   │   ├── Sidebar.tsx        # Mobile-responsive sidebar
│   │   │   └── ...                # Other components
│   │   ├── Services/              # API client functions
│   │   ├── interfaces/            # TypeScript interfaces
│   │   ├── types/                 # TypeScript types
│   │   ├── css/                   # Stylesheets
│   │   ├── assets/                # Images and static files
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # React entry point
│   ├── package.json               # Dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tsconfig.json              # TypeScript config
│   └── index.html                 # HTML template
│
└── README.md                       # This file
```

## Installation

### Prerequisites
- Node.js (v18+) and npm
- Java 17+
- MySQL 8.0+
- Maven 3.6+ (or use the included mvnw wrapper)

### Backend Setup

1. Navigate to the backend directory
```bash
cd SpendingTrackerBackend
```

2. Create environment configuration

Copy the example file and fill in your values:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edit `src/main/resources/application.properties`:
```properties
spring.application.name=SpendingTracker
spring.datasource.url=jdbc:mysql://localhost:3306/spending_tracker
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

security.jwt.secret-key=your_super_secret_jwt_key_here
security.jwt.expiration-time=3600000

# Email Configuration (for password reset & notifications)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_specific_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

**Environment Variables (Alternative):**
You can also set these as environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/spending_tracker
export SPRING_DATASOURCE_USERNAME=your_db_user
export SPRING_DATASOURCE_PASSWORD=your_db_password
export JWT_SECRET_KEY=your_super_secret_jwt_key_here
export SPRING_MAIL_USERNAME=your_email@gmail.com
export SPRING_MAIL_PASSWORD=your_app_specific_password
```

3. Create the MySQL database
```bash
mysql -u root -p -e "CREATE DATABASE spending_tracker;"
```

4. Build and run the backend
```bash
# Using Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run

# Or with Maven installed
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd spending-tracker-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

4. Build for production
```bash
npm run build
npm run preview
```

## Development Workflow

**Terminal 1 - Backend:**
```bash
cd SpendingTrackerBackend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd spending-tracker-frontend
npm run dev
```

Then open your browser to `http://localhost:5173`

## Key Features

- User authentication with JWT tokens
- Secure password handling with Spring Security
- Password reset functionality with email verification
- 6-digit reset code with 15-minute expiration
- Email notifications for account recovery
- Modern, responsive React UI with Framer Motion animations
- Improved navigation with refined Navbar component
- Enhanced wallet/dashboard view with better UX
- Mobile-responsive sidebar navigation
- Real-time expense tracking and net worth calculations
- MySQL database persistence with JPA/Hibernate ORM

## Recent Updates (August 2026)

- UI Redesign: Complete refactor of the navigation and hero banner components for improved user experience
- Component Refactoring: Renamed HeroBanner to Wallet for clarity; improved Navbar with better accessibility
- Enhanced Animations: Updated card animations and layout adjustments with Framer Motion
- Mobile Responsiveness: Improved mobile UI with responsive Sidebar component
- New EntriesPage: Dedicated page for tracking spending entries with modal form functionality

## API Endpoints

### Password Reset
- `POST /api/v1/spendingTracker/send-reset-code` - Send password reset code to email
- `POST /api/v1/spendingTracker/reset` - Reset password with code and new password

## License

This is a personal project, but if you want to suggest any improvements feel free to create a pull request! 
If you want to use this as a base for your spending tracker feel free! :)

## For future me 
Kinda don't know how to feel, but I'd like to log it regardless this is your first real app lol, built imperfectly by you but that's what makes it fulfilling and yours, good job twin! - 6/26/2026
