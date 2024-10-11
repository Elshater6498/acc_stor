import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

import { BASE_URL } from "../constatns";

const CartContext = createContext();

export const AppProvider = ({ children }) => {
  const provider_id = 1;

  const getInitailCartData = () => {
    const cartData = localStorage.getItem("cart-data");
    return cartData ? JSON.parse(cartData) : [];
  };

  const [cartData, setCartData] = useState(getInitailCartData);
  const [storeData, setStoreData] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    axios
      .all([
        axios.get(`${BASE_URL}/providers/${provider_id}`),
        axios.get(`${BASE_URL}/categories?provider_id=${provider_id}`),
      ])
      .then(
        axios.spread((storeData, categories) => {
          setStoreData(storeData.data);
          setCategories(categories.data);
        })
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getData();
    localStorage.setItem("cart-data", JSON.stringify(cartData));
  }, [cartData]);

  return (
    <CartContext.Provider
      value={{
        cartData,
        setCartData,
        provider_id,
        storeData,
        categories,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useGlobalContext = () => useContext(CartContext);
