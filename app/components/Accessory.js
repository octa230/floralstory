import React, { useState } from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';




const Accessory = ({ accessory, onQuantityChange, initialQuantity = 0 }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
  
    const handleChange = (change) => {
      const newQuantity = Math.max(0, Math.min(accessory.inStock, quantity + change));
      setQuantity(newQuantity);
      onQuantityChange(accessory._id, newQuantity);
    };
  
    return (
      <div className="card p-3">
        <div className="d-flex align-items-center gap-3 mb-2">
          <img
            src={accessory.image}
            alt={accessory.name}
            height={60}
            width={60}
            className="rounded"
          />
          <div>
            <h6 className="mb-1">{accessory.name}</h6>
            <p className="mb-0 text-muted">AED {accessory.price}</p>
            <small className="text-muted">{accessory.inStock} available</small>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <MDBBtn 
            size="sm" 
            color="danger" 
            onClick={() => handleChange(-1)}
            disabled={quantity <= 0}
          >
            -
          </MDBBtn>
          <span>{quantity}</span>
          <MDBBtn 
            size="sm" 
            color="success" 
            onClick={() => handleChange(1)}
            disabled={quantity >= accessory.inStock}
          >
            +
          </MDBBtn>
        </div>
      </div>
    );
  };



  export default Accessory



/* const Accessory = ({ accessory, onAdd, onRemove, isSelected }) => {
    return (
      <div className={`card p-3 ${isSelected ? 'border-primary' : ''}`}>
        <div className="d-flex align-items-center gap-3">
          <img
            src={accessory.image}
            alt={accessory.name}
            height={60}
            width={60}
            className="rounded"
          />
          <div>
            <h6 className="mb-1">{accessory.name}</h6>
            <p className="mb-0 text-muted">AED {accessory.price}</p>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-2">
          {isSelected ? (
            <MDBBtn size="sm" color="danger" onClick={onRemove}>
              Remove
            </MDBBtn>
          ) : (
            <MDBBtn size="sm" color="success" onClick={onAdd}>
              Add
            </MDBBtn>
          )}
        </div>
      </div>
    )
  }


  export default Accessory */

/* const Accessory = (props) => {
  //const accessory = props.accessory;
  const { accessory, onAdd, onRemove, isSelected  } = props

  const [quantity, setQuantity] = useState(0);
  const { addItem, removeItem, updateItemQuantity } = useCartStore();

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(0, Math.min(accessory.inStock, quantity + change));
    setQuantity(newQuantity);
    
    if (newQuantity > 0) {
      updateItemQuantity(accessory._id, newQuantity);
    } else {
      removeItem(accessory._id);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      const initialQuantity = 1;
      setQuantity(initialQuantity);
      addItem({
        ...accessory,
        quantity: initialQuantity
      });
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
      <div className="d-flex align-items-center gap-3" key={accessory.name}>
        <img
          src={accessory.image}
          alt={accessory.name}
          height={40}
          width={40}
          className="rounded"
        />
        <div>
          <h6 className="mb-1">{accessory.name}</h6>
          <p className="mb-0 text-muted">Qty: {quantity}</p>
          <p className="mb-0 text-muted">Price: AED {accessory.price * quantity}</p>
        </div>
      </div>
      
      <div className="d-flex gap-2 align-items-center">
        <MDBBtn 
          size="sm" 
          color="danger" 
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 0}
        >
          -
        </MDBBtn>
        
        <span>{quantity}</span>
        
        <MDBBtn 
          size="sm" 
          color="success" 
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= accessory.inStock}
        >
          +
        </MDBBtn>
        
        <MDBBtn 
          size="sm" 
          color="primary" 
          onClick={handleAddToCart}
          disabled={quantity > 0}
        >
          {quantity > 0 ? 'Added' : 'Add'}
        </MDBBtn>
      </div>
    </div>
  );
};

export default Accessory; */