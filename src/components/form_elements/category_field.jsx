import React, {useEffect,useState} from "react";
import axios from "axios";
const CategoryField = ({label, value, onChange})=>{
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(value);
    
    // fecth category list onload
    useEffect(()=>{
    axios.get("https://onsitestorage.com/wp-json/wp_to_react/v1/product-categories").then(res => {
        const {data} = res;
        setCategoryList(data);
    });
    },[]);

    useEffect(()=>{
        console.log("category_field_value", value);
    },[value])
    
    useEffect(()=>{
        if(categoryList.length > 0){
            const hasNonNumber = value.some(value => typeof value !== 'number' || isNaN(value));
            if(hasNonNumber){
                let initialValue = categoryList.filter(i=> value.includes(i.name)).map(i=> i.id);
                setSelectedCategories(initialValue);
            }
        }
    },[categoryList]);

    useEffect(()=>{
        onChange({target:{name:"categories", type:"product_category", value: selectedCategories}})
    },[selectedCategories])

    const handleChange = (event) => {
        const { value:val, checked } = event.target;
        if (checked) {
            setSelectedCategories((prev) => [...prev, parseInt(val)]);
        } else {
            setSelectedCategories((prev) => prev.filter((id) => parseInt(id) !== parseInt(val)));
        }
    }

    return (
        <div>
            {label && (
            <label  className="w-full font-semibold text-sm">
                {label}
            </label>
            )}
            <div>
                {
                    categoryList.length > 0 && categoryList.map((category, index)=>(
                        <div key={category.slug}>
                            <label htmlFor={category.slug} value={category.id}>
                                <input
                                id={category.slug}
                                name={category.slug}
                                value={category.id}
                                type="checkbox"
                                onChange={handleChange}
                                checked={selectedCategories.includes(category.id)}
                                className="mr-2"/>

                                {category.name}
                            </label>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default CategoryField;