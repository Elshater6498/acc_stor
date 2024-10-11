import AwesomeSlider from "react-awesome-slider";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constatns";
import "react-awesome-slider/dist/styles.css";
import { useTranslation } from "react-i18next";

const OffersSlider = ({ offers }) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  return (
    <AwesomeSlider className="" bullets={false}>
      {offers
        .sort((a, b) => a.id - b.id)
        .map((offer, i) => (
          <button
            className="cursor-pointer  shadow-md rounded-lg overflow-hidden h-56 w-full"
            key={i}
            onClick={() => navigate(`/offers/${offer?.id}`)}
          >
            <img
              src={BASE_URL + offer?.image}
              alt={offer.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-8 text-white text-xl font-bold bg-red-600 w-20 h-20 flex flex-col justify-center items-center text-center rounded-full">
              <span className="">{offer.price}</span>
              <span className="">{t("singleProduct:pound")}</span>
            </div>
          </button>
        ))}
    </AwesomeSlider>
  );
};

export default OffersSlider;
