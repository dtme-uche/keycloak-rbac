# 🔐 Keycloak RBAC Demo with Node.js + Express

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![Keycloak](https://img.shields.io/badge/Keycloak-26.0.5-blue?logo=keycloak)](https://www.keycloak.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This project demonstrates how to integrate **Keycloak** with a **Node.js Express** application and enforce **Role-Based Access Control (RBAC)**.  
Users authenticate via Keycloak, and only those with the correct realm roles (`user`, `manager`, `admin`) can access protected routes.  

---

## ✨ Features
- 🔑 Authentication via Keycloak (OIDC)
- 👤 Role-based access control
- 🎨 Aesthetic UI with dashboards
- 📦 Secure session management
- 🚪 Logout handled via Keycloak

---

## ⚙️ Prerequisites

Before starting, make sure you have:

### **Java JDK 17**
```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```
### **Node.js + npm**
```bash
sudo apt install nodejs npm -y
```
### **Keycloak 26.0.5**
```bash
wget https://github.com/keycloak/keycloak/releases/download/26.0.5/keycloak-26.0.5.tar.gz
tar -xvzf keycloak-26.0.5.tar.gz
sudo mv keycloak-26.0.5 /opt/keycloak
```
### 🚀 Running Keycloak
Navigate into the bin folder:
```bash
cd /opt/keycloak/bin
```
### **Create an admin user and start Keycloak in dev mode:**
```bash
KEYCLOAK_ADMIN=admin KEYCLOAK_ADMIN_PASSWORD=admin ./kc.sh start-dev
```
Access Keycloak at 👉 http://localhost:8080

### **Login with:
Username: admin
Password: admin

## 🔧 Keycloak Configuration
### 1. Create a Realm
Name: Platview-realm

### 2. Create a Client
Client ID: my-node-client

Client Type: OpenID Connect

Valid Redirect URIs: http://localhost:3000/*

Web Origins: http://localhost:3000

Save

### 3. Make Client Confidential
Go to Clients → my-node-client → Settings

Enable Client Authentication

Save → Copy the Client Secret

### 4. Create Realm Roles
Roles: user, manager, admin

### 5. Create Users
Example users:

user1 → role user

manager1 → role manager

admin1 → role admin

## 📂 Project Setup
### **1️⃣ Create Project**
```bash
mkdir keycloak-rbac-demo && cd keycloak-rbac-demo
npm init -y
npm install express keycloak-connect express-session session-file-store
```
### **2️⃣ Create the App File**
Create app.js:
```bash
vi app.js
Paste the full content of your application code.
```

### **▶️ Run the App**
Start the app:
```bash
node app.js
```
Visit 👉 http://localhost:3000

## Test logins:
👤 Login as User → see User Dashboard

👔 Login as Manager → see Manager Dashboard

⚡ Login as Admin → see Admin Dashboard

🚪 Click Logout to end the session.

## 📖 References
[Keycloak Documentation](https://www.keycloak.org/documentation)
[keycloak-connect (NPM)](https://www.npmjs.com/package/keycloak-connect)

✨ Author
### Francis Uche ([@dtme-uche](https://github.com/dtme-uche))
🚀 Building secure and scalable Node.js applications with Keycloak
