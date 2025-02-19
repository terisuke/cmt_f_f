import { companies, loans, financials, paymentHistory } from './data';
import type { Company, Loan, Financial, PaymentHistory } from '~/models/types';

// 企業情報の取得
export const getCompanies = (): Company[] => companies;
export const getCompanyById = (id: string): Company | undefined => 
  companies.find(c => c.id === id);

// 融資情報の取得
export const getLoansByCompanyId = (companyId: string): Loan[] => 
  loans.filter(l => l.companyId === companyId);

// 財務情報の取得
export const getFinancialsByCompanyId = (companyId: string): Financial[] =>
  financials.filter(f => f.companyId === companyId);

// 返済履歴の取得
export const getPaymentHistoryByLoanId = (loanId: string): PaymentHistory[] =>
  paymentHistory.filter(p => p.loanId === loanId);

// リスク評価の返り値の型定義
type RiskEvaluation = {
  debtServiceRatio: number;
  creditRating: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
} | null;

// リスク評価（簡易版）
export const evaluateCompanyRisk = (companyId: string): RiskEvaluation => {
  const company = getCompanyById(companyId);
  const companyFinancials = getFinancialsByCompanyId(companyId);
  const companyLoans = getLoansByCompanyId(companyId);

  if (!company || !companyFinancials.length || !companyLoans.length) {
    return null;
  }

  const latestFinancial = companyFinancials[companyFinancials.length - 1];
  const totalLoanAmount = companyLoans.reduce((sum, loan) => 
    sum + loan.remainingAmount, 0);

  return {
    debtServiceRatio: (latestFinancial.cashFlow / totalLoanAmount) * 100,
    creditRating: company.creditRating,
    riskLevel: getRiskLevel(company.creditRating, latestFinancial.debtRatio)
  };
};

// リスクレベルの判定（内部関数）
const getRiskLevel = (
  creditRating: string, 
  debtRatio: number
): 'LOW' | 'MEDIUM' | 'HIGH' => {
  if (creditRating === 'A' && debtRatio < 70) return 'LOW';
  if (creditRating === 'B+' && debtRatio < 80) return 'MEDIUM';
  return 'HIGH';
};