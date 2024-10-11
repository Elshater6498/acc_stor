import { Link } from 'react-router-dom'
import { BASE_URL } from '../constatns'
import { useTranslation } from 'react-i18next'

export default function TopNav({ setSideNav, storeData }) {
  const { i18n } = useTranslation()

  const changeLang = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
    localStorage.setItem('lng', i18n.language)
  }
  return (
    <header className="z-30 transition bg-white duration-200 dark:bg-opacity-300 relative">
      <nav className="z-30 relative App-header absolutee left-0 right-0 text-white">
        <div className="z-50 w-full max-w-md mx-auto h-16 top-auto rounded-t-4xl py-1 flex items-center justify-between dark:bg-gray-700 bg-opacity-50">
          {/* right side nav */}
            <Link
              to="/"
              className={`col-span-10 text-md font-semibold text-gray-500 dark:text-white overflow-y-hidden flex items-center cursor-pointer gap-2 ${
                i18n.language === "en" ? "pl-4" : "pr-4"
              }`}
            >
              <img
                src={BASE_URL + storeData?.image}
                alt={storeData?.name}
                className=" w-[56px] h-[57px] rounded-full"
              />
              <h1 className="font-extrabold flex gap-0.5 flex-col text-md text-main dark:text-white whitespace-nowrap">
                <span>{storeData?.name}</span>
                <span>{storeData?.eng_name}</span>
              </h1>
            </Link>
          {/* left side nav */}
          <div
            className={`'col-span-3 flex justify-end items-center ${
              i18n.language === "en" ? "mr-4" : "ml-4"
            }`}
          >
            {/* lang button */}
            <button
              className="rounded-md text-main px-4 py-1 dark:text-white"
              onClick={changeLang}
            >
              {i18n.language === "ar" ? "EN" : "AR"}
            </button>
            {/* sideNav button */}
            <div
              className="col-span-2 w-10 h-10 p-2 rounded-full text-black transition duration-200 dark:text-gray-100 hover:bg-gray-400 hover:bg-opacity-50 flex justify-center items-center"
              onClick={() => setSideNav(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-main dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="2"
                  width="20"
                  height="2.5"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  y="18"
                  width="20"
                  height="2.5"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  x="4"
                  y="10"
                  width="20"
                  height="2.5"
                  rx="1.5"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
