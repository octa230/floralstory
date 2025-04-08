'use client'


import React, { useContext, useState } from 'react'
import { MDBBtn } from 'mdb-react-ui-kit'
import { regions } from '../utils'
import { useOrderDetails } from '@/Store'

const TimeSlotSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentStep, setCurrentStep] = useState(1) // 1: Region, 2: Slot, 3: Date


  const {saveDetails } = useOrderDetails()

  // Region selection handler
  const handleRegionSelect = (region) => {
    setSelectedRegion(region)
    setSelectedSlot(null)
    setSelectedDate(null)
    setCurrentStep(2)
  }

  // Time slot selection handler
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setCurrentStep(3)
  }

  // Date selection handler
  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  // Go back to previous step
  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSaveDetails=()=>{
    if(window.confirm('SAVE?')){
      saveDetails({
        date: selectedDate,
        city: selectedRegion.name,
        slot: selectedSlot
      })
    }else{
      toast
    }
    
  }

  return (
      <div className="card shadow-3">
{/*         <div className="card-header bg-white">
          <h4 className="mb-0">{selectedRegion?.name || 'Select Delivery Time'}</h4>
        </div>
         */}
        <div className='p-2'>
          {/* Step 1: Region Selection */}
          {currentStep === 1 && (
            <div className="region-selection">
              <h5 className="mb-3">Select Delivery Area</h5>
              <div className="row g-3">
                {regions.map((region, index) => (
                  <div key={index} className="col-md-6">
                    <button
                      className="btn btn-outline-primary w-100 py-3"
                      onClick={() => handleRegionSelect(region)}
                    >
                      {region.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Time Slot Selection */}
          {currentStep === 2 && selectedRegion && (
            <div className="slot-selection">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-link" onClick={handleBack}>
                  <i className="fas fa-arrow-left me-2"></i> Change Area
                </button>
                <div></div> {/* Empty div for spacing */}
              </div>
              
              <div className="row g-1">
                {selectedRegion.timeSlots.map((slot, i) => {
                  const [key, value] = Object.entries(slot)[0]
                  return (
                    <div key={i} className="col-md-12">
                      <button
                        className={`btn w-100 py-3 ${selectedSlot?.key === key ? 
                          'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleSlotSelect({ key, value, price: slot.price })}
                      >
                        <div className="d-flex justify-content-between">
                          <span>{key}: {value}</span>
                        </div>
                        <span className='text-dark'>AED {slot.price}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Date Selection */}
          {currentStep === 3 && selectedRegion && selectedSlot && (
            <div className="date-selection">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <button className="btn btn-link" onClick={handleBack}>
                  <i className="fas fa-arrow-left me-2"></i> Change Slot
                </button>
                <h5 className="mb-0">Delivery Date</h5>
                <div></div>
              </div>
              
              <div className="mb-4">
                <div className="alert alert-info">
                  Selected: {selectedRegion.name} - {selectedSlot.key} ({selectedSlot.value})
                </div>
                <input 
                  type="date" 
                  className="form-control"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateSelect(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          {/* Confirmation Section */}
          {selectedDate && (
            <div className="mt-4 p-3 bg-light rounded">
              <h5>Summary</h5>
              <p className="mb-0">
                {selectedRegion?.name} delivery <br/> 
                On {selectedDate?.toDateString()} <br/>
                {selectedSlot?.key} ({selectedSlot?.value})
              </p>
            </div>
          )}
        </div>

        <div className="card-footer bg-white text-end">
          {currentStep === 3 && selectedDate && (
            <MDBBtn color="dark" className="px-4" onClick={handleSaveDetails}
              onProgress={handleSaveDetails}>
              Confirm Details
            </MDBBtn>
          )}
          {currentStep === 3 && !selectedDate && (
            <MDBBtn color="dark" disabled className="px-4">
              Please select a date
            </MDBBtn>
          )}
        </div>
      </div>
  )
}

export default TimeSlotSelector