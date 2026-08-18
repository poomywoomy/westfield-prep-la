import { createFileRoute } from "@tanstack/react-router";
import StorageWarehousing from "@/pages/StorageWarehousing";

export const Route = createFileRoute("/storage-warehousing")({
  component: StorageWarehousing,
  head: () => ({
    meta: [
          {
                "title": "Warehousing and Fulfillment Services for Ecommerce USA"
          },
          {
                "name": "description",
                "content": "Warehouse in the USA for ecommerce offering storage and fulfillment solutions. Simplify inventory management and shipping with our reliable services. Start today!"
          },
          {
                "name": "keywords",
                "content": "3pl los angeles, los angeles 3pl, prep center, warehouse storage, pallet storage, climate controlled warehouse, ecommerce fulfillment"
          }
    ],
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/storage-warehousing"
          }
    ],
  }),
});
