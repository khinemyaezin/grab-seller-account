import { HateoasLink } from "@khinemyaezin/seller-api"
import { FieldLegend, FieldSet, Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@khinemyaezin/seller-ui/components/index"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router"
import { routes } from "@khinemyaezin/seller-contracts"

export type MerchantTypeSelectionViewProps = {
}

export default function MerchantTypeSelectionView({ }: MerchantTypeSelectionViewProps) {
    return (
        <FieldSet>
            <FieldLegend>What type of business do you have?</FieldLegend>
            <div className="flex w-full max-w-md flex-col gap-3">
                <Item variant="outline" asChild>
                    <Link to={routes.individualOnboarding}>
                        <ItemContent>
                            <ItemTitle>Individual Seller (C2C)</ItemTitle>
                            <ItemDescription>
                                For individuals and small independent sellers.
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>
                </Item>
                <Item variant="outline" asChild>
                    <Link to={routes.retailerOnboarding}>
                        <ItemContent>
                            <ItemTitle>Retailer & Business</ItemTitle>
                            <ItemDescription>
                                For registered businesses and enterprise retailers.
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <ChevronRightIcon className="size-4" />
                        </ItemActions>
                    </Link>
                </Item>
            </div>
        </FieldSet>


    )
}