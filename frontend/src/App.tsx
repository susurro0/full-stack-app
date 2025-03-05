import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ContactTable from './components/ContactTable';
import ContactDialog from './components/ContactDialog';
import { Contact } from './types/Contacts';
import { createContact, deleteContact, fetchContacts, updateContact } from './services/api';
import logger from './utils/logger';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      logger.error('Error loading contacts: ' + error);
      setSnackbar({ open: true, message: 'Failed to load contacts', severity: 'error' });
    }
  };

  const handleOpenForm = (contact?: Contact) => {
    setCurrentContact(contact || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentContact(null);
  };

  const handleSaveContact = async (contact: Contact) => {
    try {
      if (currentContact?.id) {
        await updateContact(currentContact.id, contact);
        setSnackbar({ open: true, message: 'Contact updated successfully', severity: 'success' });
      } else {
        await createContact(contact);
        setSnackbar({ open: true, message: 'Contact created successfully', severity: 'success' });
      }
      handleCloseForm();
      loadContacts();
    } catch (error) {
      logger.error('Error saving contact: ' + error);
      setSnackbar({ open: true, message: 'Failed to save contact', severity: 'error' });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact(id);
      loadContacts();
      setSnackbar({ open: true, message: 'Contact deleted successfully', severity: 'success' });
    } catch (error) {
      logger.error('Error deleting contact: ' + error);
      setSnackbar({ open: true, message: 'Failed to delete contact', severity: 'error' });
    }
  };
  
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setSnackbar({
      open: true,
      message: 'ID copied to clipboard: ' + id ,
      severity: 'success'
    });
  };
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Contact Management
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
            Add Contact
          </Button>
        </Box>

        <ContactTable contacts={contacts} onEdit={handleOpenForm} onDelete={handleDeleteContact} onCopyId={handleCopyId}/>

        <ContactDialog open={openForm} onClose={handleCloseForm} onSave={handleSaveContact} contact={currentContact} />

        <Snackbar data-testid="snackbar_id" open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert data-testid='alert_id' onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;
