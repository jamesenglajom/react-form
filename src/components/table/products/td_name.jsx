import React from 'react'

export default function tdName({data}) {
  return (
    <div className="flex items-center">
        {/* image */}
        <div className={`bg-contain bg-no-repeat bg-center`} style={{ backgroundImage: `url(${data.image})`, height:'300px', width:'300px' }}>
        </div>
        {/* details */}
        <div className="w-[calc(100%-300px)] pl-3">
            <div className="grid grid-cols-1 gap-2">
                <div className="font-semibold text-stone-700 pt-2">{data.name}</div>
                <div className="font-semibold border-t pt-2 border-stone-300">{data.cf_container_title}</div>
                <div className="font-semibold border-t pt-2 border-stone-300 text-stone-700">{data.cf_location}</div>
                <div className="font-semibold border-t pt-2 border-stone-300">
                <div className="w-full table text-stone-700">
                  {/* <div className="table-row">
                    <div className="table-cell p-1  font-bold">Location </div>
                    <div className="table-cell p-1">{data.cf_location}</div>
                  </div> */}
                  <div className="table-row">
                    <div className="table-cell p-1 font-bold">Condition </div>
                    <div className="table-cell p-1">{data.cf_condition}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell p-1  font-bold">Grade </div>
                    <div className="table-cell p-1">{data.cf_grade}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell p-1  font-bold">Height </div>
                    <div className="table-cell p-1">{data.cf_height}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell p-1  font-bold">Size </div>
                    <div className="table-cell p-1">{data.cf_length_width}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell p-1  font-bold">Door Type </div>
                    <div className="table-cell p-1">{data.cf_doortype}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell p-1  font-bold">Selection Type </div>
                    <div className="table-cell p-1">{data.cf_selectionoptions}</div>
                  </div>
                  <div className="table-row">
                    <div className="table-cell p-1  font-bold">Container Type </div>
                    <div className="table-cell p-1">{data.cf_type}</div>
                  </div>
                </div>
                </div>
                <div className="font-semibold border-t pt-2 border-stone-300 text-stone-700">SKU: {data.sku}</div>
                <div className="font-semibold border-t pt-2 border-stone-300">{data.cf_container_grade_title}</div>
                <div className="font-semibold border-t pt-2 border-stone-300">{data.categories.join(", ")}</div>
                <div className="font-semibold border-t pt-2 border-stone-300 text-indigo-600 text-3xl">${data.price}</div>
                <div className={data.stocks>0 ? 'text-green-500':'text-stone-500'}>STOCKS ({data.stocks??0})</div>
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
