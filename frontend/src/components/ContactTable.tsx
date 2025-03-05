import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ContentCopy } from '@mui/icons-material';
import { Contact } from '../types/Contacts';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts, onEdit, onDelete, onCopyId }) => {
  const [search, setSearch] = useState({
    id: ''
  });

  const handleSearchChange = (field: keyof typeof search, value: string) => {
    setSearch(prev => ({ ...prev, [field]: value }));
  };

  const filteredContacts = contacts ? contacts.filter(contact =>
    contact.id ? contact.id.includes(search.id) : true
  ) : [];

  return (
    <TableContainer component={Paper}>
      <Box display="flex" gap={2} p={2}>
        <TextField label="Search ID" value={search.id} onChange={e => handleSearchChange('id', e.target.value)} /> 
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Age</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredContacts.map(contact => (
            <TableRow key={contact.id}>
              <TableCell>{contact.firstName}</TableCell>
              <TableCell>{contact.lastName}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phoneNumber}</TableCell>
              <TableCell>{contact.age}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(contact)}  data-testid='table_edit_btn'>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => contact.id && onDelete(contact.id)} data-testid='table_delete_btn'>
                  <DeleteIcon />
                </IconButton>
                <IconButton color="default" onClick={() => onCopyId(contact.id!)} aria-label="copy id" data-testid='table_copy_btn'>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactTable;