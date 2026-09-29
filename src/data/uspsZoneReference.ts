// Reference destinations by USPS zone from origin ZIP 91010.
// Zones are distance bands; always verify on the official USPS Zone Chart (postcalc.usps.com).
export interface ZoneReference {
  zone: number;
  miles: string;
  label: string;
  address: string;
}

export const USPS_ZONE_ORIGIN_ZIP = "91010";

export const USPS_ZONE_REFERENCE: ZoneReference[] = [
  { zone: 1, miles: "Local, under 50 mi", label: "Pasadena City Hall", address: "100 N Garfield Ave, Pasadena, CA 91101" },
  { zone: 2, miles: "Up to 50 mi", label: "Long Beach City Hall", address: "411 W Ocean Blvd, Long Beach, CA 90802" },
  { zone: 3, miles: "51 to 150 mi", label: "San Diego City Hall", address: "202 C St, San Diego, CA 92101" },
  { zone: 4, miles: "151 to 300 mi", label: "Las Vegas City Hall", address: "495 S Main St, Las Vegas, NV 89101" },
  { zone: 5, miles: "301 to 600 mi", label: "Phoenix City Hall", address: "200 W Washington St, Phoenix, AZ 85003" },
  { zone: 6, miles: "601 to 1,000 mi", label: "Denver City and County Building", address: "1437 Bannock St, Denver, CO 80202" },
  { zone: 7, miles: "1,001 to 1,400 mi", label: "Dallas City Hall", address: "1500 Marilla St, Dallas, TX 75201" },
  { zone: 8, miles: "1,401+ mi", label: "New York City Hall", address: "City Hall Park, New York, NY 10007" },
];

export const ZONE_MILES: Record<number, string> = Object.fromEntries(
  USPS_ZONE_REFERENCE.map((z) => [z.zone, z.miles]),
);
