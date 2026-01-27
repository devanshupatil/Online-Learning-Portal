# Online Learning Portal

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

A comprehensive full-stack online learning platform built with React frontend and Node.js backend. Supports role-based access for admins, teachers, learners, and parents. Features include course management, interactive materials, testing, progress tracking, attendance reports, and communication tools. Integrates multiple LLMs (OpenAI GPT-4o, Claude, Gemini, Perplexity) for document processing and question extraction. Deployable via Docker and Terraform.

## 🚀 Features

- **Role-Based Access Control**: Separate dashboards for admins, teachers, learners, and parents
- **Course Management**: Create, manage, and enroll in courses
- **Interactive Materials**: Support for PDFs, images, and multimedia content
- **Testing & Assessment**: Automated test creation and grading
- **Progress Tracking**: Detailed analytics and progress reports
- **Attendance Management**: Track and report student attendance
- **Communication Tools**: Built-in messaging and support system
- **LLM Integration**: AI-powered document processing for question extraction
- **Responsive Design**: Mobile-friendly interface
- **Docker Deployment**: Containerized for easy deployment

## 🛠 Tech Stack

### Frontend
- React 18+
- Vite
- CSS Modules
- Responsive Design

### Backend
- Node.js
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
- Node.js 18+
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
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
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
```

## 📖 Usage

1. **Admin**: Manage users, courses, and system settings
2. **Teacher**: Upload materials, create tests, track attendance
3. **Learner**: Access courses, take tests, view progress
4. **Parent**: Monitor child's progress and attendance

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
