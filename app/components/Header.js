import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
  MDBInputGroup
} from 'mdb-react-ui-kit';

const Header =()=> {
  const [openNavNoTogglerSecond, setOpenNavNoTogglerSecond] = useState(false);

  return (
      <MDBNavbar expand='lg' light bgColor='light' fixed='top' className='container-fluid d-flex justify-content-between'>
      <MDBNavbarBrand href='/'>Home</MDBNavbarBrand>
      <MDBNavbarToggler
        type='button'
        data-target='#navbarTogglerDemo02'
        aria-controls='navbarTogglerDemo02'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={() => setOpenNavNoTogglerSecond(!openNavNoTogglerSecond)}
      >
    <MDBIcon icon='bars' fas />
  </MDBNavbarToggler>
  <MDBCollapse navbar open={openNavNoTogglerSecond}>
    <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
      <MDBNavbarItem>
        <MDBNavbarLink active href='/login' tabIndex={-1}>
          Account
        </MDBNavbarLink>
      </MDBNavbarItem>
      <MDBNavbarItem>
        <MDBNavbarLink active href='/cart' tabIndex={-1}>
          Cart
        </MDBNavbarLink>
      </MDBNavbarItem>
    </MDBNavbarNav>
  </MDBCollapse>
  <MDBInputGroup tag="form" className='d-flex w-auto mb-3 p-1'>
    <input className='form-control' placeholder="Type query" aria-label="Search" type='Search' />
    <MDBBtn outline>Search</MDBBtn>
    </MDBInputGroup>
  </MDBNavbar>
  );
}

export default Header