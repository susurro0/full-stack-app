import express, { Request, Response } from "express";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Define Contact interface
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
}

// GET all contacts
router.get("/", (req: Request, res: Response) => {
  db.all("SELECT * FROM contacts", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Retrieve a specific contact by id
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(row);
  });
});

// POST - Create a new contact
router.post("/", (req: Request, res: Response): void => {
  const { firstName, lastName, email, phoneNumber, age } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phoneNumber || age === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const id = uuidv4();
  const ageNumber = parseInt(age.toString(), 10);

  if (isNaN(ageNumber) || ageNumber < 0) {
    res.status(400).json({ error: "Age must be a valid non-negative number" });
    return;
  }

  const stmt = db.prepare(
    "INSERT INTO contacts (id, firstName, lastName, email, phoneNumber, age) VALUES (?, ?, ?, ?, ?, ?)"
  );

  stmt.run(id, firstName, lastName, email, phoneNumber, ageNumber, function (err: Error | null) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    stmt.finalize(); // Finalize after running

    db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(row);
    });
  });
});


// PUT - Update a contact
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, age }: Contact = req.body;

  db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const stmt = db.prepare(
      "UPDATE contacts SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, age = ? WHERE id = ?"
    );
    stmt.run(firstName, lastName, email, phoneNumber, age, id, function (this: { changes: number }, err: Error | null) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      stmt.finalize(); 

      db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    });
  });
});

// DELETE - Delete a contact
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const stmt = db.prepare("DELETE FROM contacts WHERE id = ?");
    
    stmt.run(id, function (this: { changes: number }, err: Error | null) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      stmt.finalize();
      res.sendStatus(204);
    });
  });
});

export default router;
