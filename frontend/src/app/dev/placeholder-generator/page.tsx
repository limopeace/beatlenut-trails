'use client';

import React, { useState } from 'react';
import GeneratePlaceholderImage from '../../../components/common/GeneratePlaceholderImage';

const PlaceholderGeneratorPage = () => {
  const [text, setText] = useState('Placeholder Image');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState('#E2E8F0');
  const [textColor, setTextColor] = useState('#718096');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Placeholder Image Generator</h1>
      <p className="mb-6 text-gray-600">
        This tool helps you generate placeholder images with custom text, dimensions, and colors.
        The generated image will be shown below as a data URL that you can copy and use in your application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Image Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="p-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="p-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
          <GeneratePlaceholderImage
            text={text}
            width={width}
            height={height}
            bgColor={bgColor}
            textColor={textColor}
          />
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Customize the placeholder image with your desired text, dimensions, and colors.</li>
          <li>Copy the generated Data URL from the text area.</li>
          <li>Use the Data URL as a fallback src in your NextImage components.</li>
          <li>
            Example: 
            <pre className="mt-2 p-3 bg-gray-100 rounded overflow-x-auto text-sm">
              {`<NextImage
  src="/images/actual-image.jpg"
  alt="Image description"
  fallbackSrc="[paste your data URL here]"
  ... other props
/>`}
            </pre>
          </li>
          <li>You can also download the image and save it to your public directory.</li>
        </ol>
      </div>
    </div>
  );
};

export default PlaceholderGeneratorPage;