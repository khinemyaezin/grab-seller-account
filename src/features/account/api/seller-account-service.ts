import { api, HateoasLink } from "@khinemyaezin/seller-api";
import { SellerAccount } from "../types";
import { MerchantRoot } from "@/features/shared/types/account-model";
import { fetchRoot } from "@/features/shared/api/root";
import { SellerAccountResponse } from "@/features/shared/types/account-response";

export interface SellerAccountServiceFacade {
    getAccount: () => Promise<SellerAccount>;
}

export function createSellerAccountService(entryLink: HateoasLink): SellerAccountServiceFacade {
    let discoveryPromise: Promise<MerchantRoot> | null = null;

    const ensureDiscovery = (): Promise<MerchantRoot> => {
        if (!discoveryPromise) {
            discoveryPromise = fetchRoot(entryLink).catch((error) => {
                discoveryPromise = null;
                throw error;
            });
        }
        return discoveryPromise;
    }

    const getAccount = async (): Promise<SellerAccount> => {
        const root = await ensureDiscovery();
        if (!root.getCurrentMerchant) {
            throw new Error("Identity root does not expose a 'get-current-merchant' link");
        }
        return api.followLink<SellerAccountResponse>(root.getCurrentMerchant, "GET");
    }

    return {
        getAccount
    }
}