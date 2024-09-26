const slug = (str, separator) => {
  const pattern = new RegExp(`[^a-zA-Z0-9${separator}]`, "g");
  return str.replace(pattern, "").replaceAll(separator, "_").toLowerCase();
};

//  dropdown options

const locationOptions = [{ id: "Atlanta, GA", label: "Atlanta, GA" }];
const sizeOptions = [
  { id: "10'", label: "10'" },
  { id: "20'", label: "20'" },
  { id: "40'", label: "40'" },
  { id: "45'", label: "45'" },
  { id: "53'", label: "53'" },
  { id: "Other", label: "Other" },
];
const heightOptions = [
  { id: `8' 6" Standard`, label: `8' 6" Standard` },
  { id: `9' 6" High Cube (HC)`, label: `9' 6" High Cube (HC)` },
];
const gradeOptions = [
  { id: `Wind and Water tight (WWT)`, label: `Wind and Water tight (WWT)` },
  { id: `Cargo Worthy (CW)`, label: `Cargo Worthy (CW)` },
  { id: `AS IS`, label: `AS IS` },
  { id: `IICL`, label: `IICL` },
];
const conditionOptions = [
  { id: `New`, label: `New` },
  { id: `Used`, label: `Used` },
  { id: `Refurbished`, label: `Refurbished` },
];
const selectionOptions = [
  { id: `First off the Stack (FO)`, label: `First off the Stack (FO)` },
  { id: `Exclusive Pool (EP)`, label: `Exclusive Pool (EP)` },
  { id: `You Pick (UP)`, label: `You Pick (UP)` },
];
const salesTagsOptions = [
  { id: "", label: "- Select -" },
  { id: `bestseller`, label: `Bestseller` },
  { id: `top choice`, label: `Top Choice` },
];
const paymentTypeOptions = [
  { id: `buy`, label: `Buy` },
  { id: `rental-12`, label: `Rental 12months+` },
  { id: `rental-6`, label: `Rental 6months+` },
  { id: `rental-3`, label: `Rental 3months+` },
  { id: `rto-48`, label: `Rent-To-Own 48months` },
  { id: `rto-36`, label: `Rent-To-Own 36months` },
  { id: `rto-24`, label: `Rent-To-Own 24months` },
  { id: `rto-12`, label: `Rent-To-Own 12months` },
];

export const form_fields = [
  {
    property_name: "title",
    value:"",
  },
  {
    property_name: "price",
    value:0,
  },
  {
    property_name: "container_title",
    value:"",
    // value: "RTest Used 20 ft Shipping Cointainer Standard 8 ft 6 in High | Used Cargo Worthy CW",
  },
  {
    property_name: "container_grade_title",
    value:"",
    // value: "Used Cargo Worthy CW Conex Storage Container",
  },
  {
    property_name: "container_type",
    value:"",
    // value: "Dry Van Shipping Container With Double Doors at 1 End",
  },
  {
    property_name: "categories",
    value:[],
  },
  {
    property_name: "sku",
    value:"",
  },
  {
    property_name: "location",
    // value:"",
    value: "",
  },
  {
    property_name: "length_width",
    // value:"",
    value: "20'",
  },
  {
    property_name: "height",
    // value:"",
    value: `8' 6" Standard`,
  },
  {
    property_name: "grade",
    value: `Wind and Water tight (WWT)`,
  },
  {
    property_name: "condition",
    value: `Used`,
  },
  {
    property_name: "selectionoptions",
    value: `First of the Stack (FO)`,
  },
  {
    property_name: "doortype",
    value: "Double Doors at 1 End",
  },
  {
    property_name: "sales_tags",
    value: "bestseller",
  },
  // {
  //   property_name: "store_id",
  //   value:"121"
  // },
  {
    property_name: "payment_type",
    value: "buy",
  },
  {
    property_name: "reefer_container",
    value: true,
  },
  {
    property_name: "reefer_container_status",
    value: true,
  },
];

export const form_object = [
  {
    name: "Product Details",
    group_style: "",
    elements: [
      {
        label: "Title",
        property_name: "title",
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      // {
      //   label: "Description",
      //   property_name: "description",
      //   type: "text",
      //   validation: {},
      //   tailwind_style: "",
      //   props: {},
      // },
      {
        label: "SKU (Auto-generated)",
        property_name: "sku",
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Price",
        property_name: "price",
        type: "number",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Category",
        property_name: "categories",
        type: "product_category",
        validation: {},
        tailwind_style: "",
        props: {},
      },
    ],
  },
  {
    name: "Container Details",
    group_style: "",
    elements: [
      {
        label: "Title (Auto-generated)",
        property_name: "container_title",
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Grade Title",
        property_name: "container_grade_title",
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Type",
        property_name: "container_type",
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
    ],
  },
  {
    name: "Specifications",
    group_style: "grid grid-cols-1 sm:grid-cols-2 md:sm:grid-cols-3 gap-2",
    elements: [
      {
        label: "Location",
        property_name: "location",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: locationOptions,
        value: "Atlanta, GA",
      },
      {
        label: "Size",
        property_name: "length_width",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: sizeOptions,
        value: "10'",
      },
      {
        label: "Height",
        property_name: "height",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: heightOptions,
        value: `8' 6" Standard`,
      },
      {
        label: "Grade",
        property_name: "grade",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: gradeOptions,
        value: `Wind and Water tight (WWT)`,
      },
      {
        label: "Condition",
        property_name: "condition",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: conditionOptions,
        value: `New`,
      },
      {
        label: "Selection Type",
        property_name: "selectionoptions",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: selectionOptions,
        value: `First of the Stack (FO)`,
      },
      {
        label: "Door Type",
        property_name: "doortype",
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
    ],
  },
  {
    name: "Other Options",
    group_style: "grid grid-cols-1 sm:grid-cols-2 md:sm:grid-cols-3 gap-2",
    elements: [
      {
        label: "Sales Tags",
        property_name: "sales_tags",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: salesTagsOptions,
        value: "",
        style: "col-span-1 sm:col-span-2 md:col-span-2",
      },
      // {
      //   label: "Store ID",
      //   property_name: "store_id",
      //   type: "text",
      //   validation: {},
      //   tailwind_style: "",
      //   props: {},
      // },
      {
        label: "Payment Type",
        property_name: "payment_type",
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: paymentTypeOptions,
        value: "Buy",
        style: "col-span-1 sm:col-span-2 md:col-span-2",
      },
    ],
  },
  {
    name: "Reefer Options",
    group_style: "grid grid-cols-1 sm:grid-cols-2 md:sm:grid-cols-3 gap-2",
    elements: [
      {
        label: "Reefer Container",
        property_name: slug("Reefer Container", " "),
        type: "checkbox",
        validation: {},
        tailwind_style: "",
        props: {},
        style: "col-span-3",
      },
      {
        label: "Reefer Container Status",
        property_name: slug("Reefer Container Status", " "),
        type: "toggle",
        validation: {},
        tailwind_style: "",
        props: {},
        style: "col-span-3",
      },
    ],
  },
];
