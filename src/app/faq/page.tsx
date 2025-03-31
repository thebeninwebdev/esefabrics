// app/faq/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "What types of fabrics do you sell?",
    answer: "At EseFabrics, we offer a wide range of premium fabrics including Ankara, Lace, Silk, Cotton, and Chiffon.",
  },
  {
    question: "Do you offer nationwide delivery?",
    answer: "Yes, we deliver to all 36 states in Nigeria and offer international shipping as well.",
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Yes. We accept returns within 7 days of delivery if the fabric is unused and in original condition.",
  },
  {
    question: "How long does delivery take?",
    answer: "Orders are typically processed within 24 hours. Delivery takes 1-3 working days within Nigeria and 5-10 days internationally.",
  },
  {
    question: "Do you accept custom orders?",
    answer: "Absolutely! If you need bulk or custom orders for events, reach out to us via the contact page.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <span className="text-lg font-medium">
                  {faq.question}
                </span>
                <span className="text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}