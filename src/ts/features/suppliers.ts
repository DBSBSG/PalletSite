export type Inventory = "amazon" | "returns" | "overstock";
export type Purchase = "auction" | "direct";

interface Supplier {
  id: string;
  name: string;
  initials: string;
  color: string;
  description: string;
  inventory: readonly Inventory[];
  purchase: readonly Purchase[];
  url: string;
}

export const suppliers: readonly Supplier[] = [
  {
    id: "amazon",
    name: "Amazon Liquidation Auctions",
    initials: "AZ",
    color: "#f5cb8a",
    description:
      "Amazon’s official U.S. B2B storefront on B-Stock. Bid on bulk customer returns and overstock as an approved reseller.",
    inventory: ["amazon", "returns", "overstock"],
    purchase: ["auction"],
    url: "https://bstock.com/amazon/",
  },
  {
    id: "via-trading",
    name: "Via Trading",
    initials: "VT",
    color: "#a2ded2",
    description:
      "Wholesale case packs, pallets, and truckloads. Listings identify condition and whether each lot has a manifest.",
    inventory: ["amazon", "returns", "overstock"],
    purchase: ["direct"],
    url: "https://www.viatrading.com/products",
  },
  {
    id: "liquidation",
    name: "Liquidation.com",
    initials: "LC",
    color: "#c3ccfa",
    description:
      "A Liquidity Services marketplace with pallet auctions and some Buy Now listings. Check the buyer’s premium and freight.",
    inventory: ["returns", "overstock"],
    purchase: ["auction", "direct"],
    url: "https://www.liquidation.com/",
  },
  {
    id: "target",
    name: "Target Liquidation Auctions",
    initials: "TG",
    color: "#ffb7a2",
    description:
      "Target’s B-Stock storefront for bulk retail liquidation. Review the individual listing for condition and freight.",
    inventory: ["returns", "overstock"],
    purchase: ["auction"],
    url: "https://bstock.com/target/",
  },
  {
    id: "direct-liquidation",
    name: "Direct Liquidation",
    initials: "DL",
    color: "#dbdc9d",
    description:
      "A wholesale liquidation marketplace for pallets and truckloads. Confirm the available buying options for each lot.",
    inventory: ["returns", "overstock"],
    purchase: ["auction", "direct"],
    url: "https://www.directliquidation.com/",
  },
];
