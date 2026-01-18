import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function HelpModal({ onClose }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);

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

  // Logic: Close the active answer if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleQuestion = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#2d2d2d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-[#444] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('help.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" ref={containerRef}>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-[#444] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleQuestion(index)}
                  className={`w-full text-left px-5 py-4 font-semibold flex justify-between items-center transition-colors duration-200 ${
                    openIndex === index
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#383838]'
                  }`}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-[#444]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#252525] border-t border-gray-200 dark:border-[#444] text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            {t('help.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
