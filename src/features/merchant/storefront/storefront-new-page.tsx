import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { Header } from "@khinemyaezin/seller-ui/layout/header";
import { usePlatform } from "@khinemyaezin/seller-ui";
import { QueryState } from "@khinemyaezin/seller-ui/components/query-state";
import { Card, CardContent } from "@khinemyaezin/seller-ui/components/card";
import { useMerchantLink, useRoot } from "@/features/merchant/api/use-root";
import type { StorefrontLifecycleEvent } from "@/features/merchant/types";
import StorefrontNewForm from "./storefront-new-form";

export default function StorefrontNewPage() {
  const navigate = useNavigate();
  const platform = usePlatform();
  const { isLoading, isError } = useRoot();
  const createStorefrontLink = useMerchantLink("createStorefront");

  const toast = (type: "success" | "error", message: string) =>
    platform?.events.emit("shell:toast:v1", { type, message, position: "top-center" });

  const handleEvent = (event: StorefrontLifecycleEvent) => {
    switch (event.type) {
      case "created":
        toast("success", event.message ?? "Storefront created");
        navigate("..");
        break;
      case "createFailed":
        toast("error", event.message ?? "Failed to create storefront");
        break;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Add Storefront"
        description="Choose a name and unique slug for this merchant’s storefront."
      >
        <ButtonGroup>
          <Button type="button" variant="secondary" asChild>
            <Link to=".." className="flex gap-2 items-center">
              <ArrowLeftIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </Header>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load merchant capabilities."
      >
        {createStorefrontLink ? (
          <StorefrontNewForm link={createStorefrontLink} onLifecycleEvent={handleEvent} />
        ) : (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Storefront creation is not available.
              </p>
            </CardContent>
          </Card>
        )}
      </QueryState>
    </div>
  );
}
