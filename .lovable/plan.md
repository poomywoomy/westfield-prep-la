

## Plan: Update Refundable Setup Fee Wording

### Summary
Update the refundable setup fee language in Sections 5.1, 14.2 to clarify that the $500 is wired back to the customer after account closure, and that if the customer terminates, the post-termination removal fee is charged first, then the full $500 is refunded.

### Changes

**File: `src/lib/documentGenerator.ts`**

**Section 5.1 (Refundable)** -- Update to:
> "...a one-time account setup fee of Five Hundred U.S. Dollars ($500), which covers WMS account creation, system configuration, training, and ongoing technical support. This setup fee is fully refundable and will be wired back to Client upon the closure of Client's account and settlement of all outstanding balances."

**Section 14.2 (Refundable)** -- Update to:
> "Upon the termination of this Agreement for any reason, Client shall be charged an ad-hoc fee for the labor, handling, and processing required to remove and prepare any of Client's remaining products for outbound transfer from the warehouse. This fee must be paid in full prior to the release of the remaining inventory. Upon satisfaction of all outstanding balances, including the Post-Termination Removal Fee, the full Five Hundred U.S. Dollar ($500) account setup fee shall be refunded and wired back to Client."

### What Stays
- Non-refundable wording unchanged
- All other sections unchanged
- PDF branding, layout, signature blocks unchanged

