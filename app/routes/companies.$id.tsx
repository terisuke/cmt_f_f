import { useState } from "react";
import { useParams } from "@remix-run/react";
import Layout from "~/components/ui/Layout";
import { 
  getCompanyById, 
  getLoansByCompanyId, 
  getFinancialsByCompanyId,
  evaluateCompanyRisk 
} from "~/services/mock/api";

const tabs = [
  { id: "basic", name: "基本情報" },
  { id: "financial", name: "財務情報" },
  { id: "loans", name: "融資情報" },
];

export default function CompanyDetail() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("basic");

  if (!id) return <div>企業IDが見つかりません</div>;

  const company = getCompanyById(id);
  const loans = getLoansByCompanyId(id);
  const financials = getFinancialsByCompanyId(id);
  const riskEvaluation = evaluateCompanyRisk(id);

  if (!company) return <div>企業が見つかりません</div>;

  return (
    <Layout>
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

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`${
                  currentTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="px-4 py-5 sm:px-6">
          {currentTab === "basic" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              {financials.map((financial) => (
                <div key={financial.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    {financial.fiscalYear}年度 財務情報
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">売上高</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {financial.revenue.toLocaleString()}円
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">営業利益</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {financial.operatingProfit.toLocaleString()}円
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">当期純利益</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {financial.netIncome.toLocaleString()}円
                      </p>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}