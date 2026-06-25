# 📁 AssetVault – Digital Asset Management System

## Overview

AssetVault is a full-stack Digital Asset Management System developed to securely organize, upload, manage, and categorize digital assets such as documents, images, videos, and other files. The application provides a clean and responsive interface while demonstrating CRUD operations, REST APIs, and database integration.

---

## Features

- 📂 Upload and organize digital assets
- 🗂 Categorize assets (Documents, Images, Videos, Others)
- 🔍 Search assets by name
- 🗑 Delete assets
- 📊 Dashboard displaying storage information
- 💾 MySQL database integration
- 🌐 RESTful API using Spring Boot
- 🎨 Modern responsive React interface

---

## Tech Stack

### Frontend

- React.js
- Vite
- CSS
- JavaScript

### Backend

- Spring Boot
- Spring Data JPA
- REST API

### Database

- MySQL

### Tools Used

- VS Code
- Git & GitHub
- Railway (Deployment)

---

## Project Structure

```text
Asset_Vault/
│
├── src/                  # React Frontend
├── public/
├── assetvault-backend/   # Spring Boot Backend
├── README.md
└── Implementation/
```

## Installation

### Clone Repository

```bash
git clone https://github.com/VaishnaviA-18/Asset_Vault.git
```

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd assetvault-backend
mvn spring-boot:run
```

---

## Database Configuration

Update the database configuration inside:

```text
assetvault-backend/src/main/resources/application.properties
```

Configure:

- Database URL
- Username
- Password

---

## Future Enhancements

- User authentication with JWT
- Cloud storage integration
- File sharing
- Role-based access
- File preview support
- Activity logs

---

## License

This project is developed for educational and learning purposes.
