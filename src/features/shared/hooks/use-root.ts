import { MerchantRoot } from "@/features/shared/types/account-model";
import { useEntryLink } from "@khinemyaezin/seller-ui";
import { useQuery } from "@tanstack/react-query";
import { fetchRoot } from "../api/root";

export default function useRoot() {
    const entryLink = useEntryLink();

    return useQuery<MerchantRoot>({
        queryKey: ["merchant-root", entryLink?.href],
        queryFn: () => fetchRoot(entryLink!),
        enabled: !!entryLink,
    });
}