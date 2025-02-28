import { useLoaderData, Link } from "@remix-run/react";
//import type { LoaderFunctionArgs } from "@remix-run/node";
import Layout from "~/components/ui/Layout";
import {
  getCompanies,
  getFinancialsByCompanyId,
  getLoansByCompanyId,
  evaluateCompanyRisk,
} from "~/services/mock/api";

export async function loader() {
  const companies = getCompanies();

  const companiesWithSummary = companies.map(company => {
    const financials = getFinancialsByCompanyId(company.id);
    const loans = getLoansByCompanyId(company.id);
    const riskEvaluation = evaluateCompanyRisk(company.id);

    const latestFinancial = financials[financials.length - 1];
    const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);

    return {
      ...company,
      latestRevenue: latestFinancial?.revenue,
      latestOperatingProfit: latestFinancial?.operatingProfit,
      totalLoanAmount,
      riskLevel: riskEvaluation?.riskLevel,
    };
  });

  return { companies: companiesWithSummary };
}

export default function Companies() {
  const { companies } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">企業一覧</h1>
          <p className="mt-2 text-sm text-gray-700">
            融資先企業の一覧です。
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      企業名
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      代表者
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      業種
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      信用格付け
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      売上高
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      営業利益
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      融資残高
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      リスクレベル
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">詳細</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {company.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.representative}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.industry}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.creditRating}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.latestRevenue?.toLocaleString()}円
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.latestOperatingProfit?.toLocaleString()}円
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.totalLoanAmount.toLocaleString()}円
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.riskLevel}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/companies/${company.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}