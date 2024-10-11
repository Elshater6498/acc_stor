import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { IoIosArrowBack } from 'react-icons/io'
import { BsGeoAlt, BsPerson, BsPhone } from 'react-icons/bs'

import useDarkMode from '../hooks/useDarkMode'
import { useGlobalContext } from '../context'
import { BASE_URL } from '../constatns'

const Delivery = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const egyptianNumberRegex = /^01[0-2,5]{1}[0-9]{8}$/
  const errMessage = t('customerData:fieldRequired')
  useDarkMode()
  let [searchParams] = useSearchParams()

  const { cartData, setCartData, storeData } = useGlobalContext()

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    // Handle Message
    const total = cartData
      .reduce((acc, item) => acc + item.price, 0)
      .toLocaleString('en-US')
    const date = new Date(Date.now())
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'مساءً' : 'صباحاً'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    const time = `${hours}:${minutes} ${ampm}`

    const orderTotal = cartData.reduce((acc, item) => acc + item.price, 0)

    const message = `%0A%2A نوع الطلب %2A%3A ${
      searchParams.get('option') === 'deliver_home'
        ? 'توصيل'
        : 'استلام من الفرع'
    } %0A%2A اسم العميل %2A%3A ${data?.name} %0A%2A رقم العميل %2A%3A ${
      data?.phone
    } ${
      searchParams.get('option') === 'deliver_home'
        ? `%0A%2A عنوان العميل %2A%3A ${data?.address}`
        : ''
    } %0A---------------------------%0A${cartData
      .map((item) => {
        let addons = ''
        if (item.addons && item.addons.length > 0) {
          addons = `%2A الإضافات %2A%3A %0A${item?.addons
            ?.map((e) => `%20 %20 • ${e.option_1}`)
            .join('%0A')} %0A`
        }
        return `%2A الصنف %2A%3A ${item.name} %0A%2A الكمية %2A%3A ${item.quantity} %0A%2A السعر %2A%3A ${
          item.price
        } جنيه`
      })
      .join(
        '%0A---------------------------%0A'
      )}%0A---------------------------%0A%2A مبلغ الطلب %2A%3A ${total} جنيه %0A%2A المجموع %2A%3A ${orderTotal.toLocaleString(
      'en-US'
    )} جنيه %0A%2A وقت الطلب %2A%3A ${time}`

    window.open(
      `https://api.whatsapp.com/send?phone=+2${storeData?.whatsapp}&text=${message}`
    )
    reset()
    toast.success('تم تأكيد الطلب بنجاح')
    navigate('/')
    setCartData([])
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
        className="w-full h-full flex flex-col justify-end gap-3 px-4 bg-white animateItems dark:bg-gray-700"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className={`relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-main ${
              errors.name ? "border-red-500" : ""
            }`}
          >
            <input
              type="text"
              id="name"
              {...register("name", {
                required: { value: true, message: errMessage },
              })}
              autoComplete="off"
              placeholder={t("customerData:name")}
              className="peer h-8 w-full border-none dark:text-white bg-transparent py-0 px-6 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
            <BsPerson
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-lg peer-focus:text-main ${
                errors.name ? "text-red-500" : ""
              } ${i18n.language === "en" ? "left-0" : "right-0"}`}
            />
            <span className="absolute start-6 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-white">
              {t("customerData:name")}
            </span>
          </label>
          {errors.name ? (
            <span className="text-[10px] text-red-500">
              {errors.name.message}
            </span>
          ) : null}
        </div>
        {searchParams.get("option") === "deliver_home" ? (
          <div className="flex flex-col">
            <label
              htmlFor="address"
              className={`relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-main ${
                errors.address ? "border-red-500" : ""
              }`}
            >
              <input
                type="text"
                id="address"
                placeholder={t("customerData:address")}
                className="peer h-8 w-full border-none dark:text-white bg-transparent py-0 px-6 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                {...register("address", {
                  required: { value: true, message: errMessage },
                })}
              />
              <BsGeoAlt
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-lg peer-focus:text-main ${
                  errors.address ? "text-red-500" : ""
                } ${i18n.language === "en" ? "left-0" : "right-0"}`}
              />
              <span className="absolute start-6 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-white">
                {t("customerData:address")}
              </span>
            </label>
            {errors.address ? (
              <span className="text-[10px] text-red-500">
                {errors.address.message}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className={`relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-main ${
              errors.phone ? "border-red-500" : ""
            }`}
          >
            <input
              type="text"
              id="phone"
              placeholder={t("customerData:PhoneNumber")}
              {...register("phone", {
                required: { value: true, message: errMessage },
                pattern: {
                  value: egyptianNumberRegex,
                  message: t("customerData:invalidNumber"),
                },
              })}
              autoComplete="off"
              className="peer h-8 w-full border-none dark:text-white bg-transparent py-0 px-6 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
            <BsPhone
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-lg peer-focus:text-main ${
                errors.phone ? "text-red-500" : ""
              } ${i18n.language === "en" ? "left-0" : "right-0"}`}
            />
            <span className="absolute start-6 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-white">
              {t("customerData:PhoneNumber")}
            </span>
          </label>
          {errors.phone ? (
            <span className="text-[10px] text-red-500">
              {errors.phone.message}
            </span>
          ) : null}
        </div>
        <button
          className="bg-main font-semibold hover:bg-main transition text-white py-2 w-full rounded-full"
          type="submit"
        >
          {t("customerData:submitRequest")}
        </button>
      </form>
    </>
  );
}

export default Delivery
