import type { Alert } from "~/models/types";

type Props = {
  alerts: Alert[];
};
const AlertList = ({ alerts }: Props) => {
  if (alerts.length === 0) {
    return <p className="text-blue-500">現在、アラートはありません。</p>;
  }

  return (
    <ul>
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className={`p-4 my-2 rounded-md ${
            alert.read ? "bg-gray-100" : "bg-yellow-50"
          } ${
            alert.type === 'paymentDue' ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'
          }`}
        >
          <p className="text-sm font-medium">
            {alert.type === "paymentDue" ? "返済期限" : "財務警告"}
          </p>
          <p className="text-gray-700">{alert.message}</p>
          <p className="text-xs text-gray-500">
            {new Date(alert.createdAt).toLocaleString()}
          </p>
          {/* 既読/未読の切り替え (モック) */}
          {!alert.read && (
            <button
              className="mt-2 px-4 py-1 text-xs rounded-md bg-gray-300 hover:bg-gray-400"
              onClick={() => {
                // ここでアラートの read 状態を更新する (本来は状態管理が必要)
                console.log("Mark as read:", alert.id);
              }}
            >
              既読にする
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default AlertList;