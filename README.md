# Spending Tracker
Track my spending and net worth. I used to do this on a Google spreadsheet lol, so I built an app for it.

🔗 **Live app:** [spendingtracker.mannys.works](https://spendingtracker.mannys.works)

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite (build tool and dev server)
- React Router for navigation
- React Hook Form for form management
- Material-UI (MUI) components
- Bootstrap & React Bootstrap
- Framer Motion for animations
- FontAwesome icons
- DayJS for date handling

**Backend**
- Spring Boot 4.0.5
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL database
- Maven build system
- JJWT (JSON Web Token library)
- Lombok for boilerplate reduction

- ## Deployment

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
│   │   │   │   ├── entities/      # JPA entity models
│   │   │   │   ├── repositories/  # Data access layer
│   │   │   │   ├── services/      # Business logic
│   │   │   │   └── config/        # Spring security config
│   │   │   └── resources/
│   │   │       └── application.properties    # Database & JWT config
│   │   └── test/                  # Unit tests
│   ├── pom.xml                    # Maven dependencies
│   └── mvnw / mvnw.cmd           # Maven wrapper
│
├── spending-tracker-frontend/      # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/                 # Route pages
│   │   ├── components/            # Reusable React components
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
- Responsive React UI with modern component libraries
- Real-time expense tracking and net worth calculations
- MySQL database persistence with JPA/Hibernate ORM

## License

This is a personal project, but if you want to suggest any improvements feel free to create a pull request! 
If you want to use this as a base for your spending tracker feel free! :)

## For future me 
Kinda don't know how to feel, but I'd like to log it regardless this is your first real app lol, built imperfectly by you but that's what makes it fulfilling and yours, good job twin! - 6/26/2026
