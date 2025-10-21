# Barcode Scanner Setup Guide

## Supported Scanner Types

### 1. USB Wired Scanners (Recommended for Desktop)
**Best for:** Desktop/laptop workstations, receiving stations

USB scanners are the most reliable option for warehouse operations:
- Plug and play - no configuration needed
- Acts as keyboard wedge (types barcode like keyboard input)
- No batteries to charge or replace
- Consistent performance

**Popular Models:**
- Honeywell Voyager 1200g / 1202g (~$100-150)
- Symbol LS2208 (~$80-120)
- Zebra DS2208 (~$120-180)
- TaoTronics TT-BS030 (~$30-50, budget option)

**Setup Steps:**
1. Plug USB cable into computer
2. Scanner is ready immediately (may beep or flash to indicate ready state)
3. Point at barcode and press trigger
4. Barcode will appear in active input field

---

### 2. Bluetooth Wireless Scanners (Recommended for Mobile Workflows)
**Best for:** Warehouse floor mobility, cycle counting, receiving large shipments

Wireless scanners provide flexibility for moving around the warehouse:
- 30-100 foot wireless range
- Acts as keyboard wedge after pairing
- Rechargeable battery (8-12 hours typical)
- Hands-free operation

**Popular Models:**
- Socket Mobile S700 (~$200-250, excellent reliability)
- Honeywell Voyager 1602g (~$180-220)
- Zebra CS4070 (~$250-300)
- Tera 2D Wireless (~$60-80, budget option)

**Setup for iOS/Android Devices:**
1. Turn on scanner (hold power button for 3-5 seconds)
2. Scanner will enter pairing mode (blue LED flashing)
3. On your device: Settings → Bluetooth
4. Find scanner in available devices (e.g., "S700-XXXXX", "Voyager-XXXX")
5. Tap to pair (may require PIN: usually **0000** or **1234**)
6. Wait for "Connected" status (solid blue LED)
7. Open Westfield app and navigate to receiving/adjustment screen
8. Scanner will now input barcodes like a keyboard

**Setup for Windows:**
1. Turn on scanner
2. Windows Settings → Bluetooth & devices → Add device
3. Click "Bluetooth"
4. Select scanner from list
5. Enter PIN if prompted (usually **0000**)
6. Wait for "Connected" confirmation

**Setup for Mac:**
1. Turn on scanner
2. System Preferences → Bluetooth
3. Wait for scanner to appear in device list
4. Click "Connect"
5. Enter PIN if prompted (usually **0000**)

---

### 3. Camera Scanning (Built-in Fallback)
**Best for:** Occasional use, testing, no hardware available

The Westfield app includes camera-based scanning:
- Uses device's built-in camera
- No external hardware needed
- Slower than dedicated scanners
- Requires good lighting and steady hand

**Usage:**
1. Click camera icon in the app
2. Point camera at barcode (hold 4-8 inches away)
3. Wait for auto-detect (green flash + beep)
4. Barcode is automatically captured

**Tips for Better Camera Scans:**
- Use good overhead lighting
- Avoid shadows and glare
- Hold camera steady
- Ensure barcode fills ~60% of frame
- Clean camera lens if scans fail frequently

---

## Scanner Configuration Modes

Most professional scanners support multiple configuration modes. For best results with the Westfield app, ensure your scanner is configured in **"HID Keyboard Mode"** or **"USB-HID Mode"**.

### Important Configuration Settings

#### 1. HID Keyboard Mode (Critical)
This mode makes the scanner act like a keyboard, typing the barcode directly into the active input field.

**How to enable:**
- Most scanners ship in HID mode by default
- If not working, scan the **"USB-HID Mode"** or **"Bluetooth HID Mode"** barcode from your scanner's user manual
- Avoid "SPP Mode" (Serial Port Profile) - this will not work with web apps

#### 2. Add Suffix: Enter (Highly Recommended)
This automatically presses "Enter" after each scan, allowing rapid scanning without manual confirmation.

**How to enable:**
- Scan the **"Add Suffix: Enter"** or **"Add CR/LF"** configuration barcode from manual
- Test: Scan a barcode in a text editor - it should add a new line automatically

#### 3. Enable All Symbologies (Recommended)
Enables reading all barcode types: UPC, EAN, Code 128, QR, Data Matrix, etc.

**How to enable:**
- Scan **"Enable All Symbologies"** from manual
- Or scan individual barcode type enable codes (UPC-A, EAN-13, Code 128, etc.)

#### 4. Beep On Success (Recommended)
Provides audible feedback when a barcode is successfully read.

**How to enable:**
- Usually enabled by default
- Look for **"Beeper Volume"** settings in manual if you want to adjust

#### 5. Remove Prefix Characters (Optional)
Some scanners add prefix characters (like "]E0" for EAN) that can interfere with lookups.

**How to disable:**
- Scan **"Disable AIM Prefix"** or **"Disable Code ID"** from manual

---

## Common Configuration Barcodes

Most scanners can be configured by scanning special barcodes. Here are the most useful ones:

