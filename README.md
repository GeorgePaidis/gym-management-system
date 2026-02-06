# Gym Management System

Τελική εργασία — Coding Factory ΟΠΑ.

Η εφαρμογή απευθύνεται σε γυμναστήριο και επιτρέπει σε μέλη να εγγραφούν, να συνδέονται και να βλέπουν το εβδομαδιαίο πρόγραμμα μαθημάτων. Ο διαχειριστής μπορεί να διαχειρίζεται τη λίστα μελών (προσθήκη, επεξεργασία, διαγραφή) και να επεξεργάζεται το πρόγραμμα (προσθήκη ή αφαίρεση μαθημάτων ανά ημέρα και ώρα). Κάθε μέλος μπορεί να δει και να ενημερώσει το δικό του προφίλ. Η πρόσβαση στις λειτουργίες ελέγχεται ανά ρόλο (διαχειριστής ή μέλος).

---

## Quick start

---

**Backend**

1. Μπες στο φάκελο και εγκατέστησε τις εξαρτήσεις:

```bash
cd gym_backend
npm install          # Εγκατάσταση dependencies
npm run dev          # Development server με auto-reload
# Ο server θα τρέξει στο: http://localhost:3000

3. Εκκίνηση Frontend (Angular)
bash
cd gym-frontend
npm install          # Εγκατάσταση dependencies
ng serve             # Development server
# Η εφαρμογή θα ανοίξει στο: http://localhost:4200


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