import React, {useState,useEffect} from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [current, setCurrent] = useState(null);
  const [total, setTotal] = useState(totalPages);

  useEffect(()=>{
    setCurrent(currentPage)
  },[currentPage])

  useEffect(()=>{
    setTotal(totalPages)
  },[totalPages])

  const handlePageClick = (page) => {
    onPageChange(page)
    setCurrent(page);
  }

  const handleControllerClick = (direction) => { // prev or next
    let page = 1;
    if(direction === "prev" && current !==1){
      page = current - 1;
    }else if(direction === "prev" && current !==total){
      page = current + 1;
    }
    setCurrent(prev => page);
    onPageChange(page)
  }


  return (
    <>
    {
      
    current && <nav className="flex justify-center mt-4 gap-1">
    <button className={`react-pagination-control-button ${current==1?"disabled":""}`} onClick={()=> handleControllerClick("prev")} disabled={current==1}>
        <Icon icon="fontisto:angle-left" />
    </button>
    {
      parseInt(total) < 6 && 
      Array.from({ length: parseInt(total) }, (_, i) => i + 1).map(i=>(
        <button key={`page-${i}`}  className={`react-pagination-page-button ${current==i?"active":""}`} onClick={()=> handlePageClick(i)}>{i}</button>
      )) 
    }
    <button className={`react-pagination-control-button ${current==total?"disabled":""}`} onClick={()=> handleControllerClick("next")} disabled={current==total}>
      <Icon icon="fontisto:angle-right" />
    </button>
  </nav>
    }</>
  );
};

export default Pagination;
