import React from 'react'

export default function tdPrice({data}) {
  return (
    <div className="font-bold text-stone-600">
      {`$ ${data.price}.00`}
    </div>
  )
}
