interface CartPriceDetailProps {
  label: string;
  value: number;
  isDiscount?: boolean;
  isTotal?: boolean;
}

const CartPriceDetail: React.FC<CartPriceDetailProps> = ({
  label,
  value,
  isDiscount = false,
  isTotal = false,
}) => (
  <div
    className={`flex justify-between items-center ${
      isTotal ? "text-base sm:text-lg font-bold" : "text-sm sm:text-base"
    }`}
  >
    <span
      className={`${
        isDiscount
          ? "text-green-600"
          : isTotal
          ? "text-gray-900 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {label}
    </span>
    <span
      className={`${
        isDiscount
          ? "text-green-600 font-semibold"
          : isTotal
          ? "text-gray-900 dark:text-gray-100 font-bold"
          : "text-gray-900 dark:text-gray-100 font-medium"
      }`}
    >
      {isDiscount ? "-" : ""}₹{value.toFixed(2)}
    </span>
  </div>
);

export default CartPriceDetail;
