import "./App.css";
import {NavLink,Route,Routes} from "react-router-dom"
// pages
import { Home } from "./pages/Home"
import ShippingContainersPage from "./pages/ShippingContainers";
import { InventoryPage } from "./pages/Inventory";

function App() {
  const handleConnecttoZoho = () => {
    const clientId = process.env.REACT_APP_ZOHO_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_ZOHO_REDIRECT_URI;  // Set this in your .env
    const scope = 'ZohoInventory.fullaccess.all'; 
    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&access_type=offline`;
    window.location.href = zohoAuthUrl;
  }
  return (
    <div className="App">
      <nav className="w-full bg-stone-900 p-5 flex justify-between">
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
        {/* <button onClick={handleConnecttoZoho} className="rounded bg-green-600 p-1 hover:bg-green-500">Connect to Zoho</button> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/shipping-containers" element={<ShippingContainersPage />}/>
        <Route path="/inventory" element={<InventoryPage />}/>
      </Routes>
    </div>
  );
}

export default App;
