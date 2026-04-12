import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // We'll create this for styles

function Home() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicalTests();
  }, []);

  const fetchMedicalTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4005/medical-tests');
      if (!response.ok) {
        throw new Error('Failed to fetch medical tests');
      }
      const allTests = await response.json();
      // Filter only approved tests for the home page
      const approvedTests = allTests.filter(test => test.approvalStatus === 'Approved');
      setTests(approvedTests);
      setError(null);
    } catch (error) {
      console.error('Error fetching medical tests:', error);
      setError('Failed to load medical tests. Please try again later.');
      // Fallback to mock data if API fails
      setTests([
        {
          id: 1,
          name: 'Blood Test',
          category: 'Hematology',
          description: 'Comprehensive blood analysis to check for various health conditions.',
          price: 50,
          status: 'Available',
          approvedDate: '2023-10-01'
        },
        {
          id: 2,
          name: 'X-Ray Chest',
          category: 'Radiology',
          description: 'Imaging test to examine the chest area for abnormalities.',
          price: 100,
          status: 'Available',
          approvedDate: '2023-09-15'
        },
        {
          id: 3,
          name: 'MRI Scan',
          category: 'Radiology',
          description: 'Magnetic resonance imaging for detailed internal body scans.',
          price: 500,
          status: 'Limited Availability',
          approvedDate: '2023-08-20'
        },
        {
          id: 4,
          name: 'ECG',
          category: 'Cardiology',
          description: 'Electrocardiogram to monitor heart activity.',
          price: 75,
          status: 'Available',
          approvedDate: '2023-11-05'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Header with Login Button */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <h1 style={{ margin: 0 }}>Hospital Management System</h1>
        <Link to="/login">
          <button style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Login
          </button>
        </Link>
      </header>

      {/* Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h2>Welcome to Our Hospital</h2>
          <p>
            We are committed to providing exceptional healthcare services with compassion and excellence.
            Our state-of-the-art facilities and dedicated medical professionals ensure the best care for our patients.
          </p>
        </div>
        <div className="banner-image">
          <img src="https://via.placeholder.com/600x400?text=Hospital+Banner" alt="Hospital Banner" />
        </div>
      </section>

      {/* Hospital Description */}
      <section className="description">
        <h2>About Our Hospital</h2>
        <p>
          Founded in 1990, our hospital has been a cornerstone of healthcare in the community.
          We offer a wide range of medical services, from routine check-ups to advanced surgical procedures.
          Our team of experienced doctors, nurses, and support staff work tirelessly to deliver personalized care
          tailored to each patient's needs. We prioritize patient safety, comfort, and satisfaction in everything we do.
        </p>
      </section>

      {/* Medical Tests Section */}
      <section className="tests-section">
        <h2>Available Medical Tests</h2>
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
          <div className="tests-grid">
            {tests.map(test => (
              <div key={test._id || test.id} className="test-card">
                <h3>{test.name}</h3>
                <p className="category">Category: {test.category}</p>
                <p className="description">{test.description}</p>
                <p className="price">Price: ${test.price}</p>
                <p className={`status ${test.status.toLowerCase().replace(' ', '-')}`}>
                  Status: {test.status}
                </p>
                <p className="date">Approved: {test.approvedDate ? new Date(test.approvedDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
        {tests.length === 0 && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No approved medical tests available at the moment.
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;