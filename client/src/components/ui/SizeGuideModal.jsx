import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const sizeData = {
  topwear: [
    { size: 'S', chest: '91-96', waist: '76-81', length: '68' },
    { size: 'M', chest: '99-104', waist: '84-89', length: '71' },
    { size: 'L', chest: '107-112', waist: '91-96', length: '74' },
    { size: 'XL', chest: '114-119', waist: '99-104', length: '76' },
    { size: 'XXL', chest: '122-127', waist: '107-112', length: '79' },
  ],
  bottomwear: [
    { size: '28', waist: '71', hip: '86', length: '101' },
    { size: '30', waist: '76', hip: '91', length: '104' },
    { size: '32', waist: '81', hip: '96', length: '107' },
    { size: '34', waist: '86', hip: '101', length: '108' },
    { size: '36', waist: '91', hip: '107', length: '109' },
  ],
  footwear: [
    { size: '6', footLength: '24.5' },
    { size: '7', footLength: '25.4' },
    { size: '8', footLength: '26.2' },
    { size: '9', footLength: '27.1' },
    { size: '10', footLength: '27.9' },
    { size: '11', footLength: '28.8' },
  ]
};

const BOTTOMWEAR_KEYWORDS = ['pant', 'trouser', 'jeans', 'jean', 'skirt', 'short', 'bottom'];
const FOOTWEAR_KEYWORDS = ['footwear', 'shoe', 'sneaker', 'boot', 'sandal', 'slipper'];

function detectCategory(subcategory) {
  if (!subcategory) return 'topwear';
  const lower = subcategory.toLowerCase();
  if (FOOTWEAR_KEYWORDS.some(k => lower.includes(k))) return 'footwear';
  if (BOTTOMWEAR_KEYWORDS.some(k => lower.includes(k))) return 'bottomwear';
  return 'topwear';
}

const TABS = [
  { key: 'topwear', label: 'Topwear' },
  { key: 'bottomwear', label: 'Bottomwear' },
  { key: 'footwear', label: 'Footwear' },
];

const measureTips = {
  topwear: [
    { label: 'Chest', tip: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
    { label: 'Waist', tip: 'Measure around the narrowest part of your natural waistline.' },
    { label: 'Length', tip: 'Measure from the highest point of the shoulder to the bottom hem.' },
  ],
  bottomwear: [
    { label: 'Waist', tip: 'Measure around where you normally wear your trousers.' },
    { label: 'Hip', tip: 'Measure around the fullest part of your hips, about 20 cm below the waist.' },
    { label: 'Length', tip: 'Measure from the waist down to the ankle bone.' },
  ],
  footwear: [
    { label: 'Foot Length', tip: 'Place your foot on paper, mark the heel and longest toe, then measure the distance in cm.' },
    { label: 'Tip', tip: 'If you are between sizes, we recommend going one size up for a comfortable fit.' },
  ],
};

export default function SizeGuideModal({ isOpen, onClose, subcategory }) {
  const [activeTab, setActiveTab] = useState('topwear');

  // Auto-select the correct tab based on product subcategory
  useEffect(() => {
    if (isOpen) {
      setActiveTab(detectCategory(subcategory));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, subcategory]);

  const data = sizeData[activeTab];
  const tips = measureTips[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full max-w-xl max-h-[85vh] pointer-events-auto"
            >
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">Size Guide</h2>
                  <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-cream-100 rounded-full transition-colors">
                    <FiX size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 sm:gap-2 mb-6">
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all leading-tight ${activeTab === tab.key
                          ? 'bg-ink text-white shadow-lg'
                          : 'bg-cream-50 text-ink-muted hover:bg-cream-100 border border-cream-200'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-ink-muted">
                    {activeTab === 'footwear'
                      ? 'Sizes shown in Indian (IND) standards. Foot length is in centimeters.'
                      : 'All measurements are in centimeters (cm). For the best fit, measure a similar garment you already own.'}
                  </p>

                  <div className="overflow-x-auto rounded-xl border border-cream-200 no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[320px] sm:min-w-[400px]">
                      <thead className="bg-cream-50">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-ink-muted uppercase tracking-wider">Size</th>
                          {Object.keys(data[0]).filter(k => k !== 'size').map(key => (
                            <th key={key} className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-ink-muted uppercase tracking-wider capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-100">
                        {data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-cream-50/50 transition-colors">
                            <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold text-ink">{row.size}</td>
                            {Object.entries(row).filter(([k]) => k !== 'size').map(([key, val]) => (
                              <td key={key} className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-ink-muted whitespace-nowrap">
                                {val}{key === 'footLength' ? ' cm' : activeTab !== 'footwear' ? ' cm' : ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-cream-50 p-4 sm:p-5 rounded-2xl border border-cream-200">
                    <h4 className="text-[10px] sm:text-xs font-bold text-ink uppercase tracking-wider mb-2 sm:mb-3">How to measure</h4>
                    <ul className="text-xs sm:text-sm text-ink-muted space-y-3 sm:space-y-2.5 list-none pl-0">
                      {tips.map(({ label, tip }) => (
                        <li key={label} className="flex flex-col sm:flex-row gap-0.5 sm:gap-2">
                          <span className="font-bold text-ink sm:min-w-[80px]">{label}:</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="btn-primary w-full mt-8 py-4 rounded-xl shadow-lg shadow-ink/10"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
