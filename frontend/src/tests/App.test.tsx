import React from 'react';

import { render, screen, fireEvent, waitFor , act, cleanup} from "@testing-library/react";
import App from "../App";   
import * as api from "../services/api";  
import user from '@testing-library/user-event'

// Mock the API functions
jest.mock("../services/api");

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    Object.defineProperty(global, "navigator", {
      value: {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined), // Mocking the writeText method
        },
      },
    });
  });
  afterEach(()=> {
    cleanup();
  });

  it("should render the App component", async () => {
    const mockContacts = [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
      { id: "2", firstName: "Jane", lastName: "Doe", email: "jane@example.com", phoneNumber: "123-456-7891", age: 28 },
    ];

    // Mock the fetchContacts API call
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);

    render(<App />);

    // Check if the contact table is rendered with the correct contacts
    await screen.findByText("Contact Management");

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();   
    });
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("should open the form when the 'Add Contact' button is clicked", async () => {
    render(<App />);

    // Click the 'Add Contact' button
    const addButton = screen.getByRole("button", { name: /add contact/i });
    
    fireEvent.click(addButton);

    // Check if the contact dialog is opened
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  
  });

  it("should call createContact and show success Snackbar when a new contact is added", async () => {
    const mockContact = {
      
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      age: 30,
    };
  
    const mockContacts = [
      { id: "1", ...mockContact },
    ];
    const mockAddedContacts = [
      { id: "1", ...mockContact },
      { id: "2", firstName: "Mike", lastName: "Johnson", email: "mjohnson@abort.com", phoneNumber: "123-456-7892", age: 25 },
    ];
  
    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (api.createContact as jest.Mock).mockResolvedValue({ id: "1", ...mockContact });
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockAddedContacts);

    render(<App />);
    await waitFor(() => {
      expect(api.fetchContacts).toHaveBeenCalled();
    });
    // Open the form
    const addButton = screen.getByRole("button", { name: /add contact/i });
    fireEvent.click(addButton);
  
    // Simulate filling out the form
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "Mike" } });
  
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: "Johnson" } });
  
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "mjohnson@abort.com" } });
  
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: "1234567892"} });
  
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: 25 } });
  
    // Submit the form
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
  
    // Ensure the createContact is called
    await waitFor(() => {
      expect(api.createContact).toHaveBeenCalled();
    });
    
    expect(screen.getByText("Mike")).toBeInTheDocument()

    expect(screen.getByText("Contact created successfully")).toBeInTheDocument()
  
  });

  it("should call createContact and show error Snackbar when a add new contact is failed", async () => {
    const mockContact = {
      
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      age: 30,
    };
  
    const mockContacts = [
      { id: "1", ...mockContact },
    ];
    // const mockAddedContacts = [
    //   { id: "1", ...mockContact },
    //   { id: "2", firstName: "Mike", lastName: "Johnson", email: "mjohnson@abort.com", phoneNumber: "123-456-7892", age: 25 },
    // ];
  
    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (api.createContact as jest.Mock).mockRejectedValueOnce(new Error('Interal Server error'));
    // (api.fetchContacts as jest.Mock).mockResolvedValue(mockContact);

    render(<App />);
    
    // Open the form
    const addButton = screen.getByRole("button", { name: /add contact/i });
    fireEvent.click(addButton);
  
    // Simulate filling out the form
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "Mike" } });
  
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: "Johnson" } });
  
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "mjohnson@abort.com" } });
  
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: "1234567892"} });
  
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: 25 } });
  
    // Submit the form
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
  
    // Ensure the createContact is called
    await waitFor(() => {
      expect(api.createContact).toHaveBeenCalled();
    });
    expect(api.fetchContacts).toHaveBeenCalledTimes(1);
    
    expect(screen.getByText("Failed to save contact")).toBeInTheDocument()
  
  });
  
  it("should call updateContact and show success Snackbar when a contact is updated", async () => {
    const mockContacts = [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
    ];
    const mockUpdatedContacts = [
      { id: "1", firstName: "Jane", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
    ];

    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (api.updateContact as jest.Mock).mockResolvedValue(null);

    render(<App />);
    await screen.findByText("John");

    const editButton = screen.getAllByTestId("table_edit_btn")[0];
    fireEvent.click(editButton);
    // Simulate filling out the form
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
  
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
  
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: "1234567890"} });
  
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: 30 } });
  
    // save changes 
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockUpdatedContacts);

    await waitFor(() => {
      expect(api.updateContact).toHaveBeenCalled();
    });
    expect(api.fetchContacts).toHaveBeenCalled();

    // Check if the success snackbar appears
    await screen.findByText("Contact updated successfully");
    await screen.findByText("Jane");
    expect(screen.queryByText("John")).not.toBeInTheDocument();
    
    // Simulate clicking the close button inside the Snackbar
    const closeButton = screen.getByTitle(/close/i); 
    fireEvent.click(closeButton);
    await waitFor(() => {
      // Ensure the snackbar is no longer in the document after closing
      expect(screen.queryByText("Contact updated successfully")).not.toBeInTheDocument();
    });

  });

  it("should call deleteContact and show success Snackbar when a contact is deleted", async () => {
    const mockContacts = [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
    ];

    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (api.deleteContact as jest.Mock).mockResolvedValue(null);

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();   
    });
    // Check if the snackbar not visible yet
    expect(screen.queryByTestId('snackbar_id')).not.toBeInTheDocument();
    // Trigger the delete action
    const deleteButton = screen.getAllByTestId("table_delete_btn")[0];
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(api.deleteContact).toHaveBeenCalled();
    });
    // Check if the success snackbar appears
    await screen.findByText("Contact deleted successfully");
    await waitFor(
    () => {
      expect(screen.queryByText("Contact created successfully")).not.toBeInTheDocument();
    },
    { timeout: 4100 } // Wait for up to 6000ms for the Snackbar to disappear
  );
  });

  it("should call deleteContact and show error within Snackbar when a contact is deleted failed", async () => {
    const mockContacts = [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
    ];

    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (api.deleteContact as jest.Mock).mockRejectedValueOnce(new Error('error'));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();   
    });
    // Trigger the delete action
    const deleteButton = screen.getAllByTestId("table_delete_btn")[0];
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(api.deleteContact).toHaveBeenCalled();
    });
    // Check if the success snackbar appears
    await screen.findByText("Failed to delete contact");
    
  });

  it("should show error Snackbar if fetching contacts fails", async () => {
    // Mock the fetchContacts API to reject with an error
    (api.fetchContacts as jest.Mock).mockRejectedValue(new Error("Failed to load contacts"));

    render(<App />);

    // Wait for the snackbar to show the error message
    await screen.findByText("Failed to load contacts");
  
  });

  it("should show ID copied to clipboard in Snackbar copy click", async () => {
    // Mock the fetchContacts API to reject with an error
    const mockContacts = [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", phoneNumber: "123-456-7890", age: 30 },
    ];

    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();   
    });

    const copyButton= screen.getByTestId("table_copy_btn");
    fireEvent.click(copyButton);
    await waitFor(() => {
      // Wait for the snackbar to show the ID copied message
      expect(screen.getByText("ID copied to clipboard: 1")).toBeInTheDocument();
    });
  });

  it("should show error Snackbar if creating a contact fails", async () => {
    const mockContact = {
      
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      age: 30,
    };
  
    const mockContacts = [
      { id: "1", ...mockContact },
    ];
  
    // Mock the API calls
    (api.fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (api.createContact as jest.Mock).mockRejectedValueOnce(new Error("error"));

    render(<App />);
    await waitFor(() => {
      expect(api.fetchContacts).toHaveBeenCalled();
    });
    // Open the form
    const addButton = screen.getByRole("button", { name: /add contact/i });
    fireEvent.click(addButton);
  
    // Simulate filling out the form
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "Mike" } });
  
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: "Johnson" } });
  
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "mjohnson@abort.com" } });
  
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: "1234567892"} });
  
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: 25 } });
  
    // Submit the form
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
  
    // Ensure the createContact is called
    await waitFor(() => {
      expect(api.createContact).toHaveBeenCalled();
    });
    
    expect(screen.getByText("Failed to save contact")).toBeInTheDocument()
  
  });
  
});
