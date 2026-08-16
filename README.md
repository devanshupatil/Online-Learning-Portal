# Online Learning Portal

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

A comprehensive full-stack online learning platform built with React frontend and Node.js backend. Supports role-based access for admins, teachers, learners, and parents. Features include course management, interactive materials, testing, progress tracking, attendance reports, communication tools, and multi-language support. Integrates multiple LLMs (OpenAI GPT-4o, Claude, Gemini, Perplexity) for document processing and question extraction. Deployable via Docker and Terraform.

## 🚀 Features

- **Role-Based Access Control**: Separate dashboards for admins, teachers, learners, and parents
- **Course Management**: Create, manage, and enroll in courses with foundation programs
- **Interactive Materials**: Support for PDFs, images, and multimedia content with MaterialViewer
- **Testing & Assessment**: Automated test creation, grading, and image-based question extraction via LLMs
- **Progress Tracking**: Detailed analytics, streak tracking, and progress reports
- **Attendance Management**: Track and report student attendance with reports
- **Results & Achievers**: Year-wise, class-wise, subject toppers, and growth charts
- **Communication Tools**: Built-in messaging, support helpdesk, and contact forms
- **Multi-Language Support**: English, Hindi, Marathi with i18n (react-i18next)
- **LLM Integration**: AI-powered document processing for question extraction
- **Responsive Design**: Mobile-friendly interface with slide-out drawer navigation
- **Docker Deployment**: Containerized with bun for fast installs

## 🤖 AI/LLM Integration

The platform integrates multiple Large Language Models (OpenAI GPT-4o, Anthropic Claude, Google Gemini, and Perplexity) to revolutionize document processing and educational content creation:

### What They Do
- **Document Processing**: Analyze uploaded images and PDFs to extract questions, options, and answers
- **Structured Data Conversion**: Transform visual content into clean JSON format for seamless integration
- **Multi-Format Support**: Handle scanned papers, digital PDFs, handwritten text, and various image qualities
- **Intelligent Inference**: Automatically infer correct answers when not explicitly marked

### Benefits
- **For Teachers**: Save hours by instantly digitizing physical test papers instead of manual entry
- **For Institutions**: Accelerate digital transformation and reduce administrative costs
- **For Learners**: Access consistently formatted, high-quality assessments with faster feedback
- **Technical Advantages**: Multi-model fallback system ensures reliability and optimal performance

This AI-powered feature transforms traditional educational workflows, making the platform not just a learning management system, but an intelligent educational assistant.

## 🌐 Multi-Language Support (i18n)

- **Languages**: English (en), Hindi (hi), Marathi (mr)
- **Implementation**: react-i18next with namespaced translations
- **Language Switcher**: Persistent UI component in header and mobile drawer
- **Dynamic Loading**: Translations loaded on-demand per locale

## 🎓 Educational Benefits

### For Students
- **Personalized Learning**: Access courses tailored to individual learning pace and style
- **Interactive Content**: Engage with multimedia materials and interactive assessments
- **Progress Tracking**: Monitor learning journey with detailed analytics, streaks, and feedback
- **Flexible Access**: Learn anytime, anywhere with responsive mobile-friendly interface
- **Instant Feedback**: Receive immediate results and explanations for assessments

### For Classes & Institutions
- **Efficient Administration**: Streamlined management of courses, students, and assessments
- **Data-Driven Insights**: Comprehensive analytics for educational decision-making
- **Scalable Solutions**: Support for large student populations with consistent quality
- **Cost-Effective**: Reduce paper usage and administrative overhead
- **Enhanced Collaboration**: Built-in communication tools for teachers, students, and parents

## 📚 Learning Outcomes

