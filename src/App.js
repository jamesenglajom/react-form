import "./App.css";
import {NavLink,Route,Routes} from "react-router-dom"
// pages
import { Home } from "./pages/Home"
import ShippingContainersPage from "./pages/ShippingContainers";
import { InventoryPage } from "./pages/Inventory";

function App() {
  return (
    <div className="App">
      <nav className="w-full bg-stone-900 p-5">
        <ul  className="flex items-center gap-5">
          <li>
            <NavLink  className={({isActive}) => isActive ? 'bg-slate-600 rounded p-1 text-white': 'rounded p-1 text-white'} to="/">Home</NavLink>
          </li>
          <li>
            <NavLink  className={({isActive}) => isActive ? 'bg-slate-600 rounded p-1 text-white': 'rounded p-1 text-white'} to="/shipping-containers">Shipping Containers</NavLink>
          </li>
          <li>
            <NavLink  className={({isActive}) => isActive ? 'bg-slate-600 rounded p-1 text-white': 'rounded p-1 text-white'} to="/inventory">Inventory</NavLink>
          </li>
        </ul>
      </nav>
      {/* <main>
        <div className="p-5">
          <ProductsTable />
        </div>
      </main> */}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/shipping-containers" element={<ShippingContainersPage />}/>
        <Route path="/inventory" element={<InventoryPage />}/>
      </Routes>
    </div>
  );
}

export default App;
