import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read the Hubology privacy policy to learn how we collect, use, store, and protect your personal data.",
  path: "/privacy-policy",
  keywords: ["Hubology privacy policy", "data protection", "personal data policy"],
});

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="07/01/2026">
      <h2>1. Introduction</h2>
      <p>
        Welcome to The HUBology, INC (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;). We are committed to protecting your personal
        information and your right to privacy. If you have any questions or
        concerns about this policy or our practices regarding your personal
        information, please contact us at Info@TheHUBology.com.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect personal information that you provide to us, information
        collected automatically when you visit our hub, and information from
        other sources.
      </p>
      <ul>
        <li>
          <strong>Personal Information You Provide:</strong> We collect names,
          email addresses, business details, phone numbers, payment information,
          and passwords when you register, subscribe, or purchase services on
          our platform.
        </li>
        <li>
          <strong>Automatically Collected Data:</strong> When you visit our
          platform, we automatically collect certain information such as your IP
          address, browser type, operating system, referring URLs, and browsing
          behavior via cookies and similar technologies.
        </li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use the information we collect for various business purposes,
        depending on how you interact with our hub:
      </p>
      <ul>
        <li>To facilitate account creation and the login process.</li>
        <li>To deliver, maintain, and improve our services.</li>
        <li>To process transactions and manage your orders.</li>
        <li>
          To send you marketing and promotional communications (you can opt-out
          at any time).
        </li>
        <li>To protect our platform and enforce our Terms and Conditions.</li>
      </ul>

      <h2>4. How We Share Your Information</h2>
      <p>
        We only share your information with your consent, to comply with laws,
        to provide you with services, or to protect your rights. Categories of
        third parties we may share data with include:
      </p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Third-party vendors who assist us
          with hosting, payment processing, data analytics, and email delivery.
        </li>
        <li>
          <strong>Legal Obligations:</strong> If required to do so by law or in
          response to valid requests by public authorities.
        </li>
      </ul>

      <h2>5. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to access or store
        information. You can set your browser to refuse all cookies or to
        indicate when a cookie is being sent. However, if you do not accept
        cookies, you may not be able to use some portions of our platform.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We implement appropriate technical and organizational security measures
        designed to protect the security of any personal information we process.
        However, please also remember that no method of transmission over the
        internet or method of electronic storage is 100% secure.
      </p>

      <h2>7. Your Data Rights</h2>
      <p>
        Depending on your location, you may have the right to access, update,
        correct, or delete your personal information. You may also have the
        right to object to or restrict certain processing of your data. To
        exercise these rights, please contact us at Info@TheHUBology.com.
      </p>

      <h2>8. Third-Party Websites</h2>
      <p>
        Our hub may contain links to third-party websites. We are not
        responsible for the privacy practices or the content of those
        third-party websites.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this privacy policy from time to time to reflect changes
        to our practices or for other operational, legal, or regulatory reasons.
        We will notify you of any changes by posting the new privacy policy on
        this page.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions or comments about this policy, you may email us at
        Info@TheHUBology.com.
      </p>
    </LegalLayout>
  );
}
