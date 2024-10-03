import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image}) => {

    const{cartItems,addToCart,removeFromCart,url}=useContext(StoreContext);

  return (
    <div className='food-itm'>
        <div className="food-item-img-container">
           <img className='food-item-image' src={url+"/images/"+image} alt='foodimages'/>
           {!cartItems[id]  
                  ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white }alt=""/>
                  :<div className='food-item-counter'>
                    <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                    <p>{cartItems[id]}</p>
                    <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
                   </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="rate of food" />
            </div>
            <p className='food-item-desc'>{description}</p>
            <p className='food-item-price'>{price}</p>

        </div>

    </div>
  )
}

export default FoodItem