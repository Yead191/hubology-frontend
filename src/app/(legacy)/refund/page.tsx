import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Hubology",
  description: "Guidelines and procedures for returns and refunds.",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Return & Refund Policy" effectiveDate="07/01/2026">
      <h2>1. Overview</h2>
      <p>
        We want you to be completely satisfied with your purchase. If you are
        not entirely happy, we are here to help. This policy outlines the
        timeframe, eligibility, and methods for returns and refunds.
      </p>

      <h2>2. Returns Timeframe</h2>
      <p>
        You have <strong>3 days</strong> from the date of receiving your item to
        request a return.
      </p>

      <h2>3. Eligibility Requirements</h2>
      <p>
        To be eligible for a return, your item must meet the following
        conditions:
      </p>
      <ul>
        <li>
          <strong>Condition:</strong> The item must be unused, unworn, and in
          the exact same condition that you received it.
        </li>
        <li>
          <strong>Packaging:</strong> It must be in the original packaging with
          all tags attached.
        </li>
        <li>
          <strong>Proof of Purchase:</strong> You must provide a valid receipt
          or proof of purchase.
        </li>
      </ul>
      <p className="italic text-faint">
        Note: Certain items are exempt from being returned, such as digital
        products, downloadable software, or personalized/custom-made items.
      </p>

      <h2>4. The Return Process</h2>
      <p>To initiate a return, follow these steps:</p>
      <ul className="list-decimal space-y-2">
        <li>
          Contact our support team at <strong>Info@TheHUBology.com</strong> to
          request a Return Merchandise Authorization (RMA) number.
        </li>
        <li>
          Once approved, securely package the item and ship it to:
          <br />
          <strong>
            275 East Sandford BLVD #1128 MT. Vernon, NY 10550.
          </strong>
        </li>
      </ul>

      <h2>5. Shipping Costs</h2>
      <ul>
        <li>
          <strong>Customer-Initiated Returns:</strong> You will be responsible
          for paying for your own shipping costs for returning your item.
        </li>
        <li>
          <strong>Defective or Incorrect Items:</strong> If you received a
          defective, damaged, or incorrect item, we will cover the return
          shipping costs.
        </li>
      </ul>

      <h2>6. Refunds</h2>
      <p>
        Once we receive and inspect your returned item, we will notify you of
        the approval or rejection of your refund.
      </p>
      <ul>
        <li>
          If approved, your refund will be processed and applied to your
          original method of payment within <strong>[5-10]</strong> business
          days.
        </li>
        <li>
          <strong>Late or Missing Refunds:</strong> If you haven’t received a
          refund yet, first check your bank account again. Then contact your
          credit card company or bank, as it may take some time before your
          refund is officially posted.
        </li>
      </ul>

      <h2>7. Exchanges</h2>
      <p>
        If you need to exchange an item for a different size or color, please
        return the original item following the steps above and place a new order
        for the desired item.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions or concerns about our Return and Refund
        Policy, please reach out to us at <strong>Info@TheHUBology.com</strong>.
      </p>
    </LegalLayout>
  );
}
