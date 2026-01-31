import { Request, Response, NextFunction } from "express";

// Έλεγχος δικαιώματος ενημέρωσης προφίλ χρήστη
export const canUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const targetUserId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Ο διαχειριστής (ADMIN) μπορεί να επεξεργαστεί οποιονδήποτε χρήστη
    if (userRole === 'ADMIN') {
      return next();
    }

    // Ο κανονικός χρήστης μπορεί να επεξεργαστεί μόνο το δικό του προφίλ
    if (userId !== targetUserId) {
      return res.status(403).json({ message: "Can only update your own profile" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error in authorization" });
  }
};