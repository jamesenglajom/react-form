import logo from "./logo.svg";
import "./App.css";
import ProductDetailsForm from "./components/form/product_details";
import ProductsDetailsForm from "./components/form/product_details";

function App() {
  return (
    <div className="App">
      <main>
        <ProductsDetailsForm />
      </main>
    </div>
  );
}

export default App;
