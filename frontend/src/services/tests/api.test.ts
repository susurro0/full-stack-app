import {
    fetchContacts,
    fetchContactById,
    createContact,
    updateContact,
    deleteContact,
  } from "../api";  // Adjust the import path if necessary
  import { Contact } from "../../types/Contacts";
  
  // Mocking the global fetch API
  global.fetch = jest.fn();
  
  describe("Contact Service API Functions", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("fetchContacts should fetch all contacts", async () => {
      const mockContacts = [
        { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
        { id: "2", firstName: "Jane", lastName: "Doe", email: "jane@example.com", phoneNumber: "123-456-7891", age: 28 },
      ];
  
      // Mocking the response of the fetch call
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockContacts,
      });
  
      const contacts = await fetchContacts();
  
      expect(fetch).toHaveBeenCalledWith("http://localhost:9001/contacts");
      expect(contacts).toEqual(mockContacts);
    });
  
    it("fetchContactById should fetch a contact by id", async () => {
      const mockContact = { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 };
  
      // Mocking the response of the fetch call
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockContact,
      });
  
      const contact = await fetchContactById("1");
  
      expect(fetch).toHaveBeenCalledWith("http://localhost:9001/contacts/1");
      expect(contact).toEqual(mockContact);
    });
  
    it("createContact should create a new contact", async () => {
      const newContact: Contact = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        age: 30,
      };
  
      const createdContact = { id: "1", ...newContact };
  
      // Mocking the response of the fetch call
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdContact,
      });
  
      const contact = await createContact(newContact);
  
      expect(fetch).toHaveBeenCalledWith("http://localhost:9001/contacts", expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newContact),
      }));
      expect(contact).toEqual(createdContact);
    });
  
    it("updateContact should update an existing contact", async () => {
      const updatedContact: Contact = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        age: 31,  // Updated age
      };
  
      // Mocking the response of the fetch call
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedContact,
      });
  
      const contact = await updateContact("1", updatedContact);
  
      expect(fetch).toHaveBeenCalledWith("http://localhost:9001/contacts/1", expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(updatedContact),
      }));
      expect(contact).toEqual(updatedContact);
    });
  
    it("deleteContact should delete an existing contact", async () => {
      // Mocking the response of the fetch call
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
  
      await deleteContact("1");
  
      expect(fetch).toHaveBeenCalledWith("http://localhost:9001/contacts/1", expect.objectContaining({
        method: "DELETE",
      }));
    });
  
    // Test for error handling: Fetch failure (mocked as failure response)
    it("fetchContacts should throw an error if the fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });
  
      await expect(fetchContacts()).rejects.toThrow("Failed to fetch contacts");
    });
  
    it("fetchContactById should throw an error if the fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });
  
      await expect(fetchContactById("1")).rejects.toThrow("Failed to fetch contact");
    });
  
    it("createContact should throw an error if the fetch fails", async () => {
      const newContact: Contact = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        age: 30,
      };
  
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });
  
      await expect(createContact(newContact)).rejects.toThrow("Failed to create contact");
    });
  
    it("updateContact should throw an error if the fetch fails", async () => {
      const updatedContact: Contact = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        age: 31,  // Updated age
      };
  
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });
  
      await expect(updateContact("1", updatedContact)).rejects.toThrow("Failed to update contact");
    });
  
    it("deleteContact should throw an error if the fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });
  
      await expect(deleteContact("1")).rejects.toThrow("Failed to delete contact");
    });
  });
  