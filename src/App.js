/* #version=0.0.0-0#9 default 2024-08-08T23:03:45 EA63D1A1D7520F */
/* #version=0.0.0-0#8 default 2024-08-08T23:03:32 D57C201F976F587C */
import logo from "./logo.svg";
import "./App.css";
import ProductsTable from "./components/table/products";
import ProductsDetailsForm from "./components/form/product_details";

function App() {
  
  return (
    <div className="App">
      <main>
      <div className="p-5">
        <ProductsTable />
      </div>
        <ProductsDetailsForm />
      </main>
    </div>
  );
}

export default App;
