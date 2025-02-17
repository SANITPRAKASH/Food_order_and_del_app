import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sem: '',
    section: '',
    usn: '',
    phone: '',
    address: '', // Small address description
  });

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo['quantity'] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      studentInfo: data, // Now including address as part of studentInfo
      items: orderItems,
      amount: getTotalCartAmount() + 2, // Total amount
    };

    try {
      let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } });
      
      if (response.data.success) {
        const { order_id } = response.data;
        window.location.replace(`/verify?order_id=${order_id}`);
      } else {
        alert('Error placing order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <div className="title">STUDENT INFORMATION</div>
        <div className="multi-fields">
          <input required name='firstName' onChange={onchangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onchangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='sem' onChange={onchangeHandler} value={data.sem} type="text" placeholder='Semester' />
        <input required name='section' onChange={onchangeHandler} value={data.section} type="text" placeholder='Section' />
        <input required name='usn' onChange={onchangeHandler} value={data.usn} type="text" placeholder='USN' />
        <input required name='phone' onChange={onchangeHandler} value={data.phone} type="text" placeholder='Phone' />
        <input name='address' onChange={onchangeHandler} value={data.address} type="text" placeholder='Small address description (Optional)' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹ {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Domain Fee</p>
              <p>₹ {getTotalCartAmount() === 0 ? 0 : 1}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹ {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 1}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
