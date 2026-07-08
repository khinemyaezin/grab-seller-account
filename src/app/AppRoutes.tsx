import { routes, SellerPlatform } from "@khinemyaezin/seller-contracts";
import { HateoasLink } from "@khinemyaezin/seller-api";
import { EntryLinkProvider, PlatformProvider } from "@khinemyaezin/seller-ui";
import { Route, Routes } from "react-router";
import C2cOnboardingPage from "@/features/c2c-onboarding/pages/c2c-onboarding-page";
import RetailerOnboardingPage from "@/features/retailer-onboarding/pages/retailer-onboarding-page";
import MerchantSelectionPage from "@/features/merchant-selection/pages/merchant-selection-page";
import "../styles.css";

export default function AppRoutes({ link, platform }: {
  link: HateoasLink;
  platform?: SellerPlatform;
}) {
  return (
    <div className="seller-account-mfe">
      <PlatformProvider platform={platform}>
        <EntryLinkProvider link={link}>
          <Routes>
            <Route path="" element={<MerchantSelectionPage />} />
            <Route path={routes.individualOnboarding} element={<C2cOnboardingPage />} />
            <Route path={routes.retailerOnboarding} element={<RetailerOnboardingPage />} />
          </Routes>
        </EntryLinkProvider>
      </PlatformProvider>
    </div>
  );
}
