import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5'
import { IoMdAddCircle, IoIosArrowBack } from 'react-icons/io'

import useDarkMode from '../hooks/useDarkMode'
import { useGlobalContext } from '../context'
import { BASE_URL } from '../constatns'
import axios from 'axios'
import { Loader } from '../components'

const SingleItem = () => {
  const { productId, offerId } = useParams()

  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    if (offerId) {
      axios
        .get(`${BASE_URL}/offers/${offerId}`)
        .then((data) => setData(data?.data))
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false))
    } else {
      axios
        .get(`${BASE_URL}/products/${productId}`)
        .then((data) => setData(data?.data))
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false))
    }
  }, [productId, offerId])

  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [size, setSize] = useState(
    data?.options?.length
      ? data.options[0]
      : { name: '', en_name: '', price: 0 }
  )

  console.log(selectedAddons)

  const { cartData, setCartData, storeData } = useGlobalContext()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  useDarkMode()

  const add = () => setQuantity((prev) => prev + 1)
  const remove = () => {
    if (quantity === 1) return
    setQuantity((prev) => prev - 1)
  }

  const addToCart = () => {
    const newCartItem = {
      name: data?.name,
      en_name: data?.en_name,
      img: BASE_URL + data?.image,
      details: data?.details,
      en_details: data?.en_details,
      quantity,
      price: price * quantity,
      size,
      addons: selectedAddons,
    }

    const existingItemIndex = cartData.findIndex(
      (item) =>
        item.id === newCartItem.id &&
        item.name === newCartItem.name &&
        item.size?.name === newCartItem.size?.name &&
        item.addons
          .map((e) => e.name)
          .sort()
          .toString() ===
          newCartItem.addons
            .map((e) => e.name)
            .sort()
            .toString()
    )
    if (existingItemIndex !== -1) {
      cartData[existingItemIndex].quantity += newCartItem.quantity
      cartData[existingItemIndex].price += newCartItem.price
      setCartData([...cartData])
    } else {
      setCartData([...cartData, newCartItem])
    }
    setQuantity(1)
    navigate(-1)
  }

  // SIZE
  const onSizeChange = (e) => {
    // Get selected size from input value
    const selectedSize = e ? data.options[e.target.id] : data?.options[0]
    const previousSize = size

    setSize(selectedSize)
    setPrice((prev) => prev - previousSize.price + selectedSize.price)
  }

  useEffect(() => {
    if (data?.name) {
      if (data?.options?.length) onSizeChange()
      else setPrice(data?.price)
    }
  }, [data])

  // ADDONS
  const onAddonsChange = (e) => {
    // Get selected addon from input value
    const selectedAdd = data.options2?.find(
      (item) => item.name === e.target.value
    )
    if (e.target.checked === true) {
      setSelectedAddons((prev) => [...prev, selectedAdd])
      setPrice((prev) => prev + selectedAdd.price)
    } else {
      setSelectedAddons((prev) =>
        prev.filter((item) => item.name !== selectedAdd.name)
      )
      setPrice((prev) => prev - selectedAdd.price)
    }
  }

  return (
    <div
      dir={i18n.language === "en" ? "ltr" : "rtl"}
      className="fixed overflow-y-auto inset-x-0 max-w-md md:ml-auto md:mr-0 mx-auto h-full bg-white overflow-x-hidden w-full z-[401] fastAnimate dark:bg-gray-700"
    >
      <div className="z-50 fixed w-full bg-white max-w-md mx-auto h-16 top-auto shadow-[1px_1px_8px_#597c8066] py-1 flex items-center justify-between gap-2 dark:bg-gray-700">
        <div className="col-span-9 grid grid-cols-12 justify-start items-center">
          <Link
            to="/"
            className={`col-span-10 pr-4 text-md font-semibold text-gray-500 dark:text-white overflow-y-hidden flex items-center cursor-pointer gap-2  ${
              i18n.language === "en" ? "pl-4" : "pr-4"
            }`}
          >
            <img
              src={BASE_URL + storeData?.image}
              alt={storeData?.name}
              className=" w-[56px] h-[57px]"
            />
            <h1 className="font-extrabold flex gap-0.5 flex-col text-md text-main dark:text-white whitespace-nowrap">
              <span>{storeData?.name}</span>
              <span>{storeData?.eng_name}</span>
            </h1>
          </Link>
        </div>
        <IoIosArrowBack
          className={`w-10 h-10 rounded-full text-main hover:bg-main hover:text-white dark:text-white transition p-2 cursor-pointer ${
            i18n.language === "en" ? "mr-4 rotate-180" : "ml-4"
          }`}
          title="رجوع"
          onClick={() => navigate("/")}
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 flex flex-col w-full pt-16">
          <div className="flex flex-col justify-center text-center gap-4 mb-12 mt-5 dark:text-white">
            <img
              src={BASE_URL + data?.image}
              alt={i18n.language === "en" ? data?.en_name : data?.name}
              className="w-full h-full object-scale-down rounded-lg dark:bg-white"
            />
            <h2 className="text-2xl text-main dark:text-white">
              {i18n.language === "en" ? data?.en_name : data?.name}
            </h2>
            {data?.calories ? (
              <span className="py-1 px-3 text-xs w-fit mx-auto rounded-full text-white bg-gray-900">
                {data?.calories} {t("singleProduct:kcal")}
              </span>
            ) : null}
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {i18n.language === "en" ? data?.en_details : data?.details}
            </p>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-main bg-[#f3f4f6] py-1 rounded-full w-full text-center dark:bg-gray-900 dark:text-white">
                {t("singleProduct:quantity")}
              </h4>
              <div className="flex items-center justify-center gap-4 select-none">
                <IoRemoveCircleOutline
                  className={`text-4xl ${
                    quantity === 1
                      ? "text-[#0000004d] dark:text-[#9ca3af]"
                      : "text-main"
                  } cursor-pointer selected-none`}
                  onClick={remove}
                />
                <span className="text-xl">{quantity}</span>
                <IoAddCircleOutline
                  className="text-4xl text-main cursor-pointer"
                  onClick={add}
                />
              </div>
            </div>
            {data?.options?.length ? (
              <div className="flex flex-col gap-4">
                <h4 className="text-lg text-main bg-[#f3f4f6] py-1 rounded-full w-full text-center dark:bg-gray-900 dark:text-white">
                  {t("singleProduct:size")}
                </h4>
                <div className="flex items-center justify-center flex-wrap gap-3 md:gap-5">
                  {data?.options.map((option, i) => (
                    <div key={i}>
                      <input
                        type="radio"
                        name="size"
                        id={i}
                        className="hidden peer"
                        value={option.name}
                        defaultChecked={option.name === data?.options[0].name}
                        onChange={onSizeChange}
                      />
                      <label
                        htmlFor={i}
                        className="py-1 whitespace-wrap md:px-6 px-4 text-sm md:text-base bg-[#f3f4f6] rounded-full bg-transparent text-main peer-checked:text-white peer-checked:bg-main dark:bg-gray-900 dark:text-white"
                      >
                        {i18n.language === "en" ? option.en_name : option.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {data?.options2?.length ? (
              <div className="flex flex-col gap-4">
                <h4 className="text-lg text-main bg-[#f3f4f6] py-1 rounded-full w-full text-center dark:bg-gray-900 dark:text-white">
                  {t("singleProduct:options")}
                </h4>
                <div className="flex items-center flex-wrap justify-center gap-x-1 gap-y-5">
                  {data?.options2?.map((extra, i) => (
                    <div key={i}>
                      <input
                        type="checkbox"
                        name="addons"
                        id={extra.name}
                        value={extra.name}
                        className="hidden peer"
                        onChange={onAddonsChange}
                      />
                      <label
                        htmlFor={extra.name}
                        className="py-2 px-4 bg-[#f3f4f6] rounded-full bg-transparent text-main peer-checked:text-white peer-checked:bg-main dark:bg-gray-900 dark:text-white whitespace-nowrap"
                      >
                        {i18n.language === "en" ? extra.en_name : extra.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <button
            className="font-semibold flex items-center justify-center bg-main text-white rounded-full gap-2 border-2 border-main py-2 px-4 w-full "
            onClick={addToCart}
          >
            <span className="flex items-center gap-2">
              <IoMdAddCircle className="text-2xl text-white" /> {t("cart:add")}
            </span>
            {data ? (
              <span className="text-md font-semibold whitespace-nowrap">
                {(price * quantity).toLocaleString("en-US")}{" "}
                {t("singleProduct:pound")}
              </span>
            ) : null}
          </button>
        </div>
      )}
    </div>
  );
}

export default SingleItem
