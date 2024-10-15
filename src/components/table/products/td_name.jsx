import React from 'react'

export default function tdName({ data }) {
  return (
    <div className="flex items-center">
      {/* image */}
      <div className={`bg-contain bg-no-repeat bg-center`} style={{ backgroundImage: `url(${data.image})`, height: '80px', width: '80px' }}>
      </div>
      {/* details */}
      <div className="w-[calc(100%-80px)] pl-3">
        <div className="grid grid-cols-1 gap-2">
          <div className="font-semibold text-stone-700 pt-2">{data.name}</div>
          <div className="flex items-center">
            <div className="text-stone-700">{data.cf_doortype}</div>
            <div className="text-stone-700 ml-5">{data.cf_selectionoptions}</div>
          </div>
          <div className="flex items-center">
            <div className="text-stone-700">SKU: {data.sku}</div>
            <div className={`ml-5 ${data.stocks > 0 ? 'text-green-500' : 'text-stone-500'}`}>STOCKS ({data.stocks ?? 0})</div>
          </div>
          <div className="text-stone-900">{data.categories.join(", ")}</div>
          {
            data.post_status === 'publish' ?
              <div><span className="font-semibold text-stone-500">{`${data.post_status}: `.toUpperCase()}</span> {data.publish_date}</div> :
              <div><span className="font-semibold text-stone-400">{`${data.post_status}`.toUpperCase()}</span></div>
          }
          <div className="font-semibold text-stone-900 text-lg">${data.price}</div>
        </div>
      </div>
    </div>
  )
}
