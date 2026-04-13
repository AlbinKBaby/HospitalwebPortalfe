import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import basicurl from './basicUrl';

function Admin() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    testCode: '',
    category: '',
    description: '',
    price: '',
    status: 'Available',
    createdBy: 'admin', // In a real app, this would come from authentication
    approvalStatus: 'Pending Approval'
  });

  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchMedicalTests();
  }, []);

  const fetchMedicalTests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${basicurl}/medical-tests`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical tests');
      }
      const data = await response.json();
      setTests(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching medical tests:', error);
      setError('Failed to load medical tests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addMedicalTest = async (testData) => {
    try {
      const response = await fetch(`${basicurl}/medical-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      if (!response.ok) {
        throw new Error('Failed to add medical test');
      }
      const result = await response.json();
      setTests(prev => [...prev, result.test]);
      return { success: true };
    } catch (error) {
      console.error('Error adding medical test:', error);
      return { success: false, error: error.message };
    }
  };

  const updateMedicalTest = async (id, testData) => {
    try {
      const response = await fetch(`${basicurl}/medical-tests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      if (!response.ok) {
        throw new Error('Failed to update medical test');
      }
      const result = await response.json();
      setTests(prev => prev.map(test => test._id === id ? result.test : test));
      return { success: true };
    } catch (error) {
      console.error('Error updating medical test:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteMedicalTest = async (id) => {
    try {
      const response = await fetch(`${basicurl}/medical-tests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete medical test');
      }
      setTests(prev => prev.filter(test => test._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting medical test:', error);
      return { success: false, error: error.message };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing test
      const result = await updateMedicalTest(editingId, formData);
      if (result.success) {
        setEditingId(null);
        alert('Medical test updated successfully!');
      } else {
        alert('Failed to update medical test: ' + result.error);
      }
    } else {
      // Add new test
      const result = await addMedicalTest(formData);
      if (result.success) {
        alert('Medical test submitted for approval!');
      } else {
        alert('Failed to add medical test: ' + result.error);
      }
    }

    // Reset form
    setFormData({
      name: '',
      testCode: '',
      category: '',
      description: '',
      price: '',
      status: 'Available',
      createdBy: 'admin',
      approvalStatus: 'Pending Approval'
    });
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      const result = await deleteMedicalTest(id);
      if (result.success) {
        alert('Medical test deleted successfully!');
      } else {
        alert('Failed to delete medical test: ' + result.error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      testCode: '',
      category: '',
      description: '',
      price: '',
      status: 'Available',
      createdBy: 'admin',
      approvalStatus: 'Pending Approval'
    });
  };

  const filteredTests = tests.filter(test => {
    if (filterStatus === 'All') return true;
    return test.approvalStatus === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#28a745';
      case 'Pending Approval': return '#ffc107';
      case 'Rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 0', borderBottom: '1px solid #dee2e6' }}>
        <h2>Admin Dashboard - Medical Test Management</h2>
        <Link to="/">
          <button style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Back to Home
          </button>
        </Link>
      </header>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Add/Edit Test Form */}
        <div style={{ flex: 1, maxWidth: '450px' }}>
          <h2>{editingId ? 'Edit Medical Test' : 'Add New Medical Test'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Test Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="testCode" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Test Code (Optional):</label>
              <input
                type="text"
                id="testCode"
                name="testCode"
                value={formData.testCode}
                onChange={handleInputChange}
                placeholder="e.g., BT001"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Category</option>
                <option value="Hematology">Hematology</option>
                <option value="Radiology">Radiology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pathology">Pathology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Immunology">Immunology</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="price" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price ($):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label htmlFor="status" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status/Availability:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="Available">Available</option>
                <option value="Limited Availability">Limited Availability</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            {editingId && (
              <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <p><strong>Created By:</strong> {formData.createdBy}</p>
                <p><strong>Approval Status:</strong>
                  <span style={{
                    color: getStatusColor(formData.approvalStatus),
                    fontWeight: 'bold',
                    marginLeft: '5px'
                  }}>
                    {formData.approvalStatus}
                  </span>
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                style={{ flex: 1, padding: '10px', backgroundColor: editingId ? '#ffc107' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
              >
                {editingId ? 'Update Test' : 'Submit for Approval'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tests List */}
        <div style={{ flex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Medical Tests ({filteredTests.length})</h2>
            <div>
              <label htmlFor="filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Status:</label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="All">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading medical tests...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                <p>{error}</p>
                <button
                  onClick={fetchMedicalTests}
                  style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            ) : (
              filteredTests.map(test => (
                <div key={test._id} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                        {test.name}
                        {test.testCode && <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>({test.testCode})</span>}
                      </h3>
                      <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>
                        <strong>Category:</strong> {test.category} |
                        <strong> Price:</strong> ${test.price} |
                        <strong> Status:</strong> {test.status}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8em',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: getStatusColor(test.approvalStatus),
                        marginBottom: '5px'
                      }}>
                        {test.approvalStatus}
                      </div>
                      <div style={{ fontSize: '0.8em', color: '#666' }}>
                        By: {test.createdBy}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: '10px 0', lineHeight: '1.4' }}>{test.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9em', color: '#666' }}>
                    <div>
                      <strong>Created:</strong> {test.createdDate ? new Date(test.createdDate).toLocaleDateString() : 'N/A'}
                      {test.approvedDate && (
                        <span> | <strong>Approved:</strong> {new Date(test.approvedDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEdit(test._id)}
                        style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test._id)}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8em' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredTests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No tests found with the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;