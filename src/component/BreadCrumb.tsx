import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <Breadcrumb className="hidden md:flex ">
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const capitalizeFirstLetter = (value: string) => {
          if (!value) {
            return "";
          }
          return value.charAt(0).toUpperCase() + value.slice(1);
        };
        const capitalizedWord = capitalizeFirstLetter(value);
        return (
          <BreadcrumbList key={to}>
            <BreadcrumbItem key={to}>
              {index === pathnames.length - 1 ? (
                <BreadcrumbPage className="font-semibold text-gray-600">
                  {decodeURIComponent(capitalizedWord)}
                </BreadcrumbPage>
              ) : (
                <Link
                  className="font-bold transition-colors hover:text-foreground"
                  to={to}
                >
                  {decodeURIComponent(capitalizedWord)}
                </Link>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator
              className={`${
                index === pathnames.length - 1 ? "text-gray-600" : ""
              }`}
            />
          </BreadcrumbList>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadCrumb;