### Quick Setup Sequence (Scan These In Order)
1. **Factory Reset** (if scanner misbehaving)
2. **USB-HID Mode** or **Bluetooth HID Mode**
3. **Enable All Symbologies**
4. **Add Suffix: Enter**
5. **Disable AIM Prefix** (optional, if barcodes have extra characters)

**Note:** These configuration barcodes are specific to each scanner model and can be found in the user manual (usually available as PDF download from manufacturer website).

---

## Troubleshooting

### Scanner Not Working?

#### 1. Check Connection
- **USB:** LED should be solid (not blinking). Try a different USB port.
- **Bluetooth:** Check device Bluetooth settings - status should show "Connected"
- **Bluetooth:** If "Paired" but not "Connected", forget device and re-pair

#### 2. Test in Notepad/Text Editor
Open a text editor (Notepad on Windows, TextEdit on Mac) and try scanning:
- Barcode should appear as typed text
- If nothing appears: Scanner is not in HID keyboard mode
- If gibberish appears: Wrong character encoding or symbology disabled

#### 3. Check Battery (Wireless Only)
- Low battery reduces scan range and reliability
- Most scanners have LED indicator for battery level
- Charge for 2-4 hours before first use

#### 4. Re-pair Bluetooth Connection
If scanner was working but stopped:
1. On your device: Forget/Remove the scanner from Bluetooth
2. Turn scanner off and back on
3. Re-pair from scratch

#### 5. Check App Focus
- Click directly on the scanner input field in the app
- The blinking cursor should be visible in the input
- Some browsers require explicit focus before accepting keyboard input

---

### Scans But Doesn't Auto-Submit?

**Problem:** Barcode appears but you have to press Enter manually

**Solution:** Configure scanner to add "Enter" suffix
- Scan the **"Add Suffix: Enter"** configuration barcode from your manual
- Test: Scan should now trigger instant submission

---

### Scanner Connects But Doesn't Type?

**Problem:** Bluetooth shows "Connected" but scanning does nothing

**Likely Cause:** Scanner is in SPP Mode instead of HID Mode

**Solution:**
1. Check scanner manual for **"HID Mode"** configuration barcode
2. Scan that barcode to switch modes
3. Some scanners have a physical mode button - try pressing it to cycle modes
4. May need to forget device and re-pair after mode change

---

### Barcodes Scan With Extra Characters?

**Problem:** Scans show "]E0" or "]C1" before the actual barcode

**Cause:** AIM Code ID prefix is enabled

**Solution:**
- Scan **"Disable AIM Prefix"** or **"Disable Code ID"** from manual
- Or enable prefix stripping in Westfield app settings (if available)

---

### Certain Barcode Types Don't Scan?

**Problem:** Some barcodes work, others don't (e.g., UPC works but QR codes don't)

**Cause:** Specific symbologies are disabled

**Solution:**
- Scan **"Enable All Symbologies"** from manual
- Or individually enable: UPC-A, UPC-E, EAN-13, EAN-8, Code 128, QR Code, Data Matrix

---

### Scanner Works on Computer But Not on Phone?

**Cause:** Some scanners default to USB-HID for computers but require Bluetooth-HID mode for phones

**Solution:**
1. Scan **"Bluetooth HID Mode"** configuration barcode
2. Re-pair the scanner with your phone
3. Ensure scanner is in "iOS Mode" or "Android Mode" (check manual)

---

## Recommended Scanner Settings Summary

For optimal use with the Westfield app, configure your scanner with:

| Setting | Recommended Value | Why |
|---------|-------------------|-----|
| **Mode** | HID Keyboard / USB-HID | Allows typing into web app |
| **Suffix** | Enter (CR/LF) | Auto-submit after scan |
| **Symbologies** | All enabled (UPC, EAN, Code 128, QR, Data Matrix) | Read all barcode types |
| **Beep** | Enabled | Audible success feedback |
| **Prefix** | Disabled (no AIM Code ID) | Clean barcode data |
| **Character Set** | UTF-8 or US Keyboard | Correct character encoding |
| **Scan Mode** | Single scan (not continuous) | One scan per trigger pull |

---

## Performance Tips

### Maximize Scan Speed and Accuracy

1. **Use USB When Possible**
   - Faster response time (no wireless lag)
   - No battery concerns
   - More reliable for high-volume receiving

2. **Keep Scanners Charged**
   - Wireless scanners: Charge nightly
   - Low battery = reduced scan range (from 30ft to 5ft)
   - Set up charging station near packing area

3. **Clean Scanner Window Regularly**
   - Dirty lens = poor scan rates
   - Use microfiber cloth (no chemicals needed)
   - Weekly cleaning for high-use scanners

4. **Optimal Scanning Distance**
   - Hold 4-12 inches from barcode
   - Too close: Won't focus
   - Too far: Signal too weak

5. **Lighting Considerations**
   - Overhead LED lighting works best
   - Avoid direct sunlight on barcode (creates glare)
   - Avoid scanning in shadows
   - Laser scanners work better in bright light than camera-based

