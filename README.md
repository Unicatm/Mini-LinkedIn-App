# Mini LinkedIn Platform

A recruitment web application designed to connect **Recruiters** with **Candidates**. This platform allows users to manage professional profiles, post job opportunities, and showcase their work experience.

## 🔐 Key Features
* **Secure Login & Registration:** JWT authentication
* **Role-Based Access Control:** Distinct interfaces and permissions for **Recruiters** and **Candidates**

### 👤 Profile Management
* **Dynamic Profiles:** Users can manage bio, company details or professional experience
* **Media & Files:** Upload **Avatar** and **Cover** images stored via Firebase Storage.
* **Resume/CV Upload (PDF)** support for candidates.

### 📢 Job Board
* **Job Posting:** Recruiters can publish job listings with details like Salary, Type (Remote/Hybrid/On-Site), and Description.
* **Validation:** Robust form handling to ensure data integrity before submission made with PrimeVue Forms library & Zod. 

## 🛠️ Tech Stack
### Frontend
* **Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
* **UI Library:** [PrimeVue](https://primevue.org/) & PrimeIcons
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Routing:** Vue Router
* **Styling:** PrimeFlex

### Backend & Services
* **Database:** Firebase Firestore
* **File Storage:** Firebase Storage
* **Backend Logic:** Node.js / Express
