import { companies, loans, financials, paymentHistory } from './data';
import type { Company, Loan, Financial, PaymentHistory, Alert } from '~/models/types';

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
export type RiskEvaluation = {
  debtServiceRatio: number;
  creditRating: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  debtRatio: number;
  currentRatio: number;
  cashFlow: number;
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
  const totalLoanAmount = companyLoans.reduce(
    (sum, loan) => sum + loan.remainingAmount,
    0
  );

  return {
    debtServiceRatio: totalLoanAmount / latestFinancial.cashFlow,
    creditRating: company.creditRating,
    riskLevel: getRiskLevel(
      company.creditRating,
      latestFinancial.debtRatio,
      latestFinancial.currentRatio,
      latestFinancial.cashFlow
    ),
    debtRatio: latestFinancial.debtRatio,
    currentRatio: latestFinancial.currentRatio,
    cashFlow: latestFinancial.cashFlow
  };
};

// リスクレベルの判定（内部関数）
const getRiskLevel = (
  creditRating: string,
  debtRatio: number,
  currentRatio: number,
  cashFlow: number
): 'LOW' | 'MEDIUM' | 'HIGH' => {
  if (creditRating === 'A' && debtRatio < 50 && currentRatio > 150 && cashFlow > 0) {
    return 'LOW';
  }
  if (creditRating.startsWith('B') && debtRatio < 75 && currentRatio > 100 && cashFlow > -5000000 ) {
      return 'MEDIUM';
  }
  return 'HIGH';
};

// 返済期限アラートの生成
export const generatePaymentDueAlerts = (): Alert[] => {
  const today = new Date();
  const alerts: Alert[] = [];

  loans.forEach((loan) => {
    const dueDate = new Date(loan.maturityDate);
    const diffInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 30 && diffInDays > 0 && loan.status === "active") {
      alerts.push({
        id: `paymentDue-${loan.id}-${today.toISOString()}`,
        companyId: loan.companyId,
        type: "paymentDue",
        message: `${
          companies.find((c) => c.id === loan.companyId)?.name
        } の返済期限が近づいています (${dueDate.toLocaleDateString()})`,
        createdAt: today.toISOString(),
        read: false,
      });
    }
  });

  return alerts;
};

// 財務指標警告アラートの生成
export const generateFinancialWarningAlerts = (): Alert[] => {
  const today = new Date();
  const alerts: Alert[] = [];

  companies.forEach((company) => {
    const financials = getFinancialsByCompanyId(company.id);
    if (financials.length === 0) return;

    const latestFinancial = financials[financials.length - 1];

    if (
      latestFinancial.debtRatio > 80 ||
      latestFinancial.currentRatio < 100 ||
      latestFinancial.cashFlow < -10000000
    ) {
      alerts.push({
        id: `financialWarning-${company.id}-${today.toISOString()}`,
        companyId: company.id,
        type: "financialWarning",
        message: `${company.name} の財務指標が悪化しています`,
        createdAt: today.toISOString(),
        read: false,
      });
    }
  });

  return alerts;
};