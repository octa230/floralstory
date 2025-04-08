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
import { MdBadge } from 'react-icons/md';
import { useCartStore } from '@/Store';
import { FaCartShopping, FaHouseChimneyWindow, FaUser } from 'react-icons/fa6';

const Header =()=> {
  const [openNavNoTogglerSecond, setOpenNavNoTogglerSecond] = useState(false);
  const {items} = useCartStore()

  return (
    <MDBNavbar expand='lg' light bgColor='light' fixed='top' className='container-fluid d-flex justify-content-between align-content-center'>
      <MDBNavbarBrand href='/'>
        <FaHouseChimneyWindow size={22}/>
      </MDBNavbarBrand>
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
          <FaUser size={22}/>
        </MDBNavbarLink>
      </MDBNavbarItem>
      <MDBNavbarItem className='position-relative'>
        <MDBNavbarLink active href='/cart' tabIndex={-1}>
        {items.length > 0 && (
            <span className="badge badge-danger position-absolute top-10 end-12 translate-middle zindex-10">
              {items.length}
          </span>
        )}
          <FaCartShopping size={22}/>
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