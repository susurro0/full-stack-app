import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';
import { Contact } from '../types/Contacts';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contact?: Contact | null;
}

const ContactSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name is required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^(\d{10})$/, 'Phone number must be 10 digits')
    .matches(/^(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}$/, 'Phone number format is invalid')
    .required('Phone number is required'),
  age: Yup.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120').required('Age is required'),
});

const ContactDialog: React.FC<ContactDialogProps> = ({ open, onClose, onSave, contact }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{contact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
      <Formik
        initialValues={contact || { id: '', firstName: '', lastName: '', email: '', phoneNumber: '', age: 18 }}
        validationSchema={ContactSchema}
        onSubmit={(values) => {
          let formattedPhoneNumber = values.phoneNumber;

          // Remove non-numeric characters
          formattedPhoneNumber = formattedPhoneNumber.replace(/\D/g, '');

          // Format the phone number as 123-456-7890
          if (formattedPhoneNumber.length === 10) {
            formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
          }

          onSave({ ...values, phoneNumber: formattedPhoneNumber });
        }}
      >
        {({ errors, touched, handleChange, values, handleSubmit }) => (
          <Form>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    data-testid='dialog_first_name'
                    required
                    label="First Name"
                    name="firstName"
                    fullWidth
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <TextField
                    data-testid='dialog_last_name'
                    required
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Stack>
                <TextField
                  required
                  data-testid='dialog_email'
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  required
                  data-testid='dialog_phone'
                  label="Phone Number (123-456-7890)"
                  name="phoneNumber"
                  fullWidth
                  value={values.phoneNumber}
                  onChange={handleChange}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
                <TextField
                  label="Age"
                  data-testid='dialog_age'
                  name="age"
                  type="number"
                  fullWidth
                  value={values.age}
                  onChange={handleChange}
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary" variant="outlined" data-testid='dialog_cancel'>
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained" data-testid='dialog_submit'>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ContactDialog;
