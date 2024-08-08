const slug = (str, separator) => {
  const pattern = new RegExp(`[^a-zA-Z0-9${separator}]`, "g");
  return str.replace(pattern, "").replace(separator, "_").toLowerCase();
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
  { id: `First of the Stack (FO)`, label: `First of the Stack (FO)` },
  { id: `Exclusive Pool (EP)`, label: `Exclusive Pool (EP)` },
  { id: `You Pick (UP)`, label: `You Pick (UP)` },
];
const salesTagsOptions = [
  { id: "", label: "- Select -" },
  { id: `Bestseller`, label: `Bestseller` },
  { id: `Top Choice`, label: `Top Choice` },
];
const paymentTypeOptions = [
  { id: `Buy`, label: `Buy` },
  { id: `Rental`, label: `Rental` },
  { id: `Rent-To-Own`, label: `Rent-To-Own` },
];

export const form_fields = [
  {
    property_name: slug("Container Title", " "),
  },
  {
    property_name: slug("Container Grade Title", " "),
  },
  {
    property_name: slug("Container Type", " "),
  },
  {
    property_name: slug("Location", " "),
  },
  {
    property_name: slug("Size", " "),
  },
  {
    property_name: slug("Height", " "),
  },
  {
    property_name: slug("Grade", " "),
  },
  {
    property_name: slug("Condition", " "),
  },
  {
    property_name: slug("Selection Type", " "),
  },
  {
    property_name: slug("Door Type", " "),
  },
  {
    property_name: slug("Sales Tags", " "),
  },
  {
    property_name: slug("Store ID", " "),
  },
  {
    property_name: slug("Payment Type", " "),
  },
  {
    property_name: slug("Reefer Container", " "),
  },
  {
    property_name: slug("Reefer Container Status", " "),
  },
];

export const form_object = [
  {
    name: "Container Details",
    group_style: "",
    elements: [
      {
        label: "Title",
        property_name: slug("Container Title", " "),
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Grade Title",
        property_name: slug("Container Grade Title", " "),
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Type",
        property_name: slug("Container Type", " "),
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
        property_name: slug("Location", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: locationOptions,
        value: "Atlanta, GA",
      },
      {
        label: "Size",
        property_name: slug("Size", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: sizeOptions,
        value: "10'",
      },
      {
        label: "Height",
        property_name: slug("Height", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: heightOptions,
        value: `8' 6" Standard`,
      },
      {
        label: "Grade",
        property_name: slug("Grade", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: gradeOptions,
        value: `Wind and Water tight (WWT)`,
      },
      {
        label: "Condition",
        property_name: slug("Condition", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: conditionOptions,
        value: `New`,
      },
      {
        label: "Selection Type",
        property_name: slug("Selection Type", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: selectionOptions,
        value: `First of the Stack (FO)`,
      },
      {
        label: "Door Type",
        property_name: slug("Door Type", " "),
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
        property_name: slug("Sales Tags", " "),
        type: "dropdown",
        validation: {},
        tailwind_style: "",
        props: {},
        selection: salesTagsOptions,
        value: "",
      },
      {
        label: "Store ID",
        property_name: slug("Store ID", " "),
        type: "text",
        validation: {},
        tailwind_style: "",
        props: {},
      },
      {
        label: "Payment Type",
        property_name: slug("Payment Type", " "),
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
