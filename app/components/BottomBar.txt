'use client'

import React, { useState } from 'react';
import { MDBBtn, MDBTooltip } from 'mdb-react-ui-kit';
import { useRouter } from 'next/navigation';

const BottomBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks active dropdown
  const router = useRouter();

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown)); // Toggle dropdown visibility
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="fixed-bottom bg-light text-dark d-flex justify-content-between p-3">
      {/* Home Button */}
      <MDBTooltip 
        tag="div" 
        wrapperProps={{
          className: "d-flex align-items-center",
          onClick: () => navigateTo('/')
        }} 
        title="Go to Home" 
      >
        <MDBBtn color="dark" rounded className='shadow-0'>
          <i className="fas fa-home"></i>
        </MDBBtn>
      </MDBTooltip>

      {/* Account Button */}
      <MDBTooltip 
        tag="div" 
        wrapperProps={{
          className: "d-flex align-items-center",
          onClick: () => toggleDropdown('account') // Toggle the account dropdown
        }} 
        title="Your Account"
      >
        <MDBBtn color="dark" rounded className='shadow-0'>
          <i className="fas fa-user"></i>
        </MDBBtn>
      </MDBTooltip>

      {/* Cart Button */}
      <MDBTooltip 
        tag="div" 
        wrapperProps={{
          className: "d-flex align-items-center",
          onClick: () => toggleDropdown('cart') // Toggle the cart dropdown
        }} 
        title="View Cart"
      >
        <MDBBtn color="dark" rounded className='shadow-0'>
          <i className="fas fa-shopping-cart"></i>
        </MDBBtn>
      </MDBTooltip>

      {/* Settings Button (More actions) */}
      <MDBTooltip 
        tag="div" 
        wrapperProps={{
          className: "d-flex align-items-center",
          onClick: () => toggleDropdown('settings') // Toggle the settings dropdown
        }} 
        title="Show Settings"
      >
        <MDBBtn color="dark" rounded className='shadow-0'>
          <i className="fas fa-cogs"></i>
        </MDBBtn>
      </MDBTooltip>

      {/* Cart Actions Dropdown */}
      {activeDropdown === 'cart' && (
        <div className="dropdown-actions cart-actions active">
          <button className="btn btn-link" onClick={() => navigateTo('/cart')}>Go to Cart</button>
          <button className="btn btn-link" onClick={() => alert("Items cleared!")}>Clear Cart</button>
        </div>
      )}

      {/* Account Actions Dropdown */}
      {activeDropdown === 'account' && (
        <div className="dropdown-actions account-actions active">
          <button className="btn btn-link" onClick={() => alert("Logged out!")}>Logout</button>
          <button className="btn btn-link" onClick={() => navigateTo('/order-history')}>Order History</button>
          <button className="btn btn-link" onClick={() => navigateTo('/wishlist')}>Wishlist</button>
          <button className="btn btn-link" onClick={() => navigateTo('/addresses')}>Addresses</button>
          <button className="btn btn-link" onClick={() => navigateTo('/profile')}>Manage Profile</button>
        </div>
      )}

      {/* Settings Actions Dropdown */}
      {activeDropdown === 'settings' && (
        <div className="dropdown-actions settings-actions active">
          <button className="btn btn-link" onClick={() => alert("Support Contacted!")}>WhatsApp Support</button>
          <button className="btn btn-link" onClick={() => navigateTo('/settings')}>Settings</button>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
