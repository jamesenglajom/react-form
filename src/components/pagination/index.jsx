import React, {useState,useEffect} from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [current, setCurrent] = useState(currentPage);
  const [total, setTotal] = useState(totalPages);
  const [pages, setPages] = useState([]);

  useEffect(()=>{
    setCurrent(currentPage)
  },[currentPage])

  useEffect(()=>{
    setTotal(totalPages)
  },[totalPages])

  useEffect(()=>{
    let pages_array = generatePages(current,total);
    setPages(pages_array)
  },[current, total])

  const handlePageClick = (page) => {
    onPageChange(page)
    setCurrent(page);
  }

  const handleControllerClick = (direction) => { // prev or next
    let page = 1;
    if(direction === "prev"){
      page = current - 1;
    }else if(direction === "next"){
      page = current + 1;
    }
    setCurrent(prev => page);
    onPageChange(page)
  }

  const generatePages = (current, total) => {
    if(total <6){
      return Array.from({ length: parseInt(totalPages) }, (_, i) => i + 1)
    }else{
      let first3 = [1,2,3];
      let first4 = [1,2,3,4];
      let last3 = Array.from({ length: 3 }, (_, i) => total - 2 + i);
      let last4 = Array.from({ length: 4 }, (_, i) => total - 3 + i);
      if(first3.includes(current)){
        return [...first4, "...", total];
      }

      if(last3.includes(parseInt(current))){
        return [1, "...", ...last4];
      }

      if(!first3.includes(parseInt(current)) && !last3.includes(parseInt(current))){
        return [1, "...", (current-1), current, (current+1) ,"...", total];
      }
    }
  }


  return (
    <>
    {
      
    current && <nav className="flex justify-center gap-1">
    <button className={`react-pagination-control-button ${current==1?"disabled":""}`} onClick={()=> handleControllerClick("prev")} disabled={current==1}>
        <Icon icon="fontisto:angle-left" />
    </button>
    {
      pages.length > 0 && pages.length < 6 && 
      pages.map((v,i)=>(
        <button key={`page-${i}`}  className={`react-pagination-page-button ${current==v?"active":""}`} onClick={()=> handlePageClick(v)}>{v}</button>
      )) 
    }
    {
      pages.length > 5 && 
      pages.map((v,i)=>(
        v === "..." ? <button key={`page-${i}`} className="react-pagination-_-button">...</button>:<button key={`page-${i}`}  className={`react-pagination-page-button ${current==v?"active":""}`} onClick={()=> handlePageClick(v)}>{v}</button>
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
