import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactDialog from '../ContactDialog';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

jest.mock("axios");

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onSave: mockOnSave,
  contact: null,
};

describe('ContactDialog', () => {
  it('renders the dialog correctly', () => {
    render(<ContactDialog open={true} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByTestId('dialog_first_name')).toBeInTheDocument();
    expect(screen.getByTestId('dialog_last_name')).toBeInTheDocument();
    expect(screen.getByTestId('dialog_email')).toBeInTheDocument();
    expect(screen.getByTestId('dialog_phone')).toBeInTheDocument();
    expect(screen.getByTestId('dialog_age')).toBeInTheDocument();
    expect(screen.getByTestId('dialog_cancel')).toBeInTheDocument();
    expect(screen.getByTestId('dialog_submit')).toBeInTheDocument();
});

  it('displays validation errors for empty required fields', async () => {
    render(<ContactDialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId('dialog_submit'));
    
    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Phone number is required')).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(<ContactDialog {...defaultProps} open={true} />);
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number \(123-456-7890\)/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '30' } });
    
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
        expect(mockOnSave).toBeCalledTimes(1);
        
    });
    expect(mockOnSave).toHaveBeenCalledWith({
        id: "",
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        age: 30,
      });

  });

  it('closes the dialog when Cancel is clicked', async () => {
    render(<ContactDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
        expect(mockOnClose).toBeCalledTimes(1);
        
    });
  });
});
