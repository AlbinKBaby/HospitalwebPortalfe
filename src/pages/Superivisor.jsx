import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import basicurl from './basicUrl';

function Supervisor() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTest, setSelectedTest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

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

  const approveMedicalTest = async (id) => {
    try {
      const response = await fetch(`${basicurl}/medical-tests/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedBy: 'supervisor' }),
      });
      if (!response.ok) {
        throw new Error('Failed to approve medical test');
      }
      const result = await response.json();
      setTests(prev => prev.map(test => test._id === id ? result.test : test));
      return { success: true };
    } catch (error) {
      console.error('Error approving medical test:', error);
      return { success: false, error: error.message };
    }
  };

  const rejectMedicalTest = async (id, reason) => {
    try {
      const response = await fetch(`${basicurl}/medical-tests/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: reason }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject medical test');
      }
      const result = await response.json();
      setTests(prev => prev.map(test => test._id === id ? result.test : test));
      return { success: true };
    } catch (error) {
      console.error('Error rejecting medical test:', error);
      return { success: false, error: error.message };
    }
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

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    return {
      backgroundColor: color,
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.8em',
      fontWeight: 'bold',
      display: 'inline-block'
    };
  };

  const handleApprove = async (testId) => {
    const result = await approveMedicalTest(testId);
    if (result.success) {
      alert('Test approved successfully!');
    } else {
      alert('Failed to approve test: ' + result.error);
    }
  };

  const handleReject = (testId) => {
    setSelectedTest(testId);
    setShowRejectionModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    const result = await rejectMedicalTest(selectedTest, rejectionReason);
    if (result.success) {
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedTest(null);
      alert('Test rejected with feedback.');
    } else {
      alert('Failed to reject test: ' + result.error);
    }
  };

  const closeModal = () => {
    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedTest(null);
  };

  const getStats = () => {
    const total = tests.length;
    const approved = tests.filter(t => t.approvalStatus === 'Approved').length;
    const pending = tests.filter(t => t.approvalStatus === 'Pending Approval').length;
    const rejected = tests.filter(t => t.approvalStatus === 'Rejected').length;

    return { total, approved, pending, rejected };
  };

  const stats = getStats();

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 0', borderBottom: '1px solid #dee2e6' }}>
        <h1>Supervisor - Test Approval Management</h1>
        <Link to="/">
          <button style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Back to Home
          </button>
        </Link>
      </header>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Tests</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff', margin: '0' }}>{stats.total}</p>
        </div>
        <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', border: '1px solid #c3e6cb', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Approved</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#155724', margin: '0' }}>{stats.approved}</p>
        </div>
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeaa7', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Pending</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#856404', margin: '0' }}>{stats.pending}</p>
        </div>
        <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', border: '1px solid #f5c6cb', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Rejected</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#721c24', margin: '0' }}>{stats.rejected}</p>
        </div>
      </div>

      {/* Filter and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Test Submissions ({filteredTests.length})</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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
      </div>

      {/* Tests List */}
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
              padding: '20px',
              backgroundColor: '#f8f9fa',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: '0', color: '#333' }}>
                      {test.name}
                      {test.testCode && <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>({test.testCode})</span>}
                    </h3>
                    <div style={getStatusBadge(test.approvalStatus)}>
                      {test.approvalStatus}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                    <p style={{ margin: '0', fontSize: '0.9em' }}>
                      <strong>Category:</strong> {test.category}
                    </p>
                    <p style={{ margin: '0', fontSize: '0.9em' }}>
                      <strong>Price:</strong> ${test.price}
                    </p>
                    <p style={{ margin: '0', fontSize: '0.9em' }}>
                      <strong>Status:</strong> {test.status}
                    </p>
                    <p style={{ margin: '0', fontSize: '0.9em' }}>
                      <strong>Created By:</strong> {test.createdBy}
                    </p>
                  </div>

                  <p style={{ margin: '10px 0', lineHeight: '1.4', fontSize: '0.95em' }}>
                    <strong>Description:</strong> {test.description}
                  </p>

                  {test.rejectionReason && (
                    <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '10px', marginTop: '10px' }}>
                      <p style={{ margin: '0', color: '#721c24', fontSize: '0.9em' }}>
                        <strong>Rejection Reason:</strong> {test.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9em', color: '#666', borderTop: '1px solid #dee2e6', paddingTop: '10px' }}>
                <div>
                  <strong>Created:</strong> {test.createdDate ? new Date(test.createdDate).toLocaleDateString() : 'N/A'}
                  {test.approvedDate && (
                    <span> | <strong>Approved:</strong> {new Date(test.approvedDate).toLocaleDateString()} by {test.approvedBy}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {test.approvalStatus === 'Pending Approval' && (
                    <>
                      <button
                        onClick={() => handleApprove(test._id)}
                        style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85em' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(test._id)}
                        style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85em' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {test.approvalStatus === 'Rejected' && (
                    <button
                      onClick={() => handleApprove(test._id)}
                      style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85em' }}
                    >
                      Re-approve
                    </button>
                  )}
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

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#721c24' }}>Reject Test Submission</h3>
            <p>Please provide a reason for rejection. This will help the admin understand what needs to be corrected.</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reject Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Supervisor;