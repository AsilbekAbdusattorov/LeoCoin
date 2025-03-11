import React from 'react'
import {Link} from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div>
      <h1 className='text-green-400 font-bold mb-5'>PageNotFound</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quod libero vitae repellendus esse facere recusandae consectetur veniam reprehenderit placeat molestiae sit hic expedita saepe doloribus, aliquid magnam illum consequuntur!</p>
      <Link className='bg-green-400 px-5 py-2 rounded-md mt-5 inline-block' to='/'>Home</Link>
    </div>
  )
}

export default PageNotFound