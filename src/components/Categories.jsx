import { useTranslation } from 'react-i18next'
import { BASE_URL } from '../constatns'

const Categories = ({ data, value, setValue }) => {
  const { i18n } = useTranslation()

  return (
    <div className='p-2 flex gap-2 overflow-x-auto dark:bg-gray-700 whitespace-nowrap w-full z-[50] inset-0 bg-white shadow-[0_1px_2px_rgb(0,0,0,5%) hide-scrollbar'>
      {data.map((item, i) => (
        <span
          className={`inline-flex items-center font-bold h-10 whitespace-nowrap justify-center rounded-full flex-row-reverse gap-2 text-sm px-6 py-1 dark:bg-gray-900 dark:text-white cursor-pointer ${
            value === i ? 'text-white bg-main dark:bg-main' : 'bg-gray-100'
          }`}
          onClick={() => setValue(i)}
          key={i}
        >
          <span className='text-xs whitespace-nowrap font-semibold'>
            {i18n.language === 'en'
              ? item?.en_category_name
              : item?.category_name}
          </span>
          <img
            src={`${BASE_URL + item?.logo || '../img/logo.png'}`}
            alt={`${
              i18n.language === 'en'
                ? item?.en_category_name
                : item?.category_name
            }`}
            width='24'
            height='24'
            className='z-10'
          />
        </span>
      ))}
    </div>
  )
}

export default Categories
