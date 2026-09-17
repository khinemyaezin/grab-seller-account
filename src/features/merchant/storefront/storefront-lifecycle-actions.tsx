import { useState } from "react";
import { Button, ButtonStatus, Textarea } from "@khinemyaezin/seller-ui/components/index";
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group";
import { Field, FieldError, FieldLabel } from "@khinemyaezin/seller-ui/components/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@khinemyaezin/seller-ui/components/dialog";
import type { HateoasLink } from "@khinemyaezin/seller-api";
import type { StorefrontLifecycleEvent } from "@/features/merchant/types";
import {
  useActivateStorefrontMutation,
  useCloseStorefrontMutation,
  useReactivateStorefrontMutation,
  useSuspendStorefrontMutation,
} from "@/features/merchant/api/use-storefronts";
import { problemDetailMessage } from "@/features/merchant/lib/problem-detail";

export type StorefrontLifecycleActionsProps = {
  activateLink?: HateoasLink;
  suspendLink?: HateoasLink;
  reactivateLink?: HateoasLink;
  closeLink?: HateoasLink;
  onLifecycleEvent?: (event: StorefrontLifecycleEvent) => void;
};

type ConfirmKind = "activate" | "reactivate";

type ReasonKind = "suspend" | "close";

export default function StorefrontLifecycleActions({
  activateLink,
  suspendLink,
  reactivateLink,
  closeLink,
  onLifecycleEvent,
}: StorefrontLifecycleActionsProps) {
  const activateMutation = useActivateStorefrontMutation();
  const reactivateMutation = useReactivateStorefrontMutation();
  const suspendMutation = useSuspendStorefrontMutation();
  const closeMutation = useCloseStorefrontMutation();
  const [confirmKind, setConfirmKind] = useState<ConfirmKind | null>(null);
  const [reasonKind, setReasonKind] = useState<ReasonKind | null>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | undefined>();

  const pending =
    activateMutation.isPending
    || reactivateMutation.isPending
    || suspendMutation.isPending
    || closeMutation.isPending;

  const run = async (
    action: () => Promise<unknown>,
    success: StorefrontLifecycleEvent["type"],
    failure: StorefrontLifecycleEvent["type"],
    fallback: string,
  ) => {
    try {
      await action();
      onLifecycleEvent?.({ type: success } as StorefrontLifecycleEvent);
    } catch (error) {
      onLifecycleEvent?.({
        type: failure,
        message: problemDetailMessage(error, fallback),
      } as StorefrontLifecycleEvent);
    }
  };

  const handleConfirm = () => {
    if (confirmKind === "activate" && activateLink) {
      setConfirmKind(null);
      void run(
        () => activateMutation.mutateAsync(activateLink),
        "activated",
        "activateFailed",
        "Failed to activate storefront",
      );
    }
    if (confirmKind === "reactivate" && reactivateLink) {
      setConfirmKind(null);
      void run(
        () => reactivateMutation.mutateAsync(reactivateLink),
        "reactivated",
        "reactivateFailed",
        "Failed to reactivate storefront",
      );
    }
  };

  const handleReasonConfirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setReasonError("Reason is required");
      return;
    }
    if (trimmed.length > 1000) {
      setReasonError("Reason must not exceed 1000 characters");
      return;
    }
    if (reasonKind === "suspend" && suspendLink) {
      setReasonKind(null);
      setReason("");
      void run(
        () => suspendMutation.mutateAsync({ link: suspendLink, request: { reason: trimmed } }),
        "suspended",
        "suspendFailed",
        "Failed to suspend storefront",
      );
    }
    if (reasonKind === "close" && closeLink) {
      setReasonKind(null);
      setReason("");
      void run(
        () => closeMutation.mutateAsync({ link: closeLink, request: { reason: trimmed } }),
        "closed",
        "closeFailed",
        "Failed to close storefront",
      );
    }
  };

  if (!activateLink && !suspendLink && !reactivateLink && !closeLink) {
    return null;
  }

  return (
    <>
      <ButtonGroup>
        {activateLink && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => setConfirmKind("activate")}
          >
            <ButtonStatus
              status={activateMutation.isPending ? "pending" : "idle"}
              pendingLabel="Activating…"
            >
              Activate
            </ButtonStatus>
          </Button>
        )}
        {reactivateLink && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => setConfirmKind("reactivate")}
          >
            <ButtonStatus
              status={reactivateMutation.isPending ? "pending" : "idle"}
              pendingLabel="Reactivating…"
            >
              Reactivate
            </ButtonStatus>
          </Button>
        )}
        {suspendLink && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => {
              setReason("");
              setReasonError(undefined);
              setReasonKind("suspend");
            }}
          >
            <ButtonStatus
              status={suspendMutation.isPending ? "pending" : "idle"}
              pendingLabel="Suspending…"
            >
              Suspend
            </ButtonStatus>
          </Button>
        )}
        {closeLink && (
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() => {
              setReason("");
              setReasonError(undefined);
              setReasonKind("close");
            }}
          >
            <ButtonStatus
              status={closeMutation.isPending ? "pending" : "idle"}
              pendingLabel="Closing…"
            >
              Close
            </ButtonStatus>
          </Button>
        )}
      </ButtonGroup>

      <Dialog
        open={confirmKind !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmKind(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmKind === "activate" ? "Activate storefront?" : "Reactivate storefront?"}
            </DialogTitle>
            <DialogDescription>
              {confirmKind === "activate"
                ? "This storefront will become active for the merchant."
                : "This storefront will return to active status."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmKind(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              {confirmKind === "activate" ? "Activate" : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={reasonKind !== null}
        onOpenChange={(open) => {
          if (!open) setReasonKind(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reasonKind === "suspend" ? "Suspend storefront?" : "Close storefront?"}
            </DialogTitle>
            <DialogDescription>
              {reasonKind === "suspend"
                ? "Provide a reason. The merchant can still administer this storefront."
                : "Closing is permanent. Provide a reason."}
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={!!reasonError}>
            <FieldLabel htmlFor="lifecycle-reason">Reason</FieldLabel>
            <Textarea
              id="lifecycle-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setReasonError(undefined);
              }}
              maxLength={1000}
            />
            <FieldError errors={reasonError ? [{ message: reasonError }] : []} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReasonKind(null)}>
              Cancel
            </Button>
            <Button
              variant={reasonKind === "close" ? "destructive" : "default"}
              onClick={handleReasonConfirm}
            >
              {reasonKind === "suspend" ? "Suspend" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
