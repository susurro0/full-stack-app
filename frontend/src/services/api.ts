import { Contact } from "../types/Contacts";

const API_URL = "http://localhost:9001/contacts";

export const fetchContacts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }
  const data = await response.json();
  return data;
};

export const fetchContactById = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contact');
  }
  const data = await response.json();
  return data;
};

export const createContact = async (contact: Contact) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  });
  if (!response.ok) {
    throw new Error('Failed to create contact');
  }
  const data = await response.json();
  return data;
};

export const updateContact = async (id: string, contact: Contact) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  });
  if (!response.ok) {
    throw new Error('Failed to update contact');
  }
  const data = await response.json();
  return data;
};

export const deleteContact = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete contact');
  }
};
