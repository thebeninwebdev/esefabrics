// app/terms/page.tsx

import React from "react";

export const metadata = {
  title: "Terms & Conditions - Esefabrics",
  description: "Review the terms and conditions for using Esefabrics, your trusted eCommerce destination.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className='bg-primary text-text-dark text-center py-14 text-2xl mb-10'>
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to Esefabrics. By accessing our website and placing an order, you agree to be bound by the following Terms and Conditions. Please read them carefully. If you do not agree with any part of these terms, you must refrain from using our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
        <p>
          To shop on Esefabrics, you must be at least 18 years old or have parental consent. By using our site, you represent that you meet this requirement and have the legal capacity to enter into a binding contract.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Product Information</h2>
        <p>
          We strive to provide accurate descriptions and images of our products. However, colors may appear slightly different due to screen settings. All products are subject to availability, and we reserve the right to withdraw items at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Pricing & Payments</h2>
        <p>
          All prices are listed in Nigerian Naira (₦) unless otherwise stated. We reserve the right to change prices at any time without prior notice. Payment must be made in full at checkout using our accepted payment methods. Esefabrics is not responsible for any additional bank charges or currency conversion fees.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Order Processing & Shipping</h2>
        <p>
          Orders are processed within 1–2 business days. You will receive a confirmation email once your order has been shipped, along with tracking information. Delivery times vary depending on your location. For full details, please refer to our <a href="/delivery-return-policy" className="text-blue-600 underline">Delivery & Return Policy</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Returns & Refunds</h2>
        <p>
          We accept returns within 7 days of delivery, provided the item is unused and in original condition. Refunds are issued to the original payment method within 5–7 business days of approval. Return shipping costs are the responsibility of the customer unless the item is faulty or incorrect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. User Conduct</h2>
        <p>
          You agree not to misuse our website, post misleading information, or engage in any activity that may harm Esefabrics, its customers, or third parties. We reserve the right to suspend or terminate accounts that violate these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Intellectual Property</h2>
        <p>
          All content on Esefabrics, including text, images, logos, and designs, is the property of Esefabrics and is protected by copyright laws. You may not use or reproduce our content without written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Limitation of Liability</h2>
        <p>
          Esefabrics shall not be held liable for any indirect, incidental, or consequential damages resulting from the use of our website or products. We do not guarantee that our website will be error-free or uninterrupted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">10. Changes to Terms</h2>
        <p>
          We may update these Terms & Conditions from time to time. Any changes will be posted on this page with the revised date. Your continued use of the website constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, please reach out to us at{" "}
          <a href="mailto:support@esefabrics.com" className="text-blue-600 underline">
            support@esefabrics.com
          </a>.
        </p>
      </section>
    </main>
  );
}
