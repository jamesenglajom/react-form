import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';

const InputImages = ({ update, onUpdate }) => {
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);
  let API_URL = 'https://onsitestorage.com/wp-json/wp_to_react/v1/product_images';
  const [selectedImages, setSelectedImages] = useState([]);
  const [images, setImages] = useState(update["images"]);
  const [image, setImage] = useState(update["image"]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setImages(update["images"]);
  }, [update["images"]])

  useEffect(() => {
    setImage(update["image"]);
  }, [update["image"]])

  const handleSelectAll = () => {
    setSelectedImages(images.map(i => i.id))
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedImages((prev) => {
      const newSelectedImages = checked
        ? [...new Set([...prev, parseInt(value)])] // Add value if checked
        : prev.filter((item) => parseInt(item) !== parseInt(value)); // Remove value if unchecked

      return newSelectedImages;
    });
  };

  const handleFileGalleryChange = (e) => {
    const files = e.target.files;
    const action = "gallery";
    addImage(files, action);
  };

  const handleFileMainImageChange = (e) => {
    const files = e.target.files;
    const action = "image";
    addImage(files, action);
  }
  const clickAddImages = () => {
    fileInputRef.current.click();
  };

  const clickAddMainImage = () => {
    fileInputRef1.current.click();
  };

  const addImage = (files, action) => {
    setProcessing(true);
    const product_id = update["id"];
    const formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('action', action);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) formData.append('files[]', file);
    }
    axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        // Handle the response
        console.log("upload images response:", response);
        let { error, updated, message, action } = response.data;
        if (error) {
          console.log(message);
        }

        if (action === "gallery") {
          setImages(updated["images"]);
          onUpdate(updated);
        } else {
          setImage(updated["image"]);
          onUpdate(updated);
        }
        setProcessing(false);
      })
      .catch((error) => {
        setProcessing(false);
        // Handle the error
        console.error("upload images error:", error);
      });
  }

  const deleteImages = () => {
    setProcessing(true);
    const product_id = update["id"];
    const formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('remove_ids', selectedImages);
    axios.post(API_URL + "/delete", formData)
      .then((response) => {
        // Handle the response
        console.log("delete images response:", response);
        let { updated } = response.data;
        if (updated) {
          setImages(updated["images"])
          onUpdate(updated);
        }
        setSelectedImages([]);
        setProcessing(false);
      })
      .catch((error) => {
        // Handle the error
        console.error("delete images error:", error);
        setProcessing(false);
      });
  }

  const postSetGenericImageAttachments = () => {
    setProcessing(true);
    const product_id = update["id"];
    console.log("data", update);
    if (product_id) {
      const formData = new FormData();
      formData.append('product_id', product_id);
      formData.append('length_width', update['cf_length_width']);
      formData.append('grade', update['cf_grade']);
      formData.append('condition', update['cf_condition']);
      formData.append('selectionoptions', update['cf_selectionoptions']);
      formData.append('height', update['cf_height']);
      axios.post(API_URL + "/apply_generic_images", formData)
        .then((response) => {
          // Handle the response
          console.log("generic images response:", response);
          let { updated } = response.data;
          setImages(updated["images"]);
          setImage(updated["image"]);
          onUpdate(updated);
          setProcessing(false);
        })
        .catch((error) => {
          // Handle the error
          console.error("generic images error:", error.response);
          // console.log("message", message)
          const {message} = error.response.data;
          Swal.fire({
            title:message,
            text: "Set Generic Image Attachment feature did not find any relative product base on condition, grade, size and height from the published status. Please upload images instead."
          });
          setProcessing(false);
        });
    }
  }


  return (
    <div className="p-5">
      <div className="font-bold text-lg m">Product Images</div>
      <div>{update["name"]}</div>
      <div className="font-bold mb-3 mt-5">Thumbnail</div>
      <input type="file" ref={fileInputRef1} onChange={handleFileMainImageChange} name="thumbnailUploader" className="hidden" />
      <ul className="flex gap-3 flex-wrap">
        {image === false && <li className="relative overflow-hidden rounded-md">
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className={`${processing ? "" : "hidden"} absolute w-full h-full top-0 left-0 z-[2] flex justify-center items-center`}>
            <div>
              <Icon icon="gg:spinner-two" className="animate-spin text-4xl" />
            </div>
          </div>
          <button onClick={() => clickAddMainImage()} className={`border-[4px] border-dashed border-indigo-500 rounded-md w-[10em] h-[10em] text-indigo-500 ${processing ? "pointer-events-none" : ""}`}>
            +
          </button>
        </li>
        }
        {image !== false && <li className={`cursor-pointer relative rounded-md overflow-hidden ${processing ? "pointer-events-none" : ""}`} onClick={() => clickAddMainImage()}>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className={`${processing ? "" : "hidden"} absolute w-full h-full top-0 left-0 z-[2] flex justify-center items-center`}>
            <div>
              <Icon icon="gg:spinner-two" className="animate-spin text-4xl" />
            </div>
          </div>
          <div className="border-[4px] border-dashed border-indigo-500 w-full h-full">
            <img src={image} alt={image.split("/").pop()} className="object-contain w-[10em] h-[10em]" />
          </div>
        </li>
        }
      </ul>

      <div className="w-full flex items-center mb-3 mt-5 gap-5">
        <div className="font-bold">Manage Images</div>
      </div>
      {
        selectedImages.length > 0 &&
        <div className="w-full flex items-center mb-3 mt-5 gap-5 flex-wrap">
          <div className={`cursor-pointer text-stone-700 font-medium hover:text-stone-500 ${processing ? "pointer-events-none" : ""}`} onClick={handleSelectAll}>Select All</div>
          <div className={`cursor-pointer text-stone-700 font-medium hover:text-stone-500 ${processing ? "pointer-events-none" : ""}`} onClick={() => setSelectedImages([])}>Clear Selection</div>
          <div className={`cursor-pointer text-red-700 font-medium hover:text-stone-500 ${processing ? "pointer-events-none" : ""}`} onClick={deleteImages}>Remove</div>
        </div>

      }
      <input type="file" ref={fileInputRef} multiple onChange={handleFileGalleryChange} name="imgUploader" className="hidden" />
      <ul className="flex gap-3 flex-wrap">
        <li className="relative overflow-hidden rounded-md">
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className={`${processing ? "" : "hidden"} absolute w-full h-full top-0 left-0 z-[2] flex justify-center items-center`}>
            <div>
              <Icon icon="gg:spinner-two" className="animate-spin text-4xl" />
            </div>
          </div>
          <button onClick={() => clickAddImages()} className={`border-[4px] border-dashed border-indigo-500 rounded-md w-[8em] h-[8em] text-indigo-500 ${processing ? "pointer-events-none" : ""}`}>
            +
          </button>
        </li>
        {images.length > 0 && images.map((option) => (
          <li key={option.id} className="border border-stone-300 relative rounded-[7px] overflow-hidden w-[8em] h-[8em]" >
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className={`${processing ? "" : "hidden"} absolute w-full h-full top-0 left-0 z-[2] flex justify-center items-center`}>
              <div>
                <Icon icon="gg:spinner-two" className="animate-spin text-4xl" />
              </div>
            </div>
            <div className="absolute top-[2px] right-[2px] z-[1]">
              <input key={option.id} type="checkbox" value={option.id} checked={selectedImages.includes(option.id)} onChange={handleCheckboxChange} className={`${processing ? "pointer-events-none" : ""}`} />
            </div>
            {
              option.url && <img src={option.url} alt={option.url.split("/").pop()} className="object-contain w-full h-full  transition-transform duration-300 ease-in-out transform hover:scale-125" />
            }
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <button className="bg-stone-800 text-white hover:bg-stone-700 px-3 py-1 rounded-sm" onClick={postSetGenericImageAttachments}>Set Generic Image Attachements</button>
      </div>
    </div>
  );
};

export default InputImages;