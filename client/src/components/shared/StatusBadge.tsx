import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Order status
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  // Payment status
  unpaid: "bg-orange-100 text-orange-700",
  paid: "bg-green-100 text-green-700",
  refunded: "bg-gray-100 text-gray-700",
  // Custom order status
  reviewing: "bg-blue-100 text-blue-700",
  approved: "bg-teal-100 text-teal-700",
  in_progress: "bg-purple-100 text-purple-700",
  ready: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
        statusStyles[status] || "bg-gray-100 text-gray-600",
        className,
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;
