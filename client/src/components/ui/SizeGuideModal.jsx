import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const sizeData = {
  topwear: [
    { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
    { size: 'M', chest: '39-41', waist: '33-35', length: '28' },
    { size: 'L', chest: '42-44', waist: '36-38', length: '29' },
    { size: 'XL', chest: '45-47', waist: '39-41', length: '30' },
    { size: 'XXL', chest: '48-50', waist: '42-44', length: '31' },
  ],
  bottomwear: [
    { size: '28', waist: '28', hip: '34', length: '40' },
    { size: '30', waist: '30', hip: '36', length: '41' },
    { size: '32', waist: '32', hip: '38', length: '42' },
    { size: '34', waist: '34', hip: '40', length: '42.5' },
    { size: '36', waist: '36', hip: '42', length: '43' },
  ]
};

export default function SizeGuideModal({ isOpen, onClose, category = 'topwear' }) {
  // Determine which chart to show based on category
  const activeCategory = category.toLowerCase().includes('pant') || 
                        category.toLowerCase().includes('trouser') || 
                        category.toLowerCase().includes('jeans') ||
                        category.toLowerCase().includes('skirt')
                        ? 'bottomwear' : 'topwear';
  
  const data = sizeData[activeCategory];

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
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col h-fit max-h-[90vh]"
          >
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-ink">Size Guide</h2>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">{activeCategory}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-cream-100 rounded-full transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-ink-muted">
                  Measurements are shown in inches. For the best fit, we recommend measuring a similar garment you already own.
                </p>

                <div className="overflow-x-auto rounded-xl border border-cream-200">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead className="bg-cream-50">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold text-ink-muted uppercase tracking-wider">Size</th>
                        {Object.keys(data[0]).filter(k => k !== 'size').map(key => (
                          <th key={key} className="px-4 py-3 text-xs font-bold text-ink-muted uppercase tracking-wider capitalize">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cream-50/50 transition-colors">
                          <td className="px-4 py-4 text-sm font-bold text-ink">{row.size}</td>
                          {Object.entries(row).filter(([k]) => k !== 'size').map(([key, val]) => (
                            <td key={key} className="px-4 py-4 text-sm text-ink-muted">{val}"</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-cream-50 p-5 rounded-2xl border border-cream-200">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">How to measure</h4>
                  <ul className="text-sm text-ink-muted space-y-2.5 list-none pl-0">
                    {activeCategory === 'topwear' ? (
                      <>
                        <li className="flex gap-2">
                          <span className="font-bold text-ink min-w-[60px]">Chest:</span> 
                          <span>Measure around the fullest part of your chest.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-ink min-w-[60px]">Waist:</span> 
                          <span>Measure around the narrowest part of your waistline.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-ink min-w-[60px]">Length:</span> 
                          <span>Measure from the highest point of the shoulder to the bottom.</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex gap-2">
                          <span className="font-bold text-ink min-w-[60px]">Waist:</span> 
                          <span>Measure around where you normally wear your trousers.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-ink min-w-[60px]">Hip:</span> 
                          <span>Measure around the fullest part of your hips.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-ink min-w-[60px]">Length:</span> 
                          <span>Measure from the waist down to the ankle.</span>
                        </li>
                      </>
                    )}
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
        </>
      )}
    </AnimatePresence>
  );
}
