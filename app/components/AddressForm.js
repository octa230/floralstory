import React, { useState } from 'react';
import { MDBBtn, MDBInput, MDBRadio } from 'mdb-react-ui-kit';
import { FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaHome, FaBriefcase, FaStar } from 'react-icons/fa';

const AddressForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    city: '',
    address: '',
    mobile: '',
    altMobile: '',
    email: '',
    addressType: 'home',
    landmark: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Address submitted:', formData);
    // Submit logic here
  };

  return (
    <div className="address-form-container p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 className="mb-4 d-flex align-items-center">
        <FaMapMarkerAlt className="text-primary me-2" />
        ADD DELIVERY ADDRESS
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Title and Name */}
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3 d-flex align-items-center">
              <FaUser className="text-muted me-2" />
              Personal Information
            </h5>
            
            <div className="mb-3">
              <label className="form-label">Title</label>
              <div className="d-flex gap-3">
                <MDBRadio 
                  name="title" 
                  id="mr" 
                  label="Mr." 
                  checked={formData.title === 'mr'} 
                  onChange={() => setFormData({...formData, title: 'mr'})} 
                />
                <MDBRadio 
                  name="title" 
                  id="mrs" 
                  label="Mrs." 
                  checked={formData.title === 'mrs'} 
                  onChange={() => setFormData({...formData, title: 'mrs'})} 
                />
                <MDBRadio 
                  name="title" 
                  id="ms" 
                  label="Ms." 
                  checked={formData.title === 'ms'} 
                  onChange={() => setFormData({...formData, title: 'ms'})} 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInput
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <MDBInput
                  label="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3 d-flex align-items-center">
              <FaMapMarkerAlt className="text-muted me-2" />
              Address Details
            </h5>

            <div className="mb-3">
              <MDBInput
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <MDBInput
                label="Complete Address *"
                name="address"
                textarea='true'
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <MDBInput
                label="Landmark (optional)"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3 d-flex align-items-center">
              <FaPhone className="text-muted me-2" />
              Contact Information
            </h5>

            <div className="mb-3">
              <MDBInput
                label="Mobile Number *"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <MDBInput
                label="Alternative Mobile (optional)"
                name="altMobile"
                type="tel"
                value={formData.altMobile}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <MDBInput
                label="Email (optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Address Type */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3 d-flex align-items-center">
              <FaStar className="text-muted me-2" />
              Address Type
            </h5>

            <div className="d-flex gap-4">
              <MDBRadio 
                name="addressType" 
                id="home" 
                label={
                  <span className="d-flex align-items-center">
                    <FaHome className="me-2" /> Home
                  </span>
                } 
                value="home"
                checked={formData.addressType === 'home'} 
                onChange={handleChange}
                inline
              />
              <MDBRadio 
                name="addressType" 
                id="office" 
                label={
                  <span className="d-flex align-items-center">
                    <FaBriefcase className="me-2" /> Office
                  </span>
                } 
                value="office"
                checked={formData.addressType === 'office'} 
                onChange={handleChange}
                inline
              />
              <MDBRadio 
                name="addressType" 
                id="other" 
                label="Other" 
                value="other"
                checked={formData.addressType === 'other'} 
                onChange={handleChange}
                inline
              />
            </div>
          </div>
        </div>

        <MDBBtn type="submit" color="primary" className="w-100 py-2">
          SAVE AND DELIVER HERE
        </MDBBtn>
      </form>
    </div>
  );
};

export default AddressForm;