/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import DropDowns from "./DropDowns";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConvertor = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurreny, setfromCurreny] = useState("USD");
  const [toCurrency, settoCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR"]
  );

  const getCurrencies = async () => {
    try {
      const res = await fetch("http://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  console.log(currencies);

  const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurreny}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + "" + toCurrency);
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("Favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setfromCurreny(toCurrency);
    settoCurrency(fromCurreny);
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-gray`-700">
        Currency Convertor
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end ">
        <DropDowns
          favorites={favorites}
          currencies={currencies}
          setCurrency={setfromCurreny}
          handleFavorite={handleFavorite}
          currency={fromCurreny}
          title="From:"
        />
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={() => swapCurrencies()}
            className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-500"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>
        <DropDowns
          favorites={favorites}
          currencies={currencies}
          setCurrency={settoCurrency}
          handleFavorite={handleFavorite}
          currency={toCurrency}
          title="To:"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus: outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end mt-6 ">
        <button
          onClick={convertCurrency}
          className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none  focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            converting ? "animate-pulse" : ""
          } `}
        >
          Convert
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-4 text-lg font-medium text-right text-green-400">
          Converted Amount: {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConvertor;
