import Item from './Item'
import { BASE_URL } from '../constatns'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from './Loader'
import { useTranslation } from 'react-i18next'

const Items = (props) => {
  const {
    isSubmitted,
    filteredItems,
    setModalOn,
    modalOn,
    singleItem,
    setSingleItem,
    provider_id,
    data,
    value,
  } = props

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const getData = () => {
    setLoading(true)
    axios
      .get(
        `${BASE_URL}/products/public?provider_id=${provider_id}&category_id=${data[value]?.id}`
      )
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.log(err)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()
  }, [value])

  return (
    <div className='w-full px-4 pb-4 mb-10 pt-2 flex flex-col gap-2 items-center bg-white dark:bg-gray-700'>
      {isSubmitted ? (
        filteredItems?.length === 0 ? (
          <div className='w-full flex items-center font-semibold gap-4 justify-center flex-col my-5 dark:text-white'>
            <img
              src='/img/delete.png'
              alt='not-found'
              width='100em'
              height='100em'
            />
            <h2 className='text-3xl text-center text-[#597c80] dark:text-white'>
              {t('search:noResults')}
            </h2>
          </div>
        ) : (
          filteredItems?.map((item, index) => (
            <Item
              item={item}
              key={index}
              setModalOn={setModalOn}
              setSingleItem={setSingleItem}
            />
          ))
        )
      ) : loading ? (
        <Loader />
      ) : products?.length ? (
        products?.map((item, index) => (
          <Item
            item={item}
            key={index}
            modalOn={modalOn}
            setModalOn={setModalOn}
            singleItem={singleItem}
            setSingleItem={setSingleItem}
          />
        ))
      ) : (
        <div className='w-full flex items-center font-semibold gap-4 justify-center flex-col my-5 dark:text-white'>
          <img
            src='/img/delete.png'
            alt='not-found'
            width='100em'
            height='100em'
          />
          <h2 className='text-3xl text-center text-[#597c80] dark:text-white'>
            {t('search:noResults')}
          </h2>
        </div>
      )}
    </div>
  )
}

export default Items
