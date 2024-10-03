import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  // Logging food_list for debugging
  console.log(food_list);

  return (
    <div className='food-display' id='food-display'>
      <h2>Our top dishes</h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          console.log(category, item.category);
          if (category === "All" || category.trim() === item.category.trim()) {
            return (
              <FoodItem 
                key={item._id} 
                id={item._id} 
                name={item.name} 
                description={item.description} 
                price={`$ ${item.price}`} 
                image={item.image} 
              />
            );
          }
          return null; // Return null if the item doesn't match the category
        })}
      </div>
    </div>
  );
}

export default FoodDisplay;