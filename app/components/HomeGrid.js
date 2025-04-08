'use client';
import React from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

const HomeGrid = () => {
  return (
      <MDBRow>
        <MDBCol sm="12" md="4" className="mb-4">
          <img 
            src="https://www.floralshopuae.com/wp-content/uploads/2023/08/floralshopuae-banner-1.jpg"
            className="w-100 rounded" 
            alt="Banner 1" 
          />
        </MDBCol>
        <MDBCol sm="12" md="4" className="mb-4">
          <img 
            src="https://www.floralshopuae.com/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-11-at-10.22.31-1.jpeg"
            className="w-100 rounded" 
            alt="Banner 2" 
          />
        </MDBCol>
        <MDBCol sm="12" md="4" className="mb-4">
          <img 
            src="https://www.floralshopuae.com/wp-content/uploads/2023/08/floralshopuae-banner-3.jpg"
            className="w-100 rounded" 
            alt="Banner 3" 
          />
        </MDBCol>
      </MDBRow>
  );
};

export default HomeGrid;