This project demonstrates expertise in:
- **Full-Stack Development**: Building complete web applications with modern frameworks
- **AI Integration**: Implementing multiple LLM APIs for practical educational applications
- **Database Design**: PostgreSQL schema design for educational data management
- **DevOps Practices**: Docker containerization and cloud deployment with Terraform
- **UI/UX Design**: Creating responsive, user-friendly interfaces for diverse user roles
- **Security Best Practices**: JWT authentication and secure API design
- **Agile Development**: Modular architecture supporting role-based features
- **Internationalization**: Multi-language support with react-i18next

## 🛠 Tech Stack & Why We Use Them

### Frontend (React + Vite + Tailwind CSS v4)
- **React 19**: Component-based architecture with concurrent features
- **Vite 7**: Fast development server and optimized production builds
- **Tailwind CSS v4**: Utility-first styling with CSS-first configuration (`@theme`)
- **react-router-dom v7**: File-based routing with data loading
- **react-i18next**: Internationalization framework
- **lucide-react**: Consistent icon system
- **sonner**: Accessible toast notifications
- **react-hook-form**: Performant form handling
- **react-pdf**: PDF rendering and viewing
- **shadcn/ui pattern**: Accessible, composable component library (Button, etc.)

### Backend (Node.js + Express + bun)
- **bun**: Fast JavaScript runtime and package manager
- **Express.js**: Lightweight, flexible web framework for robust APIs
- **PostgreSQL / Supabase**: Reliable relational database
- **JWT Authentication**: Secure token-based auth

### AI/ML Integration
- **Multiple LLMs**: Redundancy and choice of best model for specific tasks
- **Vision Capabilities**: Process visual educational content (images/PDFs)
- **JSON Structured Output**: Consistent data format for seamless integration

### DevOps (Docker + Terraform)
- **Docker**: Consistent deployment across development and production
- **Terraform**: Infrastructure as code for reproducible cloud setups
- **Google Cloud Platform**: Target deployment environment

## 🛠 Tech Stack Summary

### Frontend
- React 19
- Vite 7
- Tailwind CSS v4
- react-router-dom v7
- react-i18next
- lucide-react
- sonner
- react-hook-form
- react-pdf / pdfjs-dist
- shadcn/ui component pattern

### Backend
- Node.js (bun runtime)
- Express.js
- PostgreSQL / Supabase
- JWT Authentication

### AI/ML
- OpenAI GPT-4o
- Anthropic Claude
- Google Gemini
- Perplexity AI

### DevOps
- Docker & Docker Compose
- Terraform
- Google Cloud Platform

## 📦 Installation

### Prerequisites
- Node.js 18+ (or **bun** recommended)
- Docker & Docker Compose
- PostgreSQL

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/online-learning-portal.git
   cd online-learning-portal
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   bun install           # or npm install
   cp .env.example .env  # Configure your environment variables
   bun run dev           # or npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   bun install           # or npm install
   bun run dev           # or npm run dev
   ```

4. **Database Setup**
   ```bash
   # Using Docker
   docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -d -p 5432:5432 postgres

   # Or use the provided docker-compose.yml
   docker-compose up -d
   ```

### Production Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose -f cloud-docker-compose.yml up -d
   ```

2. **Using Terraform**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Backend directory:

```env
# Database Configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Backend Config
PORT=3000
JWT_SECRET=your_jwt_secret
NODE_ENV=production

# LLM API Keys (optional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
PERPLEXITY_API_KEY=your_perplexity_key

# Frontend (if needed)
VITE_API_URL=http://localhost:3000/api
```

### Frontend Environment
Create `.env` in Frontend if needed:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📖 Usage

1. **Admin** (`/admin/*`): Manage users, courses, system settings, and view analytics
2. **Teacher** (`/teachers/*`): Upload materials, create tests (including LLM extraction), track attendance, view student directory
3. **Learner** (`/learners/*`): Access courses, take tests, view progress/streaks, interactive resources, grades
4. **Parent** (`/parents/*`): Monitor child's progress, attendance, and communicate with teachers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@onlinelearningportal.com or join our Discord community.

---

*Built with ❤️ for modern education*