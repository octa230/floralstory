import React, { useState } from 'react'
import { FaEnvelope} from 'react-icons/fa';
import { MDBBtn, MDBInput, MDBRadio } from 'mdb-react-ui-kit';
import { useCartStore } from '../../Store';


const MessageCardModal = ({ isVisible, cartId, onClose }) => {
    
    const {addCard} = useCartStore()

    const [formData, setFormData] = useState({
        recipient:"",
        sender:"",
        themeOption: "default",
        messageBody:""
    })
    
    console.log(cartId)

    const handleChange = (e) => { 
        const{name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value}))
    }
    const handleConfirm = () => { 
        console.log(formData, "cartId:", cartId)
        addCard(cartId, {...formData})
    }

    if (!isVisible) {
        return null; // Don't render the modal if `isVisible` is false
    }
    return (
        <div className='container container-fluid mt-4'>
            <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>FREE MESSAGE CARD</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className='modal-body'>
                            <div className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="mb-3 d-flex align-items-center">
                                        <FaEnvelope className="text-muted me-2" />
                                        Message Card Details
                                    </h5>

                                    <div className="mb-3">
                                        <MDBInput
                                            label="To *"
                                            name="recipient"
                                            value={formData.recipient || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                        <MDBInput className='mb-3'
                                            label="From *"
                                            name="sender"
                                            value={formData.sender || ''}
                                            onChange={handleChange}
                                            required
                                        />

                                        <MDBInput style={{minHeight: "100px", resize: "vertical" }}
                                            label="Message *"
                                            name="messageBody"
                                            type='textarea'
                                            rows={5}
                                            value={formData.messageBody || ''}
                                            onChange={handleChange}
                                            required
                                            placeholder="Write your special message here..."
                                        />
                                        <div className="form-text text-muted mt-1">
                                            Max 150 characters. ({formData.messageBody ? 150 - formData.messageBody.length : 150} remaining)
                                        </div>

                                    <div className="mb-3">
                                        <label className="form-label d-block">Choose a Theme</label>
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            <div className="form-check">
                                                <MDBRadio
                                                    onChange={handleChange}
                                                    checked ={formData.themeOption === 'default'}
                                                    name="themeOption"
                                                    id="default"
                                                    value="default"
                                                    label="Default"
                                                    //defaultChecked
                                                    inline
                                                />
                                            </div>
                                            <div className="form-check">
                                                <MDBRadio
                                                    onChange={handleChange}
                                                    checked ={formData.themeOption === 'birthday'}
                                                    name="themeOption"
                                                    id="birthday"
                                                    value="birthday"
                                                    label="Birthday"
                                                    inline
                                                />
                                            </div>
                                            <div className="form-check">
                                                <MDBRadio
                                                    onChange={handleChange}
                                                    checked ={formData.themeOption === 'anniversary'}
                                                    name="themeOption"
                                                    id="anniversary"
                                                    value="anniversary"
                                                    label="Anniversary"
                                                    inline 
                                                />
                                            </div>
                                            <div className="form-check">
                                                <MDBRadio
                                                    onChange={handleChange}
                                                    checked ={formData.themeOption === 'congratulations'}
                                                    name="themeOption"
                                                    id="themeCongratulations"
                                                    value="congratulations"
                                                    label="Congratulations"
                                                    inline
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <MDBBtn color='primary' onClick={handleConfirm} >
                                        SAVE CARD
                                    </MDBBtn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageCardModal
