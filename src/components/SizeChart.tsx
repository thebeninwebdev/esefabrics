import { useState } from 'react';

const SizeChart: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSizeChart = (): void => {
    setIsOpen(!isOpen);
  };

  const closeSizeChart = (): void => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Size Guide Button */}
      <button
        onClick={toggleSizeChart}
        className="underline transition-colors"
      >
        Size Guide
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
          {/* Modal Content */}
          <div className="bg-white dark:bg-background-dark rounded-md shadow-lg w-full max-w-3xl relative animate-fadeIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="px-6 py-2 font-medium rounded-md">Size Guide</h2>
              <button onClick={closeSizeChart} className="">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Size Chart Table */}
            <div className="p-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Size</th>
                    <th className="py-3 px-4 text-left font-medium">US</th>
                    <th className="py-3 px-4 text-left font-medium">Bust</th>
                    <th className="py-3 px-4 text-left font-medium">Waist</th>
                    <th className="py-3 px-4 text-left font-medium">Low Hip</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">XS</td>
                    <td className="py-3 px-4">2</td>
                    <td className="py-3 px-4">32</td>
                    <td className="py-3 px-4">24 - 25</td>
                    <td className="py-3 px-4">33 - 34</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">S</td>
                    <td className="py-3 px-4">4</td>
                    <td className="py-3 px-4">26 - 27</td>
                    <td className="py-3 px-4">34 - 35</td>
                    <td className="py-3 px-4">35 - 36</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">M</td>
                    <td className="py-3 px-4">6</td>
                    <td className="py-3 px-4">28 - 29</td>
                    <td className="py-3 px-4">36 - 37</td>
                    <td className="py-3 px-4">38 - 40</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">L</td>
                    <td className="py-3 px-4">8</td>
                    <td className="py-3 px-4">30 - 31</td>
                    <td className="py-3 px-4">38 - 39</td>
                    <td className="py-3 px-4">42 - 44</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">XL</td>
                    <td className="py-3 px-4">10</td>
                    <td className="py-3 px-4">32 - 33</td>
                    <td className="py-3 px-4">40 - 41</td>
                    <td className="py-3 px-4">45 - 47</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">XXL</td>
                    <td className="py-3 px-4">12</td>
                    <td className="py-3 px-4">34 - 35</td>
                    <td className="py-3 px-4">42 - 43</td>
                    <td className="py-3 px-4">48 - 50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeChart;