import React, {useEffect,useState} from "react";
import axios from "axios";
const CategoryField = ({label, value, onChange})=>{
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(()=>{
        let initialValue = categoryList.filter(i=> value.includes(i.name)).map(i=> i.id);
        setSelectedCategories(initialValue);
    },[categoryList]);

    // fecth category list onload
    useEffect(()=>{
    axios.get("https://onsitestorage.com/wp-json/wp_to_react/v1/product-categories").then(res => {
        const {data} = res;
        setCategoryList(data);
    });
    },[]);

    const handleChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
          setSelectedCategories([...selectedCategories, parseInt(value)]);
        } else {
          setSelectedCategories(selectedCategories.filter((id) => parseInt(id) !== parseInt(value)));
        }
        console.log("selectedCategories",selectedCategories);
        onChange({target:{name:"categories", type:"product_category", value: selectedCategories}})
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
                                checked={selectedCategories? selectedCategories.includes(category.id): false}
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