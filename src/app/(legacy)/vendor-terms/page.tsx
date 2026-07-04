import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Vendor Terms & Conditions | Hubology",
  description: "Rules and guidelines for vendors on Hubology.",
};

export default function VendorTermsPage() {
  return (
    <LegalLayout title="Vendor Terms & Conditions Policy">
      <h2>1. Professional Vetting & Onboarding</h2>
      <ul>
        <li>
          <strong>Verification:</strong> Vendors must submit valid trade licenses, professional certifications, and liability insurance certificates.
        </li>
        <li>
          <strong>Background Checks:</strong> The Hub reserves the right to run identity and background screenings before approval.
        </li>
        <li>
          <strong>Identity Guard:</strong> Accounts belong strictly to the approved vendor and cannot be shared, sub-licensed, or transferred.
        </li>
      </ul>

      <h2>2. Service Listing & Pricing Standards</h2>
      <ul>
        <li>
          <strong>Scope Transparency:</strong> Listings must clearly detail the exact deliverables, exclusions, and milestones included in the service.
        </li>
        <li>
          <strong>Honest Pricing:</strong> All listed rates, hourly fees, or custom package quotes must be all-inclusive of core operational costs.
        </li>
        <li>
          <strong>No Bait-and-Switch:</strong> Vendors cannot increase pricing post-purchase unless the client requests an expansion of the project scope.
        </li>
        <li>
          <strong>Account Status:</strong> Only vendors in good standing (no active penalties or low ratings) can remain active on our platform.
        </li>
      </ul>

      <h2>Off-Platform Interaction & Limitation of Liability Policy</h2>

      <h2>1. Scope of Service & Platform Limits</h2>
      <ul>
        <li>
          <strong>Introduction Only:</strong> The HUBology, INC. operates solely as an introductory venue and digital matching directory.
        </li>
        <li>
          <strong>No Agency:</strong> No agency, partnership, joint venture, or employer-employee relationship is created between The HUBology, INC. and any vendor or customer.
        </li>
        <li>
          <strong>Boundary of Responsibility:</strong> Our corporate responsibility begins and ends entirely within the functional boundaries of our official digital platform.
        </li>
      </ul>

      <h2>2. Off-Platform Disintermediation & Liability Release</h2>
      <ul>
        <li>
          <strong>Total Indemnity:</strong> Once a vendor and customer establish a connection via the platform, any subsequent communications, contracts, payments, or physical interactions occur strictly at the parties' own risk.
        </li>
        <li>
          <strong>No Supervision:</strong> The HUBology, INC. does not monitor, manage, vet, or supervise any off-platform agreements, negotiations, or service executions.
        </li>
        <li>
          <strong>Waiver of Claims:</strong> Both vendors and customers explicitly waive any legal claims, demands, or damages against The HUBology, INC. arising from off-platform disputes, non-payment, poor service delivery, or personal conduct.
        </li>
      </ul>
    </LegalLayout>
  );
}
