import axios from "axios";
import { API } from "../Api/Api";
import sweetalert from "../Utils/sweetalert";
import { useState } from "react";
import { showToast } from "../Utils/showToast";

const CoinsActionsHook = () => {
  const [coins, setCoins] = useState({ balance: 0 });
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage;
    console.log(error);
    
    // sweetalert.error("", message);
  };

  const getCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API.getBalance);
      if (response?.data) {
        setCoins(response.data);
      }
    } catch (error) {
      handleError(error, "Error fetching coins balance");
    } finally {
      setLoading(false);
    }
  };

  const dailyBonus = async () => {
    try {
      const response = await axios.post(API.dailyBonus);
      setDailyCoins(response.data);
      sweetalert.done("Coins have been successfully assembled");
      setIsSuccess(true);
      console.log(response.data);
    } catch (error) {
      sweetalert.info(error.response?.data?.message);
      setIsSuccess(false);
    }
  };

  const SendCoins = async (setLoading, data) => {
    setLoading(true);
    try {
      const response = await axios.post(API.SendCoins, data);
      showToast("success", "Coins transferred successfully");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to transfer coins");
    } finally {
      setLoading(false);
    }
  };

  const bonusCoins = async (userId) => {
    try {
      const response = await axios.put(API.bonusCoins, { userId });
      console.log(response.data);
    } catch (error) {
      handleError(error, "Error applying bonus coins");
    }
  };

  const deductCoins = async (userId) => {
    try {
      const response = await axios.put(API.deductCoins, { userId });
      console.log(response.data);
    } catch (error) {
      handleError(error, "Error deducting coins");
    }
  };

  return {
    getCoins,
    coins,
    dailyBonus,
    isSuccess,
    bonusCoins,
    deductCoins,
    loading,
    SendCoins,
  };
};

export default CoinsActionsHook;
