import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BsBagCheck, BsBicycle, BsShop } from 'react-icons/bs'
import { IoIosArrowBack } from 'react-icons/io'
import { BASE_URL } from '../constatns'
import { useGlobalContext } from '../context'
import { Link, useNavigate } from 'react-router-dom'

const Options = () => {
  const { t, i18n } = useTranslation()
  const { storeData, cartData } = useGlobalContext()
  const navigate = useNavigate()
  const errMessage = t('customerData:fieldRequired')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    if (cartData?.length === 0) return
    if (data.delivery === 'in_restaurant') {
      navigate(`/in-restaurant`)
    } else {
      navigate(`/delivery?option=${data.delivery}`)
    }
  }

  return (
    <>
      <div className="w-full sticky z-[50] inset-0 bg-white max-w-md mx-auto h-16 top-auto shadow-[1px_1px_8px_#597c8066] py-1 flex items-center justify-between gap-2 dark:bg-gray-700">
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
          onClick={() => navigate(-1)}
        />
      </div>
      <form
        className="w-full h-full flex flex-col py-[10rem] gap-3 px-4 bg-white animateItems dark:bg-gray-700"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          {errors?.delivery && (
            <small className="text-red-500 text-center">
              {errors.delivery.message}
            </small>
          )}
          <div className="flex flex-col items-center justify-center gap-8 py-4">
            {storeData?.tables ? (
              <div>
                <input
                  type="radio"
                  className="hidden peer"
                  id="in_restaurant"
                  value="in_restaurant"
                  {...register("delivery", {
                    required: {
                      value: true,
                      message: errMessage,
                    },
                  })}
                />
                <label
                  className={`peer-checked:border-main peer-checked:bg-main text-gray-700 peer-checked:text-white flex flex-col items-center justify-center gap-3 border w-44 h-28 p-2 rounded-md dark:text-white ${
                    errors.delivery ? "border-red-500" : "border-gray-400"
                  }`}
                  htmlFor="in_restaurant"
                >
                  <BsShop className="text-5xl" />
                  <span className="text-sm">
                    {t("customerData:inRestaurant")}
                  </span>
                </label>
              </div>
            ) : null}
            <div>
              <input
                type="radio"
                className="hidden peer"
                id="deliver_home"
                value="deliver_home"
                {...register("delivery", {
                  required: {
                    value: true,
                    message: errMessage,
                  },
                })}
              />
              <label
                className={`peer-checked:border-main peer-checked:bg-main text-gray-700 peer-checked:text-white flex flex-col items-center justify-center gap-3 border p-2 w-44 h-28 rounded-md dark:text-white ${
                  errors.delivery ? "border-red-500" : "border-gray-400"
                }`}
                htmlFor="deliver_home"
              >
                <BsBicycle className="text-5xl" />
                <span className="text-sm">{t("customerData:delivery")}</span>
              </label>
              <span className="text-xs text-gray-700 dark:text-white">
                {t("customerData:deliveryFees")}
              </span>
            </div>
            {/* <div>
              <input
                type="radio"
                className="hidden peer"
                id="from_store"
                value="from_store"
                {...register("delivery", {
                  required: {
                    value: true,
                    message: errMessage,
                  },
                })}
              />
              <label
                className={`peer-checked:border-main peer-checked:bg-main text-gray-700 peer-checked:text-white flex flex-col dark:text-white items-center justify-center gap-3 border p-2 w-44 h-28 rounded-md ${
                  errors.delivery ? "border-red-500" : "border-gray-400"
                }`}
                htmlFor="from_store"
              >
                <BsBagCheck className="text-5xl" />
                <span className="text-sm">
                  {t("customerData:branchReceipt")}
                </span>
              </label>
            </div> */}
          </div>
        </div>
        <button
          className="bg-main font-semibold hover:bg-main transition text-white py-2 w-full rounded-full"
          type="submit"
        >
          {t("cart:next")}
        </button>
      </form>
    </>
  );
}

export default Options
