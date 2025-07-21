import { Button } from "antd";
import ProductList from "./components/ProductList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Management</h1>
      <Button type="primary" style={{ marginBottom: "16px" }}>
        Add Product
      </Button>
      <ProductList />
    </div>
  );
}

export default App;
