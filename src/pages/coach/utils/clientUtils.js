// Calculate profile completion percentage based on available data
export const calculateProfileCompletion = (client) => {
  let completedSections = 0;
  const totalSections = 8;
  
  console.log("Calculating profile completion for client:", client);
  
  // 1. Personal Details - Check if basic personal details are complete
  const hasPersonalDetails = client.firstName && client.lastName && client.email && client.phone && 
                            client.streetAddress && client.city && client.postalCode && client.birthDate;
  if (hasPersonalDetails) {
    completedSections++;
    console.log("✓ Personal Details completed");
  } else {
    console.log("✗ Personal Details incomplete");
  }
  
  // 2. Employment Details - Check if employment information exists and has meaningful data
  const hasEmploymentDetails = client.employmentDetails && 
                              Array.isArray(client.employmentDetails) && 
                              client.employmentDetails.length > 0 &&
                              client.employmentDetails.some(emp => emp.employmentType || emp.employerName || emp.occupation);
  if (hasEmploymentDetails) {
    completedSections++;
    console.log("✓ Employment Details completed");
  } else {
    console.log("✗ Employment Details incomplete");
  }
  
  // 3. Income Details - Check if income information exists and has meaningful data
  const hasIncomeDetails = client.incomeDetails && 
                          Array.isArray(client.incomeDetails) && 
                          client.incomeDetails.length > 0 &&
                          client.incomeDetails.some(inc => inc.grossIncome || inc.netIncome);
  if (hasIncomeDetails) {
    completedSections++;
    console.log("✓ Income Details completed");
  } else {
    console.log("✗ Income Details incomplete");
  }
  
  // 4. Expenses Details - Check if expenses information exists and has meaningful data
  const hasExpensesDetails = client.expensesDetails && 
                            Array.isArray(client.expensesDetails) && 
                            client.expensesDetails.length > 0 &&
                            client.expensesDetails.some(exp => exp.coldRent || exp.electricity || exp.livingExpenses);
  if (hasExpensesDetails) {
    completedSections++;
    console.log("✓ Expenses Details completed");
  } else {
    console.log("✗ Expenses Details incomplete");
  }
  
  // 5. Assets - Check if assets information exists and has meaningful data
  const hasAssets = client.assets && 
                   Array.isArray(client.assets) && 
                   client.assets.length > 0 &&
                   client.assets.some(asset => 
                     asset.realEstate > 0 || asset.securities > 0 || asset.bankDeposits > 0 || 
                     asset.buildingSavings > 0 || asset.insuranceValues > 0 || asset.otherAssets > 0
                   );
  if (hasAssets) {
    completedSections++;
    console.log("✓ Assets completed");
  } else {
    console.log("✗ Assets incomplete");
  }
  
  // 6. Liabilities - Check if liabilities information exists and has meaningful data
  const hasLiabilities = client.liabilities && 
                        Array.isArray(client.liabilities) && 
                        client.liabilities.length > 0 &&
                        client.liabilities.some(liability => liability.loanType || liability.loanAmount || liability.loanBank);
  if (hasLiabilities) {
    completedSections++;
    console.log("✓ Liabilities completed");
  } else {
    console.log("✗ Liabilities incomplete");
  }
  
  // 7. Goals and Wishes - Check if goals and wishes information exists and has meaningful data
  const hasGoalsAndWishes = client.goalsAndWishes && 
                           (client.goalsAndWishes.retirementPlanning || 
                            client.goalsAndWishes.capitalFormation || 
                            client.goalsAndWishes.realEstateGoals ||
                            client.goalsAndWishes.financing ||
                            client.goalsAndWishes.protection ||
                            client.goalsAndWishes.healthcareProvision ||
                            client.goalsAndWishes.otherGoals);
  if (hasGoalsAndWishes) {
    completedSections++;
    console.log("✓ Goals and Wishes completed");
  } else {
    console.log("✗ Goals and Wishes incomplete");
  }
  
  // 8. Risk Appetite - Check if risk appetite information exists and has meaningful data
  const hasRiskAppetite = client.riskAppetite && 
                         (client.riskAppetite.riskAppetite || 
                          client.riskAppetite.investmentHorizon || 
                          client.riskAppetite.knowledgeExperience ||
                          client.riskAppetite.healthInsurance);
  if (hasRiskAppetite) {
    completedSections++;
    console.log("✓ Risk Appetite completed");
  } else {
    console.log("✗ Risk Appetite incomplete");
  }
  
  const completionPercentage = Math.round((completedSections / totalSections) * 100);
  console.log(`Profile completion: ${completedSections}/${totalSections} sections = ${completionPercentage}%`);
  return completionPercentage;
};

