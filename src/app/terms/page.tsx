// terms.tsx

"use client";

import Link from "next/link";
import React from "react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-text dark:text-text-dark">
      <h1 className="text-3xl font-bold mb-4 text-primary dark:text-primary-dark pb-10">Terms of Service</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using our website, you agree to comply with these Terms of Service. If you do not agree with any part of these terms, you are advised not to use our website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
        <p>
          All content, including text, images, graphics, and design elements on this site, is the intellectual property of our company. You are prohibited from copying, distributing, or creating derivative works from this content without explicit permission. Unauthorized use of our intellectual property may result in legal action.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Data and Privacy</h2>
        <p>
          The login form on this website collects basic information for demo purposes only. We do not use or share your information for any unauthorized or illegal purposes. Please review our Privacy Policy to understand more about how your data is handled.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
        <p>
          Our website is provided for informational and demonstrative purposes only. We are not liable for any loss or damage incurred by the user from reliance on the site’s information or functionalities. This site does not represent a fully functional product.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
        <p>
          We reserve the right to update or modify these Terms of Service at any time. Any changes will be effective upon posting to this page. Continued use of the site after changes implies acceptance of the revised terms.
        </p>
      </section>

      <p className="mt-4 text-sm">
        If you have any questions about these Terms of Service, please{" "}
        <Link href="https://wa.link/5my8vf" className="text-primary dark:text-primary-dark hover:underline">
          contact us
        </Link>.
      </p>
    </div>
  );
}
