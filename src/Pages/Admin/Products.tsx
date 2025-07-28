import { useSelector } from "react-redux";
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
import { productAPI } from "../../redux/api/productAPI";
import { RootState } from "../../redux/store";
import { NewProduct } from "../NewProduct";
import { Link } from "react-router-dom";

const Products = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = productAPI.useAllProductsQuery(
    user?._id!
  );

  if (isLoading)
    return <div className="flex items-center justify-center">Loading...</div>;
  if (isError) return <div>{JSON.stringify(error)}</div>;

  return (
    <div className="grid sm:ml-4  grid-cols-1 fixed">
      <div className="col-span-1 w-screen h-screen">
        <Card
          x-chunk="dashboard-05-chunk-3 "
          className=" shadow-md rounded-none sm:rounded-lg h-full pb-14 sm:pb-0 sm:w-[87%] sm:h-[90%] md:w-[88%] lg:w-[90%] xl:w-[93%]  2xl:w-[95%] overflow-hidden hover:cursor-pointer"
        >
          <CardHeader className="px-7">
            <div className="flex justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>All products of your store.</CardDescription>
              </div>
              <NewProduct />
            </div>
          </CardHeader>
          <ScrollArea className="overflow-y-auto whitespace-nowrap rounded-md h-full pb-24 mb-0">
            <CardContent className="px-0 sm:px-3 py-0">
              <Table className="overflow-y-auto overflow-x-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead>Products</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                      Date
                    </TableHead>
                    <TableHead className="hidden sm:table-cell text-center">
                      Manage
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.products?.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="flex items-center py-2 gap-2">
                        <img
                          alt="Product image"
                          className=" rounded-lg h-10 w-10 sm:h-16 sm:w-16 object-contain"
                          src={product.photo[0]?.url.replace(
                            "/upload/",
                            "/upload/c_fill,h_100,w_100,q_auto:low/"
                          )}
                        />
                        <div>
                          <div className="font-light sm:font-extrabold sm:text-lg">
                            {product.name}
                          </div>
                          <div className="font-extralight sm:font-normal text-sm text-muted-foreground inline">
                            {product.category}
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
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center font-medium text-base sm:text-xl">
                        <Link to={`/admin/product/${product._id}`}>Manage</Link>
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

export default Products;
