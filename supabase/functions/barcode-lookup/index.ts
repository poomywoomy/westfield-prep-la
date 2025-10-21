import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

interface LookupRequest {
  barcode: string;
  client_id?: string;
  context?: 'receiving' | 'adjustment' | 'lookup' | 'asn_creation';
  asn_id?: string;
  user_id?: string;
}

interface LookupResponse {
  found: boolean;
  type: 'tracking' | 'product_upc' | 'product_ean' | 'product_fnsku' | 'product_client_sku' | 'unknown';
  matched_table?: 'asn_headers' | 'asn_lines' | 'skus';
  matched_id?: string;
  carrier?: string;
  data?: any;
  suggestions?: any[];
}

// Barcode type detection
const isTrackingNumber = (barcode: string): boolean => {
  if (!barcode || barcode.length < 10) return false;
  
  // UPS: Starts with "1Z", 18 characters
  if (/^1Z[0-9A-Z]{16}$/i.test(barcode)) return true;
  
  // FedEx: 12, 14, 15, or 20 digits
  if (/^\d{12}$|^\d{14}$|^\d{15}$|^\d{20}$/.test(barcode)) return true;
  
  // USPS: 20-22 digits or starts with 9400/9200
  if (/^(94|92)\d{20,22}$/.test(barcode)) return true;
  if (/^\d{20,22}$/.test(barcode)) return true;
  
  // DHL: 10-11 digits
  if (/^\d{10,11}$/.test(barcode)) return true;
  
  return false;
};

