import { Company, Loan, Financial, PaymentHistory } from '~/models/types';

export const companies: Company[] = [
  {
    id: "1",
    name: "株式会社東京製作所",
    representative: "山田太郎",
    establishmentDate: "1995-04-01",
    capital: 50000000,
    employees: 45,
    industry: "製造業",
    address: "東京都大田区...",
    creditRating: "A",
  },
  {
    id: "2",
    name: "大阪流通株式会社",
    representative: "鈴木一郎",
    establishmentDate: "1988-08-15",
    capital: 30000000,
    employees: 28,
    industry: "卸売業",
    address: "大阪府大阪市...",
    creditRating: "B+",
  },
  // 他の企業データ...
];

export const loans: Loan[] = [
  {
    id: "1",
    companyId: "1",
    loanAmount: 100000000,
    interestRate: 3.5,
    loanDate: "2023-10-01",
    maturityDate: "2026-09-30",
    remainingAmount: 85000000,
    purpose: "設備投資",
    status: "active",
    collateral: "工場設備一式",
  },
  {
    id: "2",
    companyId: "2",
    loanAmount: 80000000,
    interestRate: 4.0,
    loanDate: "2023-12-01",
    maturityDate: "2026-11-30",
    remainingAmount: 75000000,
    purpose: "運転資金",
    status: "active",
    collateral: "在庫一式",
  },
  // 他の融資データ...
];

export const financials: Financial[] = [
  {
    id: "1",
    companyId: "1",
    fiscalYear: "2023",
    revenue: 800000000,
    operatingProfit: 60000000,
    netIncome: 35000000,
    totalAssets: 500000000,
    netAssets: 200000000,
    cashFlow: 45000000,
    debtRatio: 60.5,
    currentRatio: 150.2,
  },
  {
    id: "2",
    companyId: "2",
    fiscalYear: "2023",
    revenue: 600000000,
    operatingProfit: 45000000,
    netIncome: 25000000,
    totalAssets: 400000000,
    netAssets: 150000000,
    cashFlow: 35000000,
    debtRatio: 70.5,
    currentRatio: 130.2,
  },
  // 他の財務データ...
];

export const paymentHistory: PaymentHistory[] = [
  {
    id: "1",
    loanId: "1",
    paymentDate: "2024-01-31",
    amount: 2875000,
    paymentType: "both",
    status: "completed",
  },
  // 他の返済履歴...
];