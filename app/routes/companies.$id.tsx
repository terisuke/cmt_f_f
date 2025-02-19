/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import Layout from "~/components/ui/Layout";
import { Company, Financial, Loan, PaymentHistory } from "~/models/types"; // PaymentHistory を import
import {
  evaluateCompanyRisk,
  getCompanyById,
  getFinancialsByCompanyId,
  getLoansByCompanyId,
  getPaymentHistoryByLoanId, // 追加
} from "~/services/mock/api";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PaymentHistoryComponent from "~/components/business/PaymentHistory"; // PaymentHistory コンポーネントを import


const tabs = [
  { id: "basic", name: "基本情報" },
  { id: "financial", name: "財務情報" },
  { id: "loans", name: "融資情報" },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("企業IDが見つかりません", { status: 400 });
  }

  const cleanId = decodeURIComponent(id).split("{")[0];
  const company = getCompanyById(cleanId);

  if (!company) {
    throw new Response("企業が見つかりません", { status: 404 });
  }

  const loans = getLoansByCompanyId(cleanId);
  const financials = getFinancialsByCompanyId(cleanId);
  const riskEvaluation = evaluateCompanyRisk(cleanId);

  // 各ローンの返済履歴を取得
  const loansWithPaymentHistory = loans.map((loan) => ({
    ...loan,
    paymentHistory: getPaymentHistoryByLoanId(loan.id),
  }));

  return json({
    company,
    loans: loansWithPaymentHistory, // paymentHistory を含む loans を返す
    financials,
    riskEvaluation,
  });
}

export default function CompanyDetail() {
  const { company, loans, financials, riskEvaluation } =
    useLoaderData<typeof loader>();
  const [currentTab, setCurrentTab] = useState("basic");

  return (
    <Layout>
      {/* ... (省略: 既存のコード) ... */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {company.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-sm ${
              riskEvaluation?.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
              riskEvaluation?.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              リスク: {riskEvaluation?.riskLevel || 'N/A'}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`${
                  currentTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 py-5 sm:px-6">
          {currentTab === "basic" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* ... (省略: 基本情報表示) ... */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">代表者</h4>
                  <p className="mt-1 text-sm text-gray-900">{company.representative}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">設立日</h4>
                  <p className="mt-1 text-sm text-gray-900">{company.establishmentDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">資本金</h4>
                  <p className="mt-1 text-sm text-gray-900">{company.capital.toLocaleString()}円</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">従業員数</h4>
                  <p className="mt-1 text-sm text-gray-900">{company.employees}名</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">業種</h4>
                  <p className="mt-1 text-sm text-gray-900">{company.industry}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">所在地</h4>
                  <p className="mt-1 text-sm text-gray-900">{company.address}</p>
                </div>
              </div>
            </div>
          )}

          {currentTab === "financial" && (
            <div className="space-y-6">
               {/* ... (省略: 財務情報表示) ... */}
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={financials}
                    margin={{
                      top: 20,
                      right: 50,
                      left: 50,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fiscalYear" />
                    <YAxis width={80} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      name="売上高"
                    />
                    <Line
                      type="monotone"
                      dataKey="operatingProfit"
                      stroke="#82ca9d"
                      name="営業利益"
                    />
                    <Line
                      type="monotone"
                      dataKey="netIncome"
                      stroke="#ffc658"
                      name="当期純利益"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {financials.map((financial) => (
                <div key={financial.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">{financial.fiscalYear}年度 財務詳細</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">売上高:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.revenue.toLocaleString()} 円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">営業利益:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.operatingProfit.toLocaleString()} 円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">当期純利益:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.netIncome.toLocaleString()} 円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">総資産:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.totalAssets.toLocaleString()} 円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">純資産:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.netAssets.toLocaleString()} 円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">キャッシュフロー:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.cashFlow.toLocaleString()} 円</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">負債比率:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.debtRatio.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">流動比率:</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.currentRatio.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentTab === "loans" && (
            <div className="space-y-6">
              {loans.map((loan) => (
                <div key={loan.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* ... (省略: 融資情報表示) ... */}
                    <div>
                      <p className="text-sm text-gray-500">融資額</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.loanAmount.toLocaleString()}円
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">残債額</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.remainingAmount.toLocaleString()}円
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">金利</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.interestRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">返済期限</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.maturityDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">融資ステータス</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.status === 'active' ? '返済中' :
                         loan.status === 'completed' ? '返済完了' :
                         '債務不履行'}
                      </p>
                    </div>
                    {loan.collateral && (
                      <div>
                        <p className="text-sm text-gray-500">担保</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {loan.collateral}
                        </p>
                      </div>
                    )}
                    {loan.guarantor && (
                      <div>
                        <p className="text-sm text-gray-500">保証人</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {loan.guarantor}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 返済履歴コンポーネントを追加 */}
                  <PaymentHistoryComponent paymentHistory={loan.paymentHistory} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>    
    </Layout>
  );
}