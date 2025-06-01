

import React, { useState, useEffect } from 'react';

const availableFields = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name', helpText: 'Your full name' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe yourself', helpText: 'A short bio' },
  { key: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age', helpText: 'Must be a number' },
  { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], helpText: 'Select your gender' },
  { key: 'dob', label: 'Date of Birth', type: 'date', helpText: 'Your birth date' },
  { key: 'terms', label: 'Accept Terms', type: 'checkbox', helpText: 'You must accept to proceed' },
  { key: 'email', label: 'Email ID', type: 'email', placeholder: 'yourname@gmail.com', helpText: 'Must be a @gmail.com email' },
  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter 10-digit number', helpText: 'Only 10 digits allowed' }
];

export default function FormBuilder() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [isDarkColumn, setIsDarkColumn] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [templates] = useState({
    contact: ['name', 'email', 'phone', 'description']
  });
  const [formData, setFormData] = useState(null);
// const [formData, setFormData] = useState(null);
const [hideColumn1, setHideColumn1] = useState(false); // NEW

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fieldsParam = params.get('fields');
    if (fieldsParam) {
      const fieldKeys = fieldsParam.split(',').filter(key =>
        availableFields.find(field => field.key === key)
      );
      setSelectedFields(fieldKeys);
    }
  }, []);

  const toggleField = (fieldKey) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey)
        ? prev.filter(k => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const loadTemplate = (templateKey) => {
    const templateFields = templates[templateKey] || [];
    setSelectedFields(templateFields);
  };

  const saveTemplateLocally = () => {
    localStorage.setItem('savedTemplate', JSON.stringify(selectedFields));
  };
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const fieldsParam = params.get('fields');
  if (fieldsParam) {
    const fieldKeys = fieldsParam.split(',').filter(key =>
      availableFields.find(field => field.key === key)
    );
    setSelectedFields(fieldKeys);
    setHideColumn1(true);  // Hide Column 1 when share link is used
  }
}, []);

  const loadTemplateLocally = () => {
    const saved = localStorage.getItem('savedTemplate');
    if (saved) {
      setSelectedFields(JSON.parse(saved));
    }
  };

  const generateLink = () => {
    const query = selectedFields.join(',');
    setShareLink(`${window.location.origin}${window.location.pathname}?fields=${query}`);
  };

  const getPreviewClass = () => {
    switch (previewMode) {
      case 'tablet': return 'max-w-md';
      case 'mobile': return 'max-w-xs';
      default: return 'max-w-full';
    }
  };
  const handleSubmit = () => {
  // Gather values from form inputs
  const formElements = document.querySelectorAll('[data-field]');
  const data = {};
  formElements.forEach(el => {
    const key = el.getAttribute('data-field');
    if (el.type === 'checkbox') {
      data[key] = el.checked;
    } else {
      data[key] = el.value;
    }
  });
  setFormData(data);
  setHideColumn1(true); // HIDE COLUMN 1
};

  return (
    // <div className="min-h-screen bg-gray-100 p-10">
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
     <div className="relative min-h-screen w-screen overflow-auto">
      {/* Animated background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
                   bg-[length:200%_200%] animate-gradient-xy"
      >

      {/* Your main container with padding and grid */}
      <div className="min-h-screen p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1 */}{!hideColumn1 && (
        <div className={`bg-white p-6 rounded-xl shadow-md ${getPreviewClass()}`}>
          <h2 className="text-xl font-semibold mb-4">Select Fields</h2>
          {availableFields.map(field => (
            <div key={field.key} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={field.key}
                className="mr-2"
                checked={selectedFields.includes(field.key)}
                onChange={() => toggleField(field.key)}
              />
              <label htmlFor={field.key} className="text-gray-700">{field.label}</label>
            </div>
          ))}

          {/* Templates */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-1">Templates</h3>
            <button
              onClick={() => loadTemplate('contact')}
              className="mr-2 mb-2 px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
            >
              Load Contact Us
            </button>
            <button
              onClick={saveTemplateLocally}
              className="mr-2 mb-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Save Locally
            </button>
            <button
              onClick={loadTemplateLocally}
              className="mb-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
            >
              Load Saved
            </button>
          </div>
          <button
      onClick={() => setIsDarkColumn(!isDarkColumn)}
      className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
    >
      {isDarkColumn ? "Light Mode" : "Dark Mode"}
    </button>

          {/* Preview Mode */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-1">Preview Mode</h3>
            <div className="flex space-x-2">
              {['desktop', 'tablet', 'mobile'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1 rounded text-sm ${
                    previewMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Submitted Data (Also shown in Column 1) */}
{formData && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-2">Submitted Data</h3>
    <table className="w-full text-left border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Field</th>
          <th className="p-2 border">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(formData).map(([key, value]) => {
          const label = availableFields.find(f => f.key === key)?.label || key;
          return (
            <tr key={key}>
              <td className="p-2 border">{label}</td>
              <td className="p-2 border">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}


          <button
            onClick={generateLink}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate Shareable Link
          </button>
        </div>
        )}

       
        {/* Column 2 */}
        {selectedFields.length > 0 && (
<div className={isDarkColumn ? "bg-black text-white p-6 rounded-xl shadow-md" : "bg-white text-black p-6 rounded-xl shadow-md"}>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Generated Form</h2>
    {/* <button
      onClick={() => setIsDarkColumn(!isDarkColumn)}
      className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
    >
      {isDarkColumn ? "Light Mode" : "Dark Mode"}
    </button> */}
  </div>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      const data = {};
      selectedFields.forEach((key) => {
        const input = e.target.elements[key];
        data[key] = input?.type === 'checkbox' ? input.checked : input?.value || '';
      });
      setFormData(data);
    }}
    className="space-y-4"
  >
    {selectedFields.map((key) => {
      const field = availableFields.find((f) => f.key === key);
      return (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">
            {field.label} <span className="text-red-500">*</span>
          </label>
          {field.type === 'textarea' ? (
            <textarea
              name={key}
              placeholder={field.placeholder}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          ) : field.type === 'select' ? (
            <select
              name={key}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
            >
              <option value="">Select</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center">
              <input type="checkbox" name={key} required className="mr-2" />
              <span className="text-sm">{field.helpText}</span>
            </div>
          ) : (
            <input
              name={key}
              type={field.type}
              placeholder={field.placeholder}
              required
              pattern={
                field.key === 'email'
                  ? '^[a-zA-Z0-9._%+-]+@gmail\\.com$'
                  : field.key === 'phone'
                  ? '^[0-9]{10}$'
                  : undefined
              }
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          )}
          {field.type !== 'checkbox' && (
            <p className="text-xs mt-1">{field.helpText}</p>
          )}
        </div>
      
      );
    })}
    


    <button
      type="submit"
      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Submit
    </button>
  </form>

  


  {/* Share link below */}
  {shareLink && (
    <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
      Shareable Link: <a href={shareLink} className="underline">{shareLink}</a>
    </div>
  )}
</div>
        )}

      </div>
      </div>
    </div>
  );
}






























































