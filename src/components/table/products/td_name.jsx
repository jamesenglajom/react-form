import React from 'react'

export default function tdName({data}) {
  return (
    <div className="flex items-center">
        {/* image */}
        <div className={`bg-contain bg-no-repeat bg-center`} style={{ backgroundImage: `url(${data.image})`, height:'100px', width:'100px' }}>
        </div>
        {/* details */}
        <div className="w-[calc(100%-100px)] pl-3">
            <div className="grid grid-cols-1 gap-2">
                <div className="font-semibold">{data.name}</div>
                <div className="text-stone-900"><span className="font-semibold">SKU: </span>{data.sku}</div>
                <div className={data.stock_status=='instock' ? 'text-green-500':'text-stone-500'}>{data.stock_status}</div>
                {
                  data.post_status === 'publish' ? 
                  <div><span className="font-semibold text-stone-500">{`${data.post_status}: `.toUpperCase()}</span> {data.publish_date}</div> :
                  <div><span className="font-semibold text-stone-400">{`${data.post_status}`.toUpperCase()}</span></div>
                }
            </div>
        </div>
    </div>
  )
}
