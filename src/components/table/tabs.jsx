import React from 'react'

export default function productTableTabs({ tabs, stats, value, disabled, onChange, toggle }) {
    const handleChange = (v) => {
            onChange(v);
    }
    return (
        <div className={`${toggle} w-full flex overflow-y-auto custom-scrollbar pr-2`} >
            {
                tabs.map(tab => (
                    <div key={`post-status-products-tab-${tab.id}`}>
                        <input className="hidden" type="radio" checked={tab.id===value.post_status} value={tab.id} id={`post-status-tab-${tab.id}`} name="post-status-tabs" onChange={handleChange} />
                        <button onClick={handleChange} disabled={disabled || tab.id===value.post_status } value={tab.id} className={`table-post-status-tab-button ${tab.id===value.post_status? 'active':''} select-none text-xs py-1 px-3 rounded-full  inline-block m-[1px]`}>
                            {tab.label + ' | ' + (stats?.[tab.id] ?? '0')}
                        </button>
                    </div>
                ))
            }
            {/* <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-stone-400 pr-[3px] mr-[3px]">Trashed</span><span className="text-stone-400">20+</span></div> */}
        </div>
    )
}
