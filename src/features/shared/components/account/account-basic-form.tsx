import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@khinemyaezin/seller-ui/components/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@khinemyaezin/seller-ui/components/field";
import { Input } from "@khinemyaezin/seller-ui/components/input";
import { HalLinks, HateoasLink } from "@khinemyaezin/seller-api";
import { useAccount } from "../../hooks";
import { AccountBasicFormValues } from "../../types/account-form";
import { ButtonStatus } from "@khinemyaezin/seller-ui/components/index";
import { CreateAccountRequest } from "../../types/account-request";
import { CreateSellerAccountResponse } from "../../types/account-response";

export type AccountBasicFormProps = {
    link: HateoasLink,
    onSuccess?: (response: HalLinks) => void,
}

export default function AccountBasicForm({ link, onSuccess }: AccountBasicFormProps) {
    const form = useForm<AccountBasicFormValues>();
    const { handleSubmit, register, formState: { errors } } = form;
    const submitAccount = useAccount();

    function handleOnSubmit(value: AccountBasicFormValues) {
        const payload: CreateAccountRequest = {
            displayName: value.displayName,
        }
        submitAccount.mutate(
            { link, request: payload },
            {
                onSuccess: (response: CreateSellerAccountResponse) => {
                    if (onSuccess) {
                        onSuccess(response._links)
                    }
                }
            },
        );
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <FieldGroup>
                    <Field data-invalid={!!errors.displayName}>
                        <FieldLabel htmlFor="displayName">Name</FieldLabel>
                        <Input
                            id="displayName"
                            {...register("displayName", { required: "Display Name is required" })}
                            required
                            aria-invalid={Boolean(errors.displayName)}
                        />
                        <FieldError errors={[errors.displayName]} />
                    </Field>
                </FieldGroup>

                <Button
                    type="submit"
                    variant="default"
                    size="default"
                    className="mt-6 w-full"
                    disabled={submitAccount.isPending || submitAccount.isSuccess}
                >
                    <ButtonStatus
                        status={
                            submitAccount.isPending
                                ? "pending"
                                : submitAccount.isSuccess
                                    ? "success"
                                    : "idle"
                        }
                        pendingLabel="Saving…"
                        successLabel="Saved"
                    >
                        Save & Continue
                    </ButtonStatus>
                </Button>
            </form>
        </FormProvider>
    );
}