const detectBarcodeType = (barcode: string): string => {
  if (isTrackingNumber(barcode)) return 'tracking';
  
  // UPC formats
  if (/^\d{12}$/.test(barcode) || /^\d{8}$/.test(barcode)) return 'product_upc';
  
  // EAN formats
  if (/^\d{13}$/.test(barcode)) return 'product_ean';
  
  // FNSKU or other alphanumeric codes
  if (/^[A-Z0-9\-]+$/i.test(barcode) && barcode.length >= 6) return 'product_code';
  
  return 'unknown';
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: LookupRequest = await req.json();
    const { barcode, client_id, context = 'lookup', asn_id } = body;

    if (!barcode || barcode.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Barcode is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize barcode
    const normalizedBarcode = barcode.trim().toUpperCase().replace(/\s+/g, '');
    
    // Detect barcode type
    const detectedType = detectBarcodeType(normalizedBarcode);
    
    console.log(`[Barcode Lookup] User: ${user.id}, Barcode: ${normalizedBarcode}, Type: ${detectedType}, Context: ${context}`);

    let response: LookupResponse = {
      found: false,
      type: detectedType as any
    };

    const startTime = Date.now();

    // Special handling for receiving context with asn_id
    if (context === 'receiving' && asn_id && detectedType.startsWith('product_')) {
      // First find matching SKU
      let skuQuery = supabase
        .from('skus')
        .select('id')
        .or(`upc.eq.${normalizedBarcode},ean.eq.${normalizedBarcode},fnsku.eq.${normalizedBarcode},asin.eq.${normalizedBarcode},client_sku.ilike.${normalizedBarcode}`);
      
      if (client_id) {
        skuQuery = skuQuery.eq('client_id', client_id);
      }
      
      const { data: matchedSkus } = await skuQuery;
      
      if (matchedSkus && matchedSkus.length > 0) {
        // Search for ASN lines with this SKU
        const { data: asnLines, error: asnError } = await supabase
          .from('asn_lines')
          .select(`
            id,
            expected_units,
            received_units,
            normal_units,
            damaged_units,
            quarantined_units,
            missing_units,
            lot_number,
            expiry_date,
            notes,
            skus (
              id,
              client_sku,
              title,
              brand,
              upc,
              ean,
              fnsku,
              asin,
              has_lot_tracking,
              has_expiration,
              status
            )
          `)
          .eq('asn_id', asn_id)
          .in('sku_id', matchedSkus.map(s => s.id));

      if (asnLines && asnLines.length > 0 && !asnError) {
        const matchedLine = asnLines[0];
        const sku = matchedLine.skus as any;
        
        // Determine specific match type
        let specificType: any = 'product_upc';
        if (sku.upc === normalizedBarcode) specificType = 'product_upc';
        else if (sku.ean === normalizedBarcode) specificType = 'product_ean';
        else if (sku.fnsku === normalizedBarcode) specificType = 'product_fnsku';
        else if (sku.client_sku?.toUpperCase() === normalizedBarcode) specificType = 'product_client_sku';

        response = {
          found: true,
          type: specificType,
          matched_table: 'asn_lines',
          matched_id: matchedLine.id,
          data: {
            line_id: matchedLine.id,
            expected_units: matchedLine.expected_units,
            received_units: matchedLine.received_units,
            remaining_units: matchedLine.expected_units - matchedLine.received_units,
            normal_units: matchedLine.normal_units,
            damaged_units: matchedLine.damaged_units,
            quarantined_units: matchedLine.quarantined_units,
            missing_units: matchedLine.missing_units,
            lot_number: matchedLine.lot_number,
            expiry_date: matchedLine.expiry_date,
            sku: sku
          }
        };
      }
    }
  }
    // Adjustment context: return current inventory levels
    else if (context === 'adjustment' && client_id && detectedType.startsWith('product_')) {
      const { data: skuMatch } = await supabase
        .from('skus')
        .select('*')
        .eq('client_id', client_id)
        .eq('status', 'active')
        .or(`upc.eq.${normalizedBarcode},ean.eq.${normalizedBarcode},fnsku.eq.${normalizedBarcode},asin.eq.${normalizedBarcode},client_sku.ilike.${normalizedBarcode}`)
        .maybeSingle();

      if (skuMatch) {
        // Get current inventory level from most recent ledger entry
        const { data: inventory } = await supabase
          .from('inventory_ledger')
          .select('qty_after, location_id')
          .eq('sku_id', skuMatch.id)
          .order('ts', { ascending: false })
          .limit(1)
          .maybeSingle();

        let specificType: any = 'product_upc';
        if (skuMatch.upc === normalizedBarcode) specificType = 'product_upc';
        else if (skuMatch.ean === normalizedBarcode) specificType = 'product_ean';
        else if (skuMatch.fnsku === normalizedBarcode) specificType = 'product_fnsku';
        else if (skuMatch.client_sku?.toUpperCase() === normalizedBarcode) specificType = 'product_client_sku';

        response = {
          found: true,
          type: specificType,
          matched_table: 'skus',
          matched_id: skuMatch.id,
          data: {
            sku: skuMatch,
            current_qty: inventory?.qty_after || 0,
            location_id: inventory?.location_id || null
          }
        };
      }
    }
    // Search based on detected type
    else if (detectedType === 'tracking') {
      // Search ASN headers with full details including lines
      let query = supabase
        .from('asn_headers')
        .select(`
          id, 
          asn_number, 
          tracking_number, 
          carrier, 
          eta, 
          status, 
          client_id,
          ship_from,
          notes,
          created_at,
          clients!inner(company_name),
          asn_lines (
            id,
            expected_units,
            received_units,
            sku_id,
            skus (
              id,
              client_sku,
              title,
              fnsku,
              asin,
              upc,
              ean
            )
          )
        `)
        .eq('tracking_number', normalizedBarcode);

      if (client_id) {
        query = query.eq('client_id', client_id);
      }

      const { data: asnData, error: asnError } = await query.maybeSingle();

      if (asnData && !asnError) {
        response = {
          found: true,
          type: 'tracking',
          matched_table: 'asn_headers',
          matched_id: asnData.id,
          data: asnData
        };
      }
    } else if (detectedType.startsWith('product_')) {
      // Search SKUs by multiple fields
      let query = supabase
        .from('skus')
        .select(`
          id, 
          client_id, 
          client_sku, 
          title, 
          brand,
          upc, 
          ean, 
          fnsku, 
          asin,
          status,
          clients!inner(company_name)
        `)
        .eq('status', 'active');

      // Add client filter if provided
      if (client_id) {
        query = query.eq('client_id', client_id);
      }

      // Search across multiple barcode fields
      query = query.or(`upc.eq.${normalizedBarcode},ean.eq.${normalizedBarcode},fnsku.eq.${normalizedBarcode},asin.eq.${normalizedBarcode},client_sku.ilike.${normalizedBarcode}`);

      const { data: skuData, error: skuError } = await query;

      if (skuData && skuData.length > 0 && !skuError) {
        const matchedSku = skuData[0];

        // Determine specific match type
        let specificType: any = 'product_upc';
        if (matchedSku.upc === normalizedBarcode) specificType = 'product_upc';
        else if (matchedSku.ean === normalizedBarcode) specificType = 'product_ean';
        else if (matchedSku.fnsku === normalizedBarcode) specificType = 'product_fnsku';
        else if (matchedSku.client_sku?.toUpperCase() === normalizedBarcode) specificType = 'product_client_sku';

        // Fetch current inventory
        const { data: inventoryData } = await supabase
          .from('inventory_summary')
          .select('on_hand, available, reserved')
          .eq('sku_id', matchedSku.id)
          .maybeSingle();

        response = {
          found: true,
          type: specificType,
          matched_table: 'skus',
          matched_id: matchedSku.id,
          data: {
            ...matchedSku,
            inventory: inventoryData || { on_hand: 0, available: 0, reserved: 0 }
          }
        };
      } else {
        // Provide fuzzy search suggestions
        const { data: suggestions } = await supabase
          .from('skus')
          .select('id, client_sku, title, upc, ean, fnsku')
          .eq('status', 'active')
          .or(`client_sku.ilike.%${normalizedBarcode}%,title.ilike.%${normalizedBarcode}%`)
          .limit(5);

        response.suggestions = suggestions || [];
      }
    }

    // Enhanced carrier detection for not found tracking numbers
    if (!response.found && detectedType === 'tracking') {
      let detectedCarrier = 'Unknown';
      if (normalizedBarcode.startsWith('1Z')) detectedCarrier = 'UPS';
      else if (/^94\d{20}$/.test(normalizedBarcode)) detectedCarrier = 'USPS';
      else if (/^92\d{20}$/.test(normalizedBarcode)) detectedCarrier = 'USPS';
      else if (/^\d{12}$/.test(normalizedBarcode)) detectedCarrier = 'FedEx';
      else if (/^\d{14}$/.test(normalizedBarcode)) detectedCarrier = 'FedEx';
      else if (/^\d{15}$/.test(normalizedBarcode)) detectedCarrier = 'FedEx';
      else if (/^\d{20}$/.test(normalizedBarcode)) detectedCarrier = 'FedEx';
      else if (/^\d{10,11}$/.test(normalizedBarcode)) detectedCarrier = 'DHL';
      
      response.carrier = detectedCarrier;
    }

    const scanDuration = Date.now() - startTime;

    // Log the scan to barcode_scans table
    await supabase
      .from('barcode_scans')
      .insert({
        user_id: user.id,
        client_id: client_id || response.data?.client_id,
        barcode_value: normalizedBarcode,
        detected_type: detectedType,
        matched_table: response.matched_table,
        matched_id: response.matched_id,
        scan_result: response.found ? 'found' : 'not_found',
        context_type: context,
        device_type: 'system', // Will be enhanced in UI to detect actual device
        scan_duration_ms: scanDuration
      });

    console.log(`[Barcode Lookup] Result: ${response.found ? 'FOUND' : 'NOT FOUND'} in ${scanDuration}ms`);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[Barcode Lookup] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
