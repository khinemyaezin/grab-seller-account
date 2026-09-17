import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@khinemyaezin/seller-ui/components/table";
import { Badge } from "@khinemyaezin/seller-ui/components/badge";
import { Link } from "react-router";
import { hasLink, resolveLink } from "@khinemyaezin/seller-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@khinemyaezin/seller-ui/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@khinemyaezin/seller-ui/components/index";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { useMerchantLink } from "@/features/merchant/api/use-root";
import { useStorefronts } from "@/features/merchant/api/use-storefronts";
import type { StorefrontResponse, StorefrontStatus } from "@/features/merchant/types";

const STATUS_VARIANT: Record<StorefrontStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  ACTIVE: "default",
  SUSPENDED: "destructive",
  CLOSED: "secondary",
};

export default function StorefrontTable() {
  const listLink = useMerchantLink("listStorefronts");
  const { data, isLoading, isError } = useStorefronts(listLink);
  const storefronts =
    data?._embedded?.storefrontResponseList
    ?? data?._embedded?.storefrontResponses
    ?? [];

  if (storefronts.length == 0) {
    return <NoStorefronts />
  }

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load storefronts."
    >
      <Table className="[&_tr>*:first-child]:pl-(--card-spacing) [&_tr>*:last-child]:pr-(--card-spacing)">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storefronts.map((storefront) => (
            <StorefrontTableRow
              key={storefront.storefrontId}
              storefront={storefront}
            />
          ))}
        </TableBody>
      </Table>
    </QueryState>
  );
}

type StorefrontTableRowProps = {
  storefront: StorefrontResponse;
};

function StorefrontTableRow({ storefront }: StorefrontTableRowProps) {
  const canOpen = hasLink(storefront._links, "self") || hasLink(storefront._links, "update-storefront");

  return (
    <TableRow>
      <TableCell>
        {canOpen ? (
          <Link to={storefront.storefrontId} className="font-medium hover:underline">
            {storefront.name}
          </Link>
        ) : (
          <span className="font-medium">{storefront.name}</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{storefront.slug}</TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANT[storefront.status]}>{storefront.status}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {resolveLink(storefront._links, "self") && (
                <DropdownMenuItem asChild>
                  <Link to={storefront.storefrontId}>Open</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function NoStorefronts() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
      <p className="text-base font-semibold text-foreground">No storefronts yet</p>
      <p className="text-sm text-muted-foreground">
        Create a storefront to give this merchant a public brand presence.
      </p>
    </div>
  );
}
