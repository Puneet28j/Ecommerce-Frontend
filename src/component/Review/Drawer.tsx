import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

const DrawerFunc = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  const handleDelete = async () => {
    try {
      await data(); // Execute the delete mutation and wait for it to finish
      setIsOpen(false);
      // Close the modal/sheet
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // const handleEdit = () => {
  //   setIsOpen(false);
  //   hideReviewForm(false); // Open the review form
  // };

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-transparent backdrop-blur-sm hover:bg-slate-400/50 hover:text-gray-700 rounded-full p-2 transition-all duration-300 ease-in-out  scale-75">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="bg-transparent backdrop-blur-sm  hover:bg-slate-400/50 hover:text-gray-700 rounded-full  transition-all duration-300 ease-in-out">
        <Ellipsis />
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader className="mb-4">
          <SheetTitle>Update review</SheetTitle>
          <SheetDescription>Make changes to your review</SheetDescription>
        </SheetHeader>
        <Button
          className="w-full mb-4 rounded-full"
          variant={"outline"}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button className="w-full rounded-full">Edit</Button>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerFunc;
