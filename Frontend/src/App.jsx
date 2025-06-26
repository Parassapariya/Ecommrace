import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


function App() {
  const [getproduct, setproduct] = useState([])

  useEffect(() => {
    axios.get('/api/product/AllProduct')
      .then(res =>
        setproduct(res.data)
      )
      .catch(err =>
        console.log(err)
      )
    setproduct(products)
  }, []) // empty dependency to run once on mount

  return (
    <>
      <h1>Display Product</h1>
      {
        getproduct.map((product) => (
          // Use parentheses to implicitly return JSX here
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
