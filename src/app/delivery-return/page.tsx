// app/delivery-return-policy/page.tsx

import React from "react";

export const metadata = {
  title: "Delivery & Return Policy - Esefabrics",
  description: "Learn about our shipping, delivery times, and return policy at Esefabrics.",
};

export default function DeliveryReturnPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className='bg-primary text-text-dark text-center py-14 text-2xl mb-10'>
      <h1 className="text-3xl font-bold mb-6">Delivery & Return Policy</h1>
      </div>
      

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Shipping & Delivery</h2>
        <p>
          At Esefabrics, we strive to deliver your order in perfect condition and on time. All orders are processed within 1-2 business days. Once shipped, you will receive a confirmation email with tracking information.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>Standard Delivery (within Nigeria): 3–5 business days</li>
          <li>Express Delivery (within Nigeria): 1–2 business days</li>
          <li>International Delivery: 7–14 business days (depending on location)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Returns</h2>
        <p>
          We accept returns within <strong>7 days</strong> of delivery. Items must be unused, in original packaging, and in resalable condition. Certain items like clearance, customized, or intimate wear may not be eligible for return.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How to Initiate a Return</h2>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Email us at <a href="mailto:support@esefabrics.com" className="text-blue-600 underline">support@esefabrics.com</a> with your order number and reason for return.</li>
          <li>Wait for confirmation and return instructions.</li>
          <li>Package the item securely and send it back using a trackable method.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Refunds</h2>
        <p>
          Once we receive and inspect the returned item, we’ll notify you of the approval or rejection of your refund. If approved, the refund will be processed to your original payment method within 5–7 business days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p>
          For questions about shipping, returns, or anything else, please contact our support team at{" "}
          <a href="mailto:support@esefabrics.com" className="text-blue-600 underline">
            support@esefabrics.com
          </a>.
        </p>
      </section>
    </main>
  );
}
