import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type {
  StorefrontFormValues,
  StorefrontLifecycleEvent,
  StorefrontResponse,
  UpdateStorefrontProfileRequest,
} from "@/features/merchant/types";
import { useUpdateStorefrontMutation } from "@/features/merchant/api/use-storefronts";
import { problemDetailMessage } from "@/features/merchant/lib/problem-detail";
import StorefrontFieldset from "./storefront-fieldset";

export type StorefrontEditFormProps = {
  seed: StorefrontResponse;
  updateLink?: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

function toFormValues(storefront: StorefrontResponse): StorefrontFormValues {
  return {
    name: storefront.name,
    slug: storefront.slug,
  };
}

export default function StorefrontEditForm({
  seed,
  updateLink,
  onLifecycleEvent,
}: StorefrontEditFormProps) {
  const form = useForm<StorefrontFormValues>({
    defaultValues: toFormValues(seed),
    mode: "onSubmit",
  });
  const { handleSubmit, reset, formState: { isDirty } } = form;
  const updateMutation = useUpdateStorefrontMutation();
  const readOnly = !updateLink;

  useEffect(() => {
    reset(toFormValues(seed));
  }, [seed.storefrontId, seed.name, seed.slug, seed.updatedAt, reset]);

  const handleFormSubmit = async (values: StorefrontFormValues) => {
    if (!updateLink) return;
    const payload: UpdateStorefrontProfileRequest = {
      name: values.name.trim(),
      slug: values.slug.trim(),
    };
    try {
      await updateMutation.mutateAsync({ link: updateLink, request: payload });
      onLifecycleEvent?.({ type: "updated" });
    } catch (error) {
      onLifecycleEvent?.({
        type: "updateFailed",
        message: problemDetailMessage(error, "Failed to update storefront"),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
          <CardContent>
            <StorefrontFieldset disabled={readOnly} />
          </CardContent>
          {!readOnly && isDirty && (
            <CardFooter className="flex justify-end">
              <ButtonGroup>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <ButtonStatus
                    status={
                      updateMutation.isPending
                        ? "pending"
                        : updateMutation.isSuccess
                          ? "success"
                          : "idle"
                    }
                    pendingLabel="Saving…"
                    successLabel="Saved"
                  >
                    Save
                  </ButtonStatus>
                </Button>
              </ButtonGroup>
            </CardFooter>
          )}
        </Card>
      </form>
    </FormProvider>
  );
}
