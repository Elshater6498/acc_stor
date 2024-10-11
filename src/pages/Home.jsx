import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'

import { BASE_URL, FETCHER } from '../constatns'
import { useGlobalContext } from '../context'
import {
  Loader,
  TopNav,
  SearchBar,
  OffersSlider,
  Categories,
  SearchLabel,
  BottomBar,
  SideNav,
  Item,
} from '../components'

const Home = ({ categories, value, setValue, mainColor }) => {
  const inputRef = useRef()

  const [sideNav, setSideNav] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [searchValue, setSearchValue] = useState(inputRef.current?.value || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const { t } = useTranslation()

  const { provider_id } = useGlobalContext()

  const { data: storeData } = useSWR(
    `${BASE_URL}/providers/${provider_id}`,
    FETCHER
  )

  const { data: searchData } = useSWR(
    searchQuery
      ? `${BASE_URL}/products/search?provider_id=${provider_id}&search=${searchQuery}`
      : null,
    FETCHER
  )
  const { data: offers } = useSWR(
    `${BASE_URL}/offers/public?provider_id=${provider_id}`,
    FETCHER
  )

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(e.target[0].value)

    if (e.target[0].value.length > 0) {
      setIsSubmitted(true)
      setSearchValue(e.target[0].value)

      setFilteredItems(searchData)
      e.target[0].blur()
    }
    e.target[0].blur()
    document.documentElement.scrollTop = 0
  }

  const close = () => {
    setIsSubmitted(false)
    setFilteredItems([])
  }

  const getData = () => {
    setLoading(true)
    axios
      .get(
        `${BASE_URL}/products/public?provider_id=${provider_id}&category_id=${categories[value]?.id}`
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
    <div className='hide-scrollbar'>
      <div className='sticky top-0 z-20'>
        <TopNav
          setSideNav={setSideNav}
          storeData={storeData}
          mainColor={mainColor}
        />
        <SearchBar
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      {offers?.length ? <OffersSlider offers={offers} /> : null}
      <Categories data={categories} value={value} setValue={setValue} />
      {isSubmitted && (
        <SearchLabel
          filteredItems={filteredItems}
          searchValue={searchValue}
          close={close}
        />
      )}
      <BottomBar />
      <SideNav
        sideNav={sideNav}
        setSideNav={setSideNav}
        storeData={storeData}
      />
      <div className='w-full px-4 pb-4 mb-10 pt-2 flex flex-col gap-2 items-center bg-white dark:bg-gray-700'>
        {loading ? (
          <Loader />
        ) : isSubmitted ? (
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
            filteredItems?.map((item, i) => <Item item={item} key={i} />)
          )
        ) : products?.length ? (
          products?.map((item, i) => <Item item={item} key={i} />)
        ) : (
          <div className='w-full flex items-center font-semibold gap-4 justify-center flex-col my-16 dark:text-white'>
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
    </div>
  )
}

export default Home
