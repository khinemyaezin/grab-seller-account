import { Card, CardContent, CardHeader } from "@khinemyaezin/seller-ui/components/card";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { useMerchantLink } from "@/features/merchant/api/use-root";
import StorefrontTable from "./storefront-table";

export default function StorefrontsView() {
  const createStorefrontLink = useMerchantLink("createStorefront");

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
        {createStorefrontLink && (
          <Button className="self-start sm:self-end" variant="outline" asChild>
            <Link to="new">
              Add storefront
            </Link>
          </Button>
        )}
      </CardHeader>
      <StorefrontTable />
    </Card>
  );
}