// Transform API client data to dashboard format
export const transformClientData = (clientsData) => {
  return clientsData.map((client, index) => {
    const profileCompletion = calculateProfileCompletion(client);
    const formsCompleted = Math.round((profileCompletion / 100) * 8); // Calculate completed forms based on percentage
    
    return {
      // Preserve all original client data
      ...client,
      
      // Add/override dashboard-specific fields
      id: client.userId || client.id || index + 1,
      firstName: client.firstName || "Unknown",
      lastName: client.lastName || "Client",
      email: client.email || "no-email@example.com",
      phone: client.phone || "N/A",
      status: "active", // Default to active, could be enhanced with actual status
      profileCompletion: profileCompletion,
      lastActivity: client.updatedAt ? new Date(client.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      joinDate: client.createdAt ? new Date(client.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      formsCompleted: formsCompleted, // Calculated based on actual completion
      totalForms: 8, // Total number of profile sections
      userId: client.userId || client.id,
      personalId: client.userId || client.id
    };
  });
};

// Filter clients based on search term and status
export const filterClients = (clients, searchTerm, filterStatus) => {
  return clients.filter(client => {
    const matchesSearch = !searchTerm || 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
};

// Get field label from field name for forms
export const getFieldLabel = (fieldName) => {
  // Safety check for undefined or null fieldName
  if (!fieldName || typeof fieldName !== 'string') {
    return 'Unknown Field';
  }

  const labelMapping = {
    // Personal Details
    'coachId': 'Coach ID',
    'applicantType': 'Applicant Type',
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'streetAddress': 'Street Address',
    'postalCode': 'Postal Code',
    'city': 'City',
    'phone': 'Phone Number',
    'email': 'Email Address',
    'birthDate': 'Date of Birth',
    'birthPlace': 'Place of Birth',
    'maritalStatus': 'Marital Status',
    'nationality': 'Nationality',
    'housing': 'Housing Situation',
    
    // Employment Details
    'employmentType': 'Employment Type',
    'occupation': 'Occupation',
    'contractType': 'Contract Type',
    'contractDuration': 'Contract Duration',
    'employerName': 'Employer Name',
    'employedSince': 'Employed Since',
    
    // Income Details
    'grossIncome': 'Gross Income',
    'netIncome': 'Net Income',
    'taxClass': 'Tax Class',
    'taxId': 'Tax ID',
    'numberOfSalaries': 'Number of Salaries',
    'childBenefit': 'Child Benefit',
    'otherIncome': 'Other Income',
    'incomeTradeBusiness': 'Income from Trade/Business',
    'incomeSelfEmployedWork': 'Income from Self-Employed Work',
    'incomeSideJob': 'Income from Side Job',
    
    // Expenses Details
    'coldRent': 'Cold Rent',
    'electricity': 'Electricity',
    'livingExpenses': 'Living Expenses',
    'gas': 'Gas',
    'telecommunication': 'Telecommunication',
    'subscriptions': 'Subscriptions',
    'accountMaintenanceFee': 'Account Maintenance Fee',
    'alimony': 'Alimony',
    'otherExpenses': 'Other Expenses',
    
    // Assets
    'realEstate': 'Real Estate',
    'securities': 'Securities',
    'bankDeposits': 'Bank Deposits',
    'buildingSavings': 'Building Savings',
    'insuranceValues': 'Insurance Values',
    'otherAssets': 'Other Assets',
    
    // Liabilities
    'loanType': 'Loan Type',
    'loanBank': 'Loan Bank',
    'loanAmount': 'Loan Amount',
    'loanMonthlyRate': 'Monthly Payment',
    'loanInterest': 'Interest Rate'
  };
  
  return labelMapping[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

// Get field type from field name for forms
export const getFieldType = (fieldName) => {
  const typeMapping = {
    // Email fields
    'email': 'email',
    
    // Date fields
    'birthDate': 'date',
    'employedSince': 'date',
    
    // Number fields
    'grossIncome': 'number',
    'netIncome': 'number',
    'taxClass': 'number',
    'taxId': 'number',
    'numberOfSalaries': 'number',
    'childBenefit': 'number',
    'otherIncome': 'number',
    'incomeTradeBusiness': 'number',
    'incomeSelfEmployedWork': 'number',
    'incomeSideJob': 'number',
    'coldRent': 'number',
    'electricity': 'number',
    'livingExpenses': 'number',
    'gas': 'number',
    'telecommunication': 'number',
    'subscriptions': 'number',
    'accountMaintenanceFee': 'number',
    'alimony': 'number',
    'otherExpenses': 'number',
    'realEstate': 'number',
    'securities': 'number',
    'bankDeposits': 'number',
    'buildingSavings': 'number',
    'insuranceValues': 'number',
    'otherAssets': 'number',
    'loanAmount': 'number',
    'loanMonthlyRate': 'number',
    'loanInterest': 'number',
    
    // Text fields
    'contractDuration': 'text',
    
    // Select fields
    'applicantType': 'select',
    'maritalStatus': 'select',
    'housing': 'select',
    'employmentType': 'select',
    'contractType': 'select',
    'loanType': 'select'
  };
  
  return typeMapping[fieldName] || 'text';
};

// Get field options for select fields
export const getFieldOptions = (fieldName) => {
  const optionsMapping = {
    'applicantType': [
      { value: 'individual', label: 'Individual' },
      { value: 'couple', label: 'Couple' },
      { value: 'family', label: 'Family' }
    ],
    'maritalStatus': [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'divorced', label: 'Divorced' },
      { value: 'widowed', label: 'Widowed' }
    ],
    'housing': [
      { value: 'rent', label: 'Rent' },
      { value: 'own', label: 'Own' },
      { value: 'family', label: 'Living with Family' }
    ],
    'employmentType': [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'self-employed', label: 'Self-employed' },
      { value: 'unemployed', label: 'Unemployed' },
      { value: 'retired', label: 'Retired' }
    ],
    'contractType': [
      { value: 'permanent', label: 'Permanent' },
      { value: 'temporary', label: 'Temporary' },
      { value: 'freelance', label: 'Freelance' }
    ],
    'loanType': [
      { value: 'mortgage', label: 'Mortgage' },
      { value: 'personal', label: 'Personal Loan' },
      { value: 'auto', label: 'Auto Loan' },
      { value: 'credit-card', label: 'Credit Card' },
      { value: 'other', label: 'Other' }
    ]
  };
  
  return optionsMapping[fieldName] || [];
};

// Check if a field is a liability field
export const isLiabilityField = (fieldName) => {
  const liabilityFields = ['loanType', 'loan_type', 'loanBank', 'loan_bank', 'loanAmount', 'loan_amount', 
                          'loanMonthlyRate', 'loan_monthly_rate', 'monthlyPayment', 'monthly_payment',
                          'loanInterest', 'loan_interest', 'interestRate', 'interest_rate'];
  return liabilityFields.includes(fieldName);
}; 