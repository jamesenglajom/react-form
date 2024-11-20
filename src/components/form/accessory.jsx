import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";

const AccessoriesForm = ({ categories, update, onUpdate, onAddProduct }) => {
    const lockedCategory = 308; // 308 is the id for "Accessory" Category
    const unwantedCategories = [15, 18, 21, 279, 324];
    const default_form_values = {
        id: null,
        title: "",
        sku: "",
        description: "",
        categories: [lockedCategory],
        price: 0,
        stocks: 0,
    };
    const [formData, setFormData] = useState(default_form_values);

    const [accCat, setAccCat] = useState([]); // localizing categories and remove some options statically
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [updateIsAccessory, setUpdateIsAccessory] = useState(false);
    const handleCategoryClick = (category_id) => {
        setFormData(prev => {
            const prev_category = prev["categories"];
            if (prev_category.includes(parseInt(category_id))) {
                let filtered = prev_category.filter(i => parseInt(i) !== parseInt(category_id));
                if (filtered.length === 0) {
                    return { ...prev, categories: [lockedCategory] };
                } else {
                    let cat = [...new Set([...filtered, lockedCategory])];
                    return { ...prev, categories: cat };
                }
            } else {
                let cat = [...prev_category, parseInt(category_id)];
                cat = [...new Set([...cat, lockedCategory])];
                return { ...prev, categories: cat };
            }
        });
    }

    const populateData = (data) => {
        return {
            id:data?.id,
            title: data.name,
            sku: data.sku,
            description: data.description,
            categories: data.categories_ids,
            price: data.price,
            stocks: data.stocks,
        }
    }
    
    useEffect(()=>{
        if(update){
            console.log("UPDATE PRODUCT", update)
            let category_ids = update?.["categories_ids"];
            if(category_ids.includes(lockedCategory)){
                setUpdateIsAccessory(true);
                setFormData(populateData(update))
            }
        }else{
            setUpdateIsAccessory(false);
        }
    },[update])



    useEffect(() => {
        // set and remove categories
        if (categories) {
            // remove unwantedCategories
            let acc_cat = categories.filter(i => !unwantedCategories.includes(i.id));
            setAccCat(acc_cat);
        }
        if (categories.length === 0) {
            setFormData(prev => ({ ...prev, categories: [lockedCategory] }));
        }
    }, [categories]);


    const handleFormOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const formatData = (data) => {
        let formatted = data;
        if(updateIsAccessory){
            formatted["id"] = data?.["id"];
        }
        return formatted;
    }   

    const handleSubmit = (e) => {
        e.preventDefault();
        createUpdateAccessory(formatData(formData));
    }

    
  const createUpdateAccessory = async (data) => {
    setDisableSubmit(true);
    let API_URL = process.env.REACT_APP_API_URL + "/product-accessory";
    if (data["id"]) {
      API_URL = API_URL + "/" + data["id"];
    }
    console.log("data:",data);
    console.log("API_URL:",API_URL);
    try {
      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        setDisableSubmit(false);
        console.log("createUpdateAccessories Response", response);
        if (update) {
            setFormData(populateData(response.data.product));
            onUpdate(response.data.product);
          } else {
            setFormData(default_form_values);
            onAddProduct(response.data.product);
          }
      }).catch((error) => {
        setDisableSubmit(false);
        console.log("createUpdateAccessories ERROR", error)
      });
    } catch (error) {
        setDisableSubmit(false);
      console.error('Error:', error);
    }
  }

    return (
        <div>
            <div className="">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Title</label>
                <input value={formData.title} onChange={handleFormOnChange} name="title" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div className="mt-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product SKU</label>
                <input value={formData.sku} onChange={handleFormOnChange} name="sku" type="text" x className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div className="mt-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Category</label>
                {
                    categories && accCat && categories.length > 0 && accCat.map((v, i) =>
                        <div key={`cat-${i}`} data-id={v.id} data-slug={v.slug} className={`mb-1 cursor-pointer flex-1 user-select-none flex items-center border rounded ${formData?.categories.includes(v.id) ? "bg-green-500 border-green-800" : "bg-white hover:border-stone-400"}`} onClick={() => handleCategoryClick(v.id)}>
                            <div className="px-2 use-select-none">
                                <Icon icon="lets-icons:check-fill" className={`${formData?.categories.includes(v.id) ? "text-white" : "text-stone-300"}`} />
                            </div>
                            <div className={`${formData?.categories.includes(v.id) ? "text-white" : "text-stone-500"}`}>{`${v?.parent !== 0 ? accCat.filter(i => i.id === v?.parent)[0]?.name + " > " + v?.name : v?.name} || ${v?.id}`}</div>
                        </div>
                    )
                }
            </div>
            <div className="mt-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                <textarea
                    name="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="myTextArea"
                    value={formData?.description} // Set the value to the state variable
                    onChange={handleFormOnChange} // Handle changes with an event handler
                    placeholder="Type here..." // Placeholder text
                    rows="4" // Optional: Sets the number of visible text lines
                    cols="50" // Optional: Sets the width of the textarea
                />
            </div>
            <div className="mt-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Stocks</label>
                <input value={formData?.stocks} onChange={handleFormOnChange} name="stocks" type="number" min="0" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div className="mt-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Price</label>
                <input value={formData?.price} onChange={handleFormOnChange} name="price" type="number" min="0" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div className="mt-3">
                <button className={`react-primary-button ${disableSubmit ? "disabled" : ""}`} onClick={handleSubmit} disabled={disableSubmit}>
                    {
                        disableSubmit ? "Processing..." : "Submit"
                    }
                </button>
            </div>
        </div>

    )
};

export default AccessoriesForm;
