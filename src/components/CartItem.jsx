import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoRemoveCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import { FiX } from "react-icons/fi";

import { useGlobalContext } from "../context";

const CartItem = ({ item, done = false }) => {
  const { setCartData } = useGlobalContext();
  const [oldPrice] = useState(item.price / item.quantity);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const add = () => {
    setCartData((prev) => {
      ++item.quantity;
      item.price = oldPrice * item.quantity;
      return [...prev];
    });
  };
  const remove = () => {
    if (item.quantity === 1) return;
    setCartData((prev) => {
      --item.quantity;
      item.price = oldPrice * item.quantity;
      return [...prev];
    });
  };
  const removeItem = (product) => {
    setCartData((prev) => {
      return prev.filter((item) => {
        if (
          item.id !== product.id ||
          item.name !== product.name ||
          item.size.name !== product.size.name ||
          item.addons
            .map((e) => e.name)
            .sort()
            .toString() !==
            product.addons
              .map((e) => e.name)
              .sort()
              .toString()
        ) {
          return true;
        }
        return false;
      });
    });
  };

  return (
    <div className={`w-full ${done ? "pointer-events-none" : ""}`}>
      <div className="w-full h-28 rounded-lg grid grid-cols-12 gap-2 cursor-pointer bg-gray-100 dark:bg-gray-900">
        <div className="relative w-full rounded-lg col-span-4 sm:col-span-3 flex items-center justify-center">
          <div onClick={() => navigate(-1)}>
            <img
              className="absolute inset-0 w-full h-full p-0.5 object-cover rounded-lg"
              src={item.img}
              alt={i18n.language === "en" ? item.en_name : item.name}
            />
          </div>
        </div>
        <div className="w-full relative col-span-8 sm:col-span-9 space-y-1 sm:space-y-2 px-2 flex flex-col justify-between">
          <div className="mt-2 text-sm text-main font-semibold dark:text-white">
            {i18n.language === "en"
              ? item.en_name.length > 15
                ? `${item.en_name.slice(0, 20)}...`
                : item.en_name
              : item.name.length > 15
              ? `${item.name.slice(0, 25)}...`
              : item.name}
          </div>
          <div onClick={() => navigate(-1)} className="flex flex-col gap-1">
            {item?.size?.name?.length ? (
              <p className="text-xs text-gray-800 dark:text-gray-400 overflow-hidden">
                {t("singleProduct:size")} :{" "}
                {i18n.language === "ar" ? item.size.name : item.size.en_name}
              </p>
            ) : (
              <p className="text-xs text-gray-800 dark:text-gray-400 overflow-hidden">
                {i18n.language === "en"
                  ? item.en_details.length > 30
                    ? `${item.en_details.slice(0, 35)}...`
                    : item.en_details
                  : item.details.length > 30
                  ? `${item.details.slice(0, 35)}...`
                  : item.details}
              </p>
            )}
          </div>
          <div className="flex justify-between py-2 items-center w-full">
            <div className="flex items-center justify-center gap-2 dark:text-white select-none">
              <IoRemoveCircleOutline
                className={`text-3xl ${
                  item.quantity === 1
                    ? "text-[#0000004d] dark:text-[#9ca3af]"
                    : "text-main"
                } cursor-pointer selected-none`}
                onClick={remove}
              />
              <span>{item.quantity}</span>
              <IoAddCircleOutline
                className="text-3xl text-main cursor-pointer"
                onClick={add}
              />
            </div>
            <span
              className={`text-sm flex items-center font-semibold dark:text-white`}
            >
              {item.price ? item.price.toLocaleString("en-US") : null}
              <span className="text-main dark:text-white text-xs font-semibold mx-0.5">
                {t("singleProduct:pound")}
              </span>
            </span>
            {!done && (
              <FiX
                className={`w-5 absolute -top-2 h-5 p-0.5 rounded-full bg-red-600 text-gray-50 hover:bg-opacity-100 opacity-80 dark:bg-red-600 dark:text-gray-50 block transform hover:rotate-180 cursor-pointer transition duration-300 ease ${
                  i18n.language === "en" ? "-right-2" : "-left-2"
                }`}
                onClick={() => removeItem(item)}
              />
            )}
          </div>
        </div>
      </div>
      {item?.addons?.length > 0 ? (
        <ul className="text-xs flex items-center flex-wrap gap-2 w-[90%] mx-auto py-[.2rem] justify-center text-center rounded-bl-lg rounded-br-lg px-2 bg-main text-gray-900 text-white">
          {t("singleProduct:options")} :
          {item?.addons?.map((e, i) => (
            <li
              key={i}
              className="text-[.68rem] text-gray-900 whitespace-nowrap text-white"
            >
              {i18n.language === "ar" ? e.name : e.en_name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default CartItem;
