import request from "supertest";
import db from "../db";
import app from "../server";

const testContact = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  age: 30,
};

describe("Contacts API - Happy Paths", () => {
    beforeAll(async (): Promise<void> => {
        await new Promise<void>((resolve, reject) => {
          db.run("DELETE FROM contacts", (err) => (err ? reject(err) : resolve()));
        });
      });
      
      afterAll(async (): Promise<void> => {
        await new Promise<void>((resolve, reject) => {
            db.close((err) => (err ? reject(err) : resolve()));
        });
    });
    it("should create a new contact", async () => {
        const response = await request(app).post("/contacts").send(testContact);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
        firstName: testContact.firstName,
        lastName: testContact.lastName,
        email: testContact.email,
        phoneNumber: testContact.phoneNumber,
        age: testContact.age,
        });
        expect(response.body.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
        testContact.id = response.body.id; // Update ID for subsequent tests
    });

    it("should get all contacts", async () => {
        const response = await request(app).get("/contacts");
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        const contact = response.body.find((c: { email: string }) => c.email === testContact.email);
        expect(contact).toBeDefined();
        expect(contact).toMatchObject(testContact);
    });

    it("should return a specific contact by ID", async () => {
        const response = await request(app).get(`/contacts/${testContact.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(testContact);
    });

    it("should update a contact", async () => {
        const updatedContact = { ...testContact, age: 35 };
        const response = await request(app).put(`/contacts/${testContact.id}`).send(updatedContact);
        expect(response.status).toBe(200);
        expect(response.body.age).toBe(35);
    });

    it("should delete a contact", async () => {
        const response = await request(app).delete(`/contacts/${testContact.id}`);
        expect(response.status).toBe(204);
    });
});

describe("Contacts API - Sad Paths", () => {
    let prepareMock: jest.SpyInstance;
    let getMock: jest.SpyInstance;
  
    beforeAll(() => {
        prepareMock = jest.spyOn(db, "prepare");
        getMock = jest.spyOn(db, "get");

      });
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("GET should return 500 if a database error occurs", async () => {
        getMock.mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"), null);
        });

        const res = await request(app).get("/contacts");

        expect(res.status).toBe(500);
    });

    it("GET by id should return 404 if contact does not exist", async () => {
        getMock.mockImplementation((sql, params, callback) => {
            callback(null, null); // Simulating no result found
        });

        const res = await request(app).get("/contacts/nonexistent-id");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Contact not found" });
    });

    it("GET by id should return 500 if a database error occurs", async () => {
        getMock.mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"), null);
        });

        const res = await request(app).get("/contacts/some-id");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Database error" });
    });

    it("POST should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/contacts").send({ firstName: "John" });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Missing required fields" });
    });

    it("POST should return 500 if a database error occurs during contact creation", async () => {
        prepareMock.mockImplementation(() => ({
            run: jest.fn((...args) => {
              const callback = args[args.length - 1];
              if (typeof callback === "function") callback(new Error("Database error"));
            }),
            finalize: jest.fn(),
            all: jest.fn(),
            get: jest.fn(),
            bind: jest.fn(),
            reset: jest.fn(),
          }));

        const res = await request(app).post("/contacts").send(testContact);
        expect(res.status).toBe(500);
  });
  it("POST should return 500 if a database error occurs after contact creation", async () => {
    prepareMock.mockImplementation(() => ({
        run: jest.fn((...args) => {
          const callback = args[args.length - 1];
          if (typeof callback === "function") callback(null);
        }),
        finalize: jest.fn(),
        all: jest.fn(),
        get: jest.fn(),
        bind: jest.fn(),
        reset: jest.fn(),
      }));
      getMock.mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"), null); // Simulating no result found
    });

    const res = await request(app).post("/contacts").send(testContact);
    expect(res.status).toBe(500);
});

  it("POST should return 400 if a age is a negativ number", async () => {
    testContact.age = -1;
    const res = await request(app).post("/contacts").send(testContact);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Age must be a valid non-negative number"});
});

it("UPDATE should return 404 if trying to update a contact that doesn't exist", async () => {
    getMock.mockImplementation((sql, params, callback) => {
        callback(null, null); // Simulating no result found
    });

    const res = await request(app).put("/contacts/nonexistent-id").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        age: 30,
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Contact not found" });
});

it("UPDATE should return 500 if trying to update a contact that internal server error on get", async () => {
    getMock.mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"), null);
    });

    const res = await request(app).put("/contacts/nonexistent-id").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        age: 30,
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Database error" });
});

it("UPDATE should return 500 if a database error occurs during contact creation", async () => {
    getMock.mockImplementation((sql, params, callback) => {
        callback(null, 1); 
    });
    prepareMock.mockImplementation(() => ({
        run: jest.fn((...args) => {
          const callback = args[args.length - 1];
          if (typeof callback === "function") callback(new Error("Database error"));
        }),
        finalize: jest.fn(),
        all: jest.fn(),
        get: jest.fn(),
        bind: jest.fn(),
        reset: jest.fn(),
      }));
    
    
    const res = await request(app).put(`/contacts/${testContact.id}`).send(testContact);
    expect(res.status).toBe(500);
  });
  it("UPDATE should return 500 if a database error occurs after contact creation", async () => {
    getMock.mockImplementationOnce((sql, params, callback) => {
      callback(null, { id: testContact.id }); // First get: Contact exists
    });
  
    prepareMock.mockImplementation(() => ({
      run: jest.fn((...args) => {
        const callback = args[args.length - 1];
        if (typeof callback === "function") callback(null);
      }),
      finalize: jest.fn(),
      all: jest.fn(),
      get: jest.fn(),
      bind: jest.fn(),
      reset: jest.fn(),
    }));
  
    getMock.mockImplementationOnce((sql, params, callback) => {
      callback(new Error("Database error"), null); // Second get: Simulate DB error
    });
  
    const res = await request(app).put(`/contacts/${testContact.id}`).send(testContact);
    expect(res.status).toBe(500);
  });

  it("DELETE should return 404 if trying to delete a contact that doesn't exist", async () => {
    getMock.mockImplementation((sql, params, callback) => {
        callback(null, null);
    });

    const res = await request(app).delete("/contacts/nonexistent-id");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Contact not found" });
  });

  it("should return 500 if a database error occurs during deletion get request", async () => {
    getMock.mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"), null);
    });

    const res = await request(app).delete("/contacts/some-id");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Database error" });
  });
  it("should return 500 if a database error occurs during deletion get request", async () => {
    getMock.mockImplementation((sql, params, callback) => {
        callback(null, 1); 
    });

    prepareMock.mockImplementation(() => ({
        run: jest.fn((...args) => {
          const callback = args[args.length - 1];
          if (typeof callback === "function") callback(new Error("Database error"));
        }),
        finalize: jest.fn(),
        all: jest.fn(),
        get: jest.fn(),
        bind: jest.fn(),
        reset: jest.fn(),
      }));
    const res = await request(app).delete("/contacts/some-id");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Database error" });
  });
});

