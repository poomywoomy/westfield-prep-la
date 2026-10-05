import { createFileRoute } from "@tanstack/react-router";
import StorageWarehousing from "@/pages/StorageWarehousing";

import { faqSchemaData, serviceData } from "@/data/pageContent/StorageWarehousing";
import { serviceSchema, faqSchema, ldScripts } from "@/data/pageSchemas";

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
    scripts: ldScripts([serviceSchema(serviceData), faqSchema(faqSchemaData)]),
    links: [
          {
                "rel": "canonical",
                "href": "https://westfieldprepcenter.com/storage-warehousing"
          }
    ],
  }),
});
