import React, { useState, useEffect } from "react";

const formTypes = ["immobilien", "privateHealthInsurance", "stateHealthInsurance", "kfz", "loans", "electricity", "sanuspay", "Gems"];

const serviceMap = {
  personal: "getPersonalDetails",
  employment: "getEmploymentDetails",
  income: "getIncomeDetails",
  expenses: "getExpensesDetails",
  assets: "getAssets",
  liabilities: "getLiabilities"
};

const FormConfiguration = () => {
  const [formTypes, setFormTypes] = useState([]);
  const [serviceMap, setServiceMap] = useState({});

  useEffect(() => {
    setFormTypes(formTypes);
    setServiceMap(serviceMap);
  }, []);
};