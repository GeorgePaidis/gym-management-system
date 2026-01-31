🏋️‍♂️ Gym Management System
Τελική Εργασία - Coding Factory ΟΠΑ

📋 Σχετικά με την Εφαρμογή
Το Gym Management System είναι μια πλήρης web εφαρμογή για τη διαχείριση γυμναστηρίου. Περιλαμβάνει:

Σύστημα αυθεντικοποίησης με δύο τύπους χρηστών (Administrator / Member)

Πλήρη διαχείριση μελών (μόνο για admin)

Δυναμικό πρόγραμμα μαθημάτων (διαχείριση από admin, προβολή από μέλη)

Responsive διεπαφή με Bootstrap

REST API με τεκμηρίωση Swagger

🚀 Εκκίνηση & Deployment

1. Clone το Repository
bash
git clone https://github.com/GeorgePaidis/gym-management-system.git
cd gym-management-system

2. Εκκίνηση Backend (Node.js API)
bash
cd gym_backend
npm install          # Εγκατάσταση dependencies
npm run dev          # Development server με auto-reload
 
 Ο server θα τρέξει στο: http://localhost:3000

3. Εκκίνηση Frontend (Angular)
bash
cd gym-frontend
npm install          # Εγκατάσταση dependencies
ng serve             # Development server

 Η εφαρμογή θα ανοίξει στο: http://localhost:4200


👥 Διαπιστευτήρια Χρηστών

Administrator ( Πλήρης Πρόσβαση)

Email: admin@gym.com
Κωδικός: admin123


Member ( Περιορισμένη Πρόσβαση)

Email: tester@gym.com
Κωδικός: tester123

🛠️ Τεχνολογίες

Backend

Runtime: Node.js

Framework: Express.js

Γλώσσα: TypeScript

Βάση Δεδομένων: MongoDB + Mongoose

Ασφάλεια: JWT, bcrypt

Validation: Zod

API Documentation: Swagger UI

Frontend

Framework: Angular 20

Γλώσσα: TypeScript

UI: Bootstrap 5 + Bootstrap Icons

Routing: Angular Router με Guards
