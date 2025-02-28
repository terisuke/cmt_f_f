import type { PaymentHistory as PaymentHistoryType } from "~/models/types";

type Props = {
  paymentHistory: PaymentHistoryType[];
};

const PaymentHistory = ({ paymentHistory }: Props) => {
  if (paymentHistory.length === 0) {
    return <p className="text-gray-500">返済履歴はありません。</p>;
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              支払日
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              支払額
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              支払種別
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              支払状況
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paymentHistory.map((payment) => (
            <tr key={payment.id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {/*日付のフォーマット*/}
                {new Date(payment.paymentDate).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.amount.toLocaleString()}円
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.paymentType === "principal"
                  ? "元金"
                  : payment.paymentType === "interest"
                  ? "利息"
                  : "元金+利息"}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.status === "completed"
                  ? "支払済"
                  : payment.status === "late"
                  ? "遅延"
                  : "未払い"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;