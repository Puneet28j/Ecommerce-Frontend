import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order Status</SelectLabel>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Processing">Processing</SelectItem>
          <SelectItem value="Shipped">Shipped</SelectItem>
          <SelectItem value="Delivered">Delivered</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
