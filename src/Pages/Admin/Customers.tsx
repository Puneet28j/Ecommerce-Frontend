import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const Customers = () => {
  const products = [
    {
      id: 1,
      name: "Puneet Sharma kumar Sharma",
      image: "https://github.com/shadcn.png",
      status: "Delivered",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 2,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 3,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 4,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 5,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 6,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 7,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 8,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 9,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 10,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 11,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 12,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 13,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 14,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 15,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 16,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 17,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 18,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 19,
      name: "Product 1",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
    {
      id: 20,
      name: "hello20",
      image: "https://github.com/shadcn.png",
      status: "active",
      price: 100,
      totalSales: 1000,
      createdAt: "2021-01-01",
      action: "hello",
    },
  ];
  return (
    <div className="grid sm:ml-4  grid-cols-1 fixed font-primary">
      <div className="col-span-1 w-screen h-screen">
        <Card
          x-chunk="dashboard-05-chunk-3 "
          className=" shadow-md rounded-none sm:rounded-lg h-full pb-14 sm:pb-0 sm:w-[87%] sm:h-[90%] md:w-[88%] lg:w-[90%] xl:w-[93%]  2xl:w-[95%] overflow-hidden hover:cursor-pointer"
        >
          <CardHeader className="px-7">
            <div className="flex justify-between">
              <div>
                <CardTitle>Customers</CardTitle>
                <CardDescription>All customers of your store.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <ScrollArea className="overflow-y-auto whitespace-nowrap rounded-md h-full pb-24 mb-0">
            <CardContent className="px-0 sm:px-3 py-0">
              <Table className="overflow-y-auto overflow-x-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      onClick={() => console.log("hello")}
                    >
                      <TableCell className="flex items-center py-2 gap-2">
                        <img
                          alt="Product image"
                          className=" rounded-full h-10 w-10 sm:h-16 sm:w-16 object-contain"
                          src={product.image}
                        />
                        <div>
                          <div className="font-light sm:font-extrabold sm:text-lg">
                            {product.name}
                          </div>
                          <div className="font-extralight sm:font-normal text-sm text-muted-foreground inline">
                            cricket
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell sm:text-lg sm:font-semibold">
                        Sale
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center ">
                        <Badge
                          className="text-xs sm:text-base font-extralight "
                          variant="secondary"
                        >
                          {"Fulfilled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center sm:text-lg sm:font-semibold">
                        2023-06-23
                      </TableCell>
                      <TableCell className="text-right font-medium text-base sm:text-xl">
                        $ {product?.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Customers;
