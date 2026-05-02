export interface TimelineStage {
  id: string;
  label: string;
  status: "completed" | "paused" | "pending";
  timestamp?: string;
  description: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  icon: "file-text" | "hash" | "dollar-sign" | "shield-alert" | "clock";
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "warning" | "success" | "action";
}

export interface ShipmentData {
  entryNumber: string;
  referenceNumber: string;
  origin: string;
  destination: string;
  currentLocation: string;
  beneficiary: string;
  currentStage: string;
  timeline: TimelineStage[];
  actions: ActionItem[];
  activity: ActivityEntry[];
}

export const mockShipment: ShipmentData = {
  entryNumber: "REF-MIA-04387YF",
  referenceNumber: "CBP-REF-56XXXRUIBGGFGHJJKU",
  origin: "Kelvin Miller",
  destination: "Naples, Florida",
  currentLocation: "Miami International Airport",
  beneficiary: "Margaretha Byers.",
  currentStage: "Legal Documentation Verification",
  timeline: [
    {
      id: "1",
      label: "Declaration & Intake",
      status: "completed",
      timestamp: "Mar 23, 2026 — 09:14 AM",
      description: "Declaration of personal effects and unaccompanied baggage successfully processed. Storage facility inventory logs and transfer-of-custody documents from the storage provider have been verified against the master manifest.",
    },
    {
      id: "2",
      label: "Duties & Taxes Assessment",
      status: "completed",
      timestamp: "Mar 24, 2026 — 02:37 PM",
      description: "Harmonized tariff classification applied. Duties calculated at 7.5% ad valorem. Payment notification issued.",
    },
    {
      id: "3",
      label: "Physical Inspection",
      status: "completed",
      timestamp: "Mar 28, 2026 — 11:20 AM",
      description: "Comprehensive physical inspection conducted by CBP officers. Contents were examined and verified against the declared manifest. Shipment consists of USD 2,200,000 in currency and 51 gold bars with a combined weight of 38.0 kg. All accompanying documentation and paperwork were reviewed and found to be complete, valid, and in full compliance. No discrepancies identified in quantity, condition, or documentation."
    },
    {
      id: "4",
      label: "Legal Documentation Verification",
      status: "paused",
      timestamp: "Mar 30, 2026 — 08:00 AM",
      description: "Review of ownership and legal authorization documents is currently underway. Additional supporting documentation may be required to confirm rightful claim and ensure compliance with applicable customs and regulatory requirements before final clearance.",
    },
    {
      id: "5",
      label: "Clearance Approval",
      status: "pending",
      description: "Final Customs & Border Protection release authorization.",
    },
  ],
  actions: [
    {
      id: "a1",
      title: "Submit Missing HTS Codes",
      description: "Harmonized Tariff Schedule codes required for 3 items in the shipment. Provide 10-digit HTS codes for accurate classification.",
      priority: "high",
      icon: "hash",
    },
    {
      id: "a2",
      title: "Pay Assessed Duties",
      description: "Duties of $1,247.50 have been assessed. Payment must be received before clearance can proceed.",
      priority: "high",
      icon: "dollar-sign",
    },
    {
      id: "a3",
      title: "Provide FDA Registration",
      description: "One item flagged as potentially FDA-regulated. Submit prior notice or proof of exemption.",
      priority: "medium",
      icon: "shield-alert",
    },
    {
      id: "a4",
      title: "Upload Commercial Invoice",
      description: "Updated commercial invoice needed reflecting corrected item quantities.",
      priority: "medium",
      icon: "file-text",
    },
  ],
  activity: [
    {
      id: "l0",
      timestamp: "Mar 30, 2026 — 08:00 AM",
      message: "Stage 'Legal Documentation Verification' initiated by Customs and Border Protection.",
      type: "info",
    },
    {
      id: "l1",
      timestamp: "Mar 30, 2026 — 08:25 AM",
      message: "Ownership records and details submitted for secondary review.",
      type: "info",
    },
    {
      id: "l3",
      timestamp: "Mar 30, 2026 — 09:45 AM",
      message: "Beneficiary identity confirmed: Margaretha Byers.",
      type: "success",
    },
    
    {
      id: "l2",
      timestamp: "Mar 30, 2026 — 09:10 AM",
      message: "Supporting legal documents flagged for further validation due to missing notarization.",
      type: "warning",
    },
    
    {
      id: "l4",
      timestamp: "Mar 30, 2026 — 10:00 AM",
      message: "Formal request issued for additional documentation to confirm rightful claim and authorized clearance.",
      type: "action",
    },
    {
      id: "l5",
      timestamp: "Mar 30, 2026 — 11:30 AM",
      message: "Clearance process paused. Pending submission of required supporting documentation for continued verification.",
      type: "action",
    },
  ],
};