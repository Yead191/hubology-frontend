import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata: Metadata = {
  title: "Terms and Conditions | Hubology",
  description: "Rules and guidelines for using Hubology.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms and Conditions">
      <h2>1. Introduction</h2>
      <p>
        Welcome to The HUBology, INC. By accessing or using our platform, you
        agree to be bound by these Terms and Conditions. If you do not agree to
        all these terms, please do not use our services. &quot;We,&quot;
        &quot;us,&quot; or &quot;our&quot; refers to The HUBology, INC, and
        &quot;you&quot; or &quot;user&quot; refers to the user of our platform.
      </p>

      <h2>2. Services Provided</h2>
      <p>
        The HUBology, INC is an online platform designed to connect
        professionals, share business resources, facilitate networking, and
        provide a marketplace for B2B services, freelance gigs, consulting. We
        reserve the right to modify, suspend, or discontinue any service at any
        time without notice.
      </p>

      <h2>3. User Accounts and Security</h2>
      <p>
        To access certain features, you may be required to create an account.
      </p>
      <ul>
        <li>You must be at least Age 18 years old to use this platform.</li>
        <li>
          You are responsible for keeping your password secure and for all
          activities that occur under your account.
        </li>
        <li>
          You agree to provide accurate, current, and complete information
          during registration.
        </li>
      </ul>

      <h2>4. Acceptable User Conduct</h2>
      <p>
        You agree to use the hub only for lawful purposes. You are strictly
        prohibited from:
      </p>
      <ul>
        <li>Harassing, threatening, or defrauding other members.</li>
        <li>Posting spam, malware, or unauthorized commercial solicitations.</li>
        <li>
          Violating the intellectual property rights of The HUBology, INC or any
          third party.
        </li>
        <li>Using the platform to promote illegal activities.</li>
      </ul>

      <h2>5. Fees and Payments</h2>
      <p>
        If you purchase premium memberships, list services, or process payments
        through the hub:
      </p>
      <ul>
        <li>All fees are listed in USD and are subject to change.</li>
        <li>You agree to provide valid billing information.</li>
        <li>
          Refund policies for subscriptions or services are handled on a
          case-by-case basis as outlined in our Return & Refund Policy.
        </li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        All content, features, and functionality on the hub—including text,
        graphics, logos, and software—are the exclusive property of The
        HUBology, INC and are protected by international copyright and trademark
        laws. You may not copy, distribute, or modify our proprietary material
        without prior written consent.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, The HUBology, INC shall not be
        liable for any indirect, incidental, special, or consequential damages
        resulting from your use of the platform, including loss of data,
        profits, or business opportunities. We are not responsible for the
        conduct of any user or third-party service provider on the hub.
      </p>

      <h2>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account and block
        access to the hub at our sole discretion, without notice, for conduct
        that we believe violates these Terms and Conditions or is harmful to our
        business or other users.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of New York, USA, without regard to its conflict of law principles.
        Any disputes arising under these terms shall be subject to the exclusive
        jurisdiction of the courts located in Mount Vernon, NY.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We reserve the right to update or change these Terms at any time. We
        will notify you of any major changes by posting the new Terms on this
        page. Your continued use of the platform after changes constitutes your
        acceptance of the new Terms.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at:
        Info@TheHUBology.com.
      </p>

      <h2>12. Vendors</h2>
      <p>
        Our platform operates solely as a digital venue connecting users with
        independent third-party vendors. We do not endorse, guarantee, or assume
        responsibility for the performance, quality, legality, or safety of any
        products or services provided by these vendors. Any agreements or
        transactions are strictly between you and the vendor.
      </p>
    </LegalLayout>
  );
}
