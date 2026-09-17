import { Header } from "@khinemyaezin/seller-ui/layout/header";
import StorefrontsView from "./storefronts-view";

export default function StorefrontListPage() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Header
        title="Storefronts"
        description="Create and manage the brand presence for this merchant."
      />
      <StorefrontsView />
    </div>
  );
}
