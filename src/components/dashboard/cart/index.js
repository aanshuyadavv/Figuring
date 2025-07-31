import React from 'react'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'
const Cart = () => {
  return (
    <div className='text-white flex flex-col items-center justify-center'>
      <div>
        <h1 className='text-center'>My Wishlist</h1>
      </div>
      <div>
        <RenderCartCourses/>
        <RenderTotalAmount/>
      </div>
    </div>
  )
}

export default Cart
