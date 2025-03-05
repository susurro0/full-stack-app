import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Contact } from '../../types/Contacts';
import ContactTable from '../ContactTable';

describe('ContactTable Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCopyId = jest.fn();

  const contacts: Contact[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phoneNumber: '1234567890', age: 30 },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phoneNumber: '9876543210', age: 28 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the table with contacts', () => {
    render(<ContactTable contacts={contacts} onEdit={mockOnEdit} onDelete={mockOnDelete} onCopyId={mockOnCopyId} />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('filters contacts based on search input', () => {
    render(<ContactTable contacts={contacts} onEdit={mockOnEdit} onDelete={mockOnDelete} onCopyId={mockOnCopyId} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/search id/i);
    fireEvent.change(searchInput, { target: { value: '1' } });

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ContactTable contacts={contacts} onEdit={mockOnEdit} onDelete={mockOnDelete} onCopyId={mockOnCopyId} />);

    fireEvent.click(screen.getAllByTestId('table_edit_btn')[0]);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(contacts[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ContactTable contacts={contacts} onEdit={mockOnEdit} onDelete={mockOnDelete} onCopyId={mockOnCopyId} />);

    fireEvent.click(screen.getAllByTestId('table_delete_btn')[0]);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onCopyId when copy button is clicked', () => {
    render(<ContactTable contacts={contacts} onEdit={mockOnEdit} onDelete={mockOnDelete} onCopyId={mockOnCopyId} />);

    fireEvent.click(screen.getAllByRole('button', { name: /copy id/i })[0]);

    expect(mockOnCopyId).toHaveBeenCalledTimes(1);
    expect(mockOnCopyId).toHaveBeenCalledWith('1');
  });
});
