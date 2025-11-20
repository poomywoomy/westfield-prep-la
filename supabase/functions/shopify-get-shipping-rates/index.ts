import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { shopifyGraphQL } from '../_shared/shopify-graphql.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShippingRateRequest {
  client_id: string;
  order_id?: string;
  package: {
    type: 'box' | 'envelope' | 'soft_package';
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  destination: {
    address1: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestData: ShippingRateRequest = await req.json();
    console.log('Fetching shipping rates:', requestData);

    // Get client's Shopify credentials
    const { data: client } = await supabase
      .from('clients')
      .select('shopify_store_domain, shopify_access_token')
      .eq('id', requestData.client_id)
      .single();

    if (!client?.shopify_store_domain || !client?.shopify_access_token) {
      throw new Error('Client Shopify credentials not found');
    }

    // Get prep center origin address
    const { data: configData } = await supabase
      .from('prep_center_config')
      .select('config_value')
      .eq('config_key', 'default_shipping_address')
      .single();

    const originAddress = configData?.config_value || {
      address1: "Your Address",
      city: "Los Angeles",
      province: "CA",
      postal_code: "90001",
      country: "US"
    };

    // Fetch real shipping rates from Shopify via GraphQL
    console.log('Fetching delivery profiles via GraphQL...');
    
    // Get client's Shopify location ID
    const { data: clientData } = await supabase
      .from('clients')
      .select('shopify_location_id')
      .eq('id', requestData.client_id)
      .single();

    let locationId = clientData?.shopify_location_id;
    
    // If no location, fetch and store primary location
    if (!locationId) {
      const locationsQuery = `
        query getLocations {
          locations(first: 10) {
            edges {
              node {
                id
                name
                isActive
              }
            }
          }
        }
      `;

      const locationsData = await shopifyGraphQL(
        client.shopify_store_domain,
        client.shopify_access_token,
        locationsQuery
      );

      const locations = locationsData.locations.edges.map((edge: any) => edge.node);
      const primaryLocation = locations.find((loc: any) => loc.isActive) || locations[0];
      
      if (primaryLocation) {
        locationId = primaryLocation.id;
        await supabase
          .from('clients')
          .update({ shopify_location_id: locationId.split('/').pop() })
          .eq('id', requestData.client_id);
      }
    } else {
      locationId = `gid://shopify/Location/${locationId}`;
    }

    if (!locationId) {
      throw new Error('No Shopify location found. Please configure your shipping settings in Shopify.');
    }

    // Fetch delivery profiles
    const deliveryProfileQuery = `
      query deliveryProfilesForLocation($locationId: ID!) {
        location(id: $locationId) {
          id
          name
          deliveryProfiles(first: 10) {
            edges {
              node {
                name
                profileLocationGroups {
                  locationGroupZones(first: 10) {
                    edges {
                      node {
                        methodDefinitions(first: 20) {
                          edges {
                            node {
                              name
                              active
                              rateProvider {
                                ... on DeliveryRateDefinition {
                                  price {
                                    amount
                                    currencyCode
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const deliveryData = await shopifyGraphQL(
      client.shopify_store_domain,
      client.shopify_access_token,
      deliveryProfileQuery,
      { locationId }
    );

    // Extract and format rates
    const rates = [];
    const profiles = deliveryData.location?.deliveryProfiles?.edges || [];
    
    for (const profileEdge of profiles) {
      const groups = profileEdge.node.profileLocationGroups || [];
      for (const group of groups) {
        const zones = group.locationGroupZones?.edges || [];
        for (const zoneEdge of zones) {
          const methods = zoneEdge.node.methodDefinitions?.edges || [];
          for (const methodEdge of methods) {
            const method = methodEdge.node;
            if (method.active && method.rateProvider?.price) {
              const basePrice = parseFloat(method.rateProvider.price.amount);
              // Adjust rate based on weight
              const weight = requestData.package.weight;
              const adjustedPrice = (basePrice * (1 + weight * 0.1)).toFixed(2);
              
              rates.push({
                service_name: method.name,
                service_code: method.name.toLowerCase().replace(/\s+/g, '_'),
                total_price: adjustedPrice,
                currency: method.rateProvider.price.currencyCode,
                delivery_days: "2-5"
              });
            }
          }
        }
      }
    }

    // If no rates found, provide friendly message
    if (rates.length === 0) {
      throw new Error('No shipping rates configured in Shopify. Please set up your delivery profiles in Shopify Admin → Settings → Shipping and delivery.');
    }

    console.log(`Found ${rates.length} shipping rates via GraphQL`);

    return new Response(
      JSON.stringify({ 
        rates: rates,
        origin: originAddress,
        destination: requestData.destination,
        source: 'shopify_delivery_profiles'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});