6. **Barcode Quality**
   - Wrinkled or damaged labels may not scan
   - Re-print damaged labels when possible
   - Flatten curved surfaces (boxes) when scanning

7. **Scanner Angle**
   - Hold perpendicular to barcode (not at sharp angle)
   - For glossy labels: Tilt slightly to reduce glare

---

## Purchasing Recommendations

### Budget: Under $50
- **TaoTronics TT-BS030** (USB) - ~$35
  - Good for light use, basic receiving
  - 1D barcodes only (no QR codes)
  
- **Tera 2D Wireless** (Bluetooth) - ~$60
  - Budget wireless option
  - 2D capable (QR codes, Data Matrix)
  - Shorter battery life than premium options

### Mid-Range: $100-200 (Best Value)
- **Honeywell Voyager 1200g** (USB) - ~$120
  - Industry standard, extremely reliable
  - Fast scanning, reads damaged barcodes well
  
- **Honeywell Voyager 1602g** (Bluetooth) - ~$180
  - Wireless version of 1200g
  - 100ft range, 12hr battery
  - Best all-around choice for warehouses

- **Symbol LS2208** (USB) - ~$100
  - Very durable (6ft drop spec)
  - Popular in retail/warehouse
  - Proven track record

### Premium: $200-400
- **Socket Mobile S700** (Bluetooth) - ~$250
  - Ruggedized, IP54 rated (dust/water resistant)
  - Excellent battery life (40 hours)
  - Best for high-volume operations
  
- **Zebra DS2208** (USB) - ~$180
  - 2D imager, reads phone screens
  - Extremely fast decode time
  - Good for e-commerce returns scanning

- **Zebra CS4070** (Bluetooth) - ~$280
  - Compact "companion scanner"
  - Pocket-sized, lightweight
  - Good for cycle counting

### Where to Buy
- **Amazon** - Wide selection, fast shipping
- **Barcode Giant** - Specialized retailer, expert support
- **CDW** - Business pricing, bulk discounts
- **Scanner manufacturer direct** - Best for volume purchases

---

## Advanced: Multi-Scanner Setups

For larger operations, you can use multiple scanners simultaneously:

### Multiple USB Scanners (Same Computer)
- Plug in multiple USB scanners
- All work independently, no configuration needed
- System treats each as a separate keyboard
- Useful for dual-station receiving desks

### Multiple Bluetooth Scanners (Same Device)
- Most phones/tablets support pairing 7+ Bluetooth devices
- However, only ONE scanner can be "connected" at a time
- To switch: Disconnect current scanner, connect to different one
- Not practical for simultaneous use - better to use multiple devices

### Shared Scanner Across Devices
- Bluetooth scanners can be paired with multiple devices
- Only connects to one device at a time
- To switch: Disconnect from Device A, connect to Device B
- Useful for shared equipment (e.g., supervisor scanner)

---

## Support Resources

### Manufacturer Support
- **Honeywell:** support.honeywell.com (excellent online docs + phone support)
- **Zebra:** zebra.com/support (live chat available)
- **Socket Mobile:** socketmobile.com/support
- **Symbol:** motorolasolutions.com/support

### User Manuals
Most scanners have PDF manuals available for download:
- Search "[Scanner Model] user manual PDF"
- Contains configuration barcodes and troubleshooting
- Print the "Quick Setup" page for reference

### Westfield Support
If scanner is configured correctly but app issues persist:
- Contact Westfield support: support@westfield3pl.com
- Include: Scanner model, device type (iPhone/Android/Windows), and description of issue

---

## FAQ

**Q: Can I use my phone's camera instead of buying a scanner?**
A: Yes! The Westfield app has built-in camera scanning. However, dedicated scanners are 5-10x faster and more reliable for high-volume receiving.

**Q: Will any USB barcode scanner work?**
A: Almost all USB scanners will work, as long as they're in "keyboard wedge" or "HID" mode. Avoid "serial" or "RS-232" scanners.

**Q: My scanner reads QR codes on paper but not on phone screens. Why?**
A: You need a 2D "imager" scanner, not a laser scanner. Laser scanners can't read backlit screens. Look for "2D" or "imager" in the model name.

**Q: Can I use a scanner with multiple computers?**
A: USB scanners: Yes, just move the USB cable. Bluetooth scanners: Yes, but must re-pair with each device.

**Q: How often should I charge wireless scanners?**
A: Charge nightly for best reliability. Most scanners beep or flash when battery is low (usually ~10% remaining).

**Q: Can I scan while charging (wireless scanners)?**
A: Yes, most Bluetooth scanners work while plugged into the charger.

**Q: What if I scan the wrong barcode?**
A: Press "Clear" or "Cancel" in the app, or manually delete the incorrect entry. The app validates barcodes before processing.

**Q: Can I use one scanner for both receiving and inventory adjustments?**
A: Yes, scanners work across all Westfield app functions (receiving, adjustments, order fulfillment, etc.).