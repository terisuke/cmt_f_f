// 企業の基本情報
export type Company = {
  id: string;
  name: string;                 // 企業名
  representative: string;       // 代表者名
  establishmentDate: string;    // 設立日
  capital: number;             // 資本金
  employees: number;           // 従業員数
  industry: string;            // 業種
  address: string;             // 所在地
  creditRating: string;        // 信用格付け
};

// 融資情報
export type Loan = {
  id: string;
  companyId: string;
  loanAmount: number;          // 融資額
  interestRate: number;        // 金利
  loanDate: string;           // 融資実行日
  maturityDate: string;       // 返済期限
  remainingAmount: number;     // 残債額
  purpose: string;            // 資金使途
  status: 'active' | 'completed' | 'defaulted';  // ステータス
  collateral?: string;        // 担保（ある場合）
  guarantor?: string;         // 保証人（ある場合）
};

// 財務情報
export type Financial = {
  id: string;
  companyId: string;
  fiscalYear: string;         // 決算期
  revenue: number;            // 売上高
  operatingProfit: number;    // 営業利益
  netIncome: number;          // 当期純利益
  totalAssets: number;        // 総資産
  netAssets: number;          // 純資産
  cashFlow: number;           // キャッシュフロー
  debtRatio: number;          // 負債比率
  currentRatio: number;       // 流動比率
};

// 返済履歴
export type PaymentHistory = {
  id: string;
  loanId: string;
  paymentDate: string;        // 支払日
  amount: number;             // 支払額
  paymentType: 'principal' | 'interest' | 'both';  // 支払種別
  status: 'completed' | 'late' | 'missed';         // 支払状況
};

// アラート
export type Alert = {
  id: string;
  companyId: string;
  type: 'paymentDue' | 'financialWarning';
  message: string;
  createdAt: string;
  read: boolean; // 既読/未読
};