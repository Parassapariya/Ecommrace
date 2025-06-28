import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    axios.get('/api/product/AllProduct')
      .then(res => {
        console.log("Response from API:", res.data);
        setProducts(res.data.product);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);


  return (
    <div>
      <h1>Product List</h1>
      {Array.isArray(products) && products.map(product => (
        <div key={product.id || product._id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}

    </div>
  );
}

export default App;
