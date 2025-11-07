import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

    // Prepare shipping rate request for Shopify
    const apiVersion = '2024-07';
    const shopifyUrl = `https://${client.shopify_store_domain}/admin/api/${apiVersion}/carrier_services.json`;

    // For now, return mock rates since Shopify Carrier Service requires app setup
    // In production, you would call Shopify's actual shipping rate API
    const mockRates = [
      {
        service_name: "USPS Priority Mail",
        service_code: "usps_priority",
        total_price: "12.50",
        currency: "USD",
        delivery_days: "2-3"
      },
      {
        service_name: "USPS First Class",
        service_code: "usps_first_class",
        total_price: "5.99",
        currency: "USD",
        delivery_days: "3-5"
      },
      {
        service_name: "UPS Ground",
        service_code: "ups_ground",
        total_price: "15.99",
        currency: "USD",
        delivery_days: "3-5"
      },
      {
        service_name: "FedEx 2Day",
        service_code: "fedex_2day",
        total_price: "22.50",
        currency: "USD",
        delivery_days: "2"
      }
    ];

    // Calculate approximate rates based on weight and dimensions
    const weight = requestData.package.weight;
    const adjustedRates = mockRates.map(rate => ({
      ...rate,
      total_price: (parseFloat(rate.total_price) * (1 + weight * 0.1)).toFixed(2)
    }));

    console.log('Returning shipping rates:', adjustedRates);

    return new Response(
      JSON.stringify({ 
        rates: adjustedRates,
        origin: originAddress,
        destination: requestData.destination
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