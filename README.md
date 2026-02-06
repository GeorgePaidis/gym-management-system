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
npm install
```

2. Δημιούργησε αρχείο **.env** μέσα στο **gym_backend** με:

```
JWT_SECRET=ο-μυστικο-κλειδι-σου
MONGODB_URI=mongodb://localhost:27017/gymdb
```

3. Ξεκίνα τον server:

```bash
npm run dev
```

Η εφαρμογή τρέχει στο **http://localhost:3000**. Η τεκμηρίωση API στο **http://localhost:3000/api/docs**.

**Frontend** (σε νέο terminal)

1. Μπες στο φάκελο, εγκατέστησε και ξεκίνα:

```bash
cd gym-frontend
npm install
ng serve
```

Η εφαρμογή ανοίγει στο **http://localhost:4200**.

Χρειάζεσαι MongoDB τρέχον τοπικά ή σωστό **MONGODB_URI** στο **.env**.

---

## Demo λογαριασμοί

---

**Admin:** admin@gym.com / admin123

**Member:** tester@gym.com / tester123

---

## Τεχνολογίες και αρχιτεκτονική

---

**Backend**

- Node.js με Express και TypeScript. Βάση δεδομένων MongoDB με Mongoose. Ασφάλεια: JWT για σύνδεση, bcrypt για κωδικούς. Επικύρωση εισόδου με Zod. Τεκμηρίωση API με Swagger.
- Δομή: **routes** → **middlewares** (auth, admin, validation) → **controllers** → **services** → **repositories** → **models**

**Frontend**

- Angular 20, TypeScript, Bootstrap 5
- Guards (auth, admin), HTTP interceptor για JWT και 401, zoneless με **ChangeDetectorRef**

---

Άδεια: ISC.
