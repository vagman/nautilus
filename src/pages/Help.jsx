import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

const Help = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  // Define FAQs using translation keys
  const faqs = [
    {
      question: t('help.q1'),
      answer: t('help.a1'),
    },
    {
      question: t('help.q2'),
      answer: (
        <span>
          {t('help.a2_prefix')}{' '}
          <a
            href="mailto:support@nautilus-fake.com"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            support@nautilus-fake.com
          </a>
        </span>
      ),
    },
    {
      question: t('help.q3'),
      answer: t('help.a3'),
    },
  ];

  const toggleQuestion = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 dark:border-[#333] pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('help.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">Frequently asked questions and support.</p>
      </div>

      {/* Intro Card */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 mb-8 flex items-start gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
          <Mail size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Need direct support?</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            If you can't find the answer you are looking for below, feel free to contact our support team.
          </p>
          <a
            href="mailto:support@nautilus-fake.com"
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contact Support &rarr;
          </a>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#252535] border border-gray-200 dark:border-[#333] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className={`w-full text-left px-6 py-5 font-semibold flex justify-between items-center transition-colors duration-200 ${
                openIndex === index
                  ? 'bg-gray-50 dark:bg-white/5 text-blue-600 dark:text-blue-400'
                  : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-blue-600 dark:text-blue-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-[#333]">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
