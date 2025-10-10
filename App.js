import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      alert('Failed to fetch contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, phone, email } = formData;
    if (!name || !phone || !email) {
      alert('All fields are required');
      return;
    }
    try {
      if (editId) {
        await axios.put(`/contacts/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post('/contacts', formData);
      }
      setFormData({ name: '', phone: '', email: '' });
      fetchContacts();
    } catch (err) {
      alert('Failed to save contact');
      console.error(err);
    }
  };

  const handleEdit = (contact) => {
    setFormData({ name: contact.name, phone: contact.phone, email: contact.email });
    setEditId(contact._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert('Failed to delete contact');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Contact Manager</h1>

      <div className="form-container">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</button>
      </div>

      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td>
                  <button onClick={() => handleEdit(contact)}>Edit</button>
                  <button onClick={() => handleDelete(contact._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
