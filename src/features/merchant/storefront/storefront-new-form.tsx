import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@khinemyaezin/seller-ui/components/card";
import { Button, ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { CreateStorefrontRequest, StorefrontFormValues, StorefrontLifecycleEvent } from "@/features/merchant/types";
import { useCreateStorefrontMutation } from "@/features/merchant/api/use-storefronts";
import { problemDetailMessage } from "@/features/merchant/lib/problem-detail";
import { toStorefrontSlug } from "@/features/merchant/lib/to-storefront-slug";
import StorefrontFieldset from "./storefront-fieldset";

export type StorefrontNewFormProps = {
  link: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

const DEFAULT_FORM_VALUES: StorefrontFormValues = {
  name: "",
  slug: "",
};

export default function StorefrontNewForm({ link, onLifecycleEvent }: StorefrontNewFormProps) {
  const form = useForm<StorefrontFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });
  const { handleSubmit, reset, setValue, formState: { isDirty } } = form;
  const createMutation = useCreateStorefrontMutation();
  const slugManualRef = useRef(false);

  const handleNameChange = (name: string) => {
    if (slugManualRef.current) return;
    setValue("slug", toStorefrontSlug(name), { shouldDirty: true, shouldValidate: true });
  };

  const handleFormSubmit = async (values: StorefrontFormValues) => {
    const payload: CreateStorefrontRequest = {
      name: values.name.trim(),
      slug: values.slug.trim(),
    };
    try {
      await createMutation.mutateAsync({ link, request: payload });
      reset(DEFAULT_FORM_VALUES);
      onLifecycleEvent?.({ type: "created" });
    } catch (error) {
      onLifecycleEvent?.({
        type: "createFailed",
        message: problemDetailMessage(error, "Failed to create storefront"),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
          <CardContent>
            <StorefrontFieldset
              onNameChange={handleNameChange}
              onSlugEdit={() => { slugManualRef.current = true; }}
            />
          </CardContent>
          {isDirty && (
            <CardFooter className="flex justify-end">
              <ButtonGroup>
                <Button type="submit" disabled={createMutation.isPending || createMutation.isSuccess}>
                  <ButtonStatus
                    status={
                      createMutation.isPending
                        ? "pending"
                        : createMutation.isSuccess
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
