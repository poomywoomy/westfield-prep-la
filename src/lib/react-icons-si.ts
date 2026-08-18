// react-icons 5.7 (simple-icons) removed the Amazon, Walmart, and Magento marks.
// This shim re-exports everything from react-icons/si and backfills the three
// missing brands from the centralized BrandIcons component set.
export * from "react-icons/si";
export {
  AmazonIcon as SiAmazon,
  WalmartIcon as SiWalmart,
  MagentoIcon as SiMagento,
} from "@/components/BrandIcons";
