import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"

const List = ({ url }) => {
  const [list, setList] = useState([])

  // Fetch data from the backend URL
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching food list")
      }
    } catch (error) {
      toast.error("Error fetching food list")
      console.error("Error:", error)
    }
  }

  // To remove the food
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()  // Refresh the list after removing
      } else {
        toast.error("Error removing food")
      }
    } catch (error) {
      toast.error("Error removing food")
      console.error("Error:", error)
    }
  }

  // Every time page reloads, the data from the backend is fetched
  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list && list.length > 0 ? list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)} className='cursor'>❌</p>
          </div>
        )) : <p>No food items available</p>}
      </div>
    </div>
  )
}

export default List
