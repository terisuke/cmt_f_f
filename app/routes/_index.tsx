import type { MetaFunction } from "@remix-run/node";
//import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Layout from "~/components/ui/Layout";
import {
  generatePaymentDueAlerts,
  generateFinancialWarningAlerts,
} from "~/services/mock/api";
import AlertList from "~/components/business/AlertList";

export const meta: MetaFunction = () => {
  return [
    { title: "CMT Finance - 融資管理システム" },
    { name: "description", content: "融資先企業の管理システム" },
  ];
};

export const loader = async () => {
  const paymentDueAlerts = generatePaymentDueAlerts();
  const financialWarningAlerts = generateFinancialWarningAlerts();
  const allAlerts = [...paymentDueAlerts, ...financialWarningAlerts];

  return json({ allAlerts });
};

export default function Index() {
  const { allAlerts } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            融資管理システムへようこそ
          </h3>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                <div className="text-sm text-gray-500">
                  現在の管理企業数: <span className="font-medium text-gray-900">25社</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/companies"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  企業一覧を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">アラート</h2>
        <AlertList alerts={allAlerts} />
      </div>
    </Layout>
  );
}