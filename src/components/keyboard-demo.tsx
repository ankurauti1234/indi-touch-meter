import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Type } from 'lucide-react';
import { Keyboard } from './keyboard';
// Demo Component
export default function KeyboardDemo() {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    email: '',
    number: '',
    password: '',
    textarea: ''
  });

  const handleInputFocus = (e) => {
    setActiveInput(e.target);
    setShowKeyboard(true);
  };

  const handleKeyPress = (key) => {
    if (!activeInput) return;

    const inputName = activeInput.name;
    const currentValue = formData[inputName] || '';

    if (key === 'Backspace') {
      const newValue = currentValue.slice(0, -1);
      setFormData(prev => ({
        ...prev,
        [inputName]: newValue
      }));
      activeInput.value = newValue;
      
      // Trigger input event for React controlled components
      const event = new Event('input', { bubbles: true });
      activeInput.dispatchEvent(event);
    } else if (key === 'Enter') {
      activeInput.blur();
      setShowKeyboard(false);
      setActiveInput(null);
    } else if (key === 'Tab' || key === 'Ctrl' || key === 'Alt') {
      // Ignore these keys
      return;
    } else {
      const newValue = currentValue + key;
      setFormData(prev => ({
        ...prev,
        [inputName]: newValue
      }));
      activeInput.value = newValue;
      
      // Trigger input event for React controlled components
      const event = new Event('input', { bubbles: true });
      activeInput.dispatchEvent(event);
    }
  };

  return (
    <div className="min-h-screen bg-card p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Type className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-center bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Windows-Style Keyboard
            </h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Text Input</label>
              <Input
                name="text"
                type="text"
                placeholder="Click to open keyboard"
                value={formData.text}
                onFocus={handleInputFocus}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="text-lg h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Email Input</label>
              <Input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onFocus={handleInputFocus}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="text-lg h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Number Input</label>
              <Input
                name="number"
                type="text"
                placeholder="Enter numbers"
                value={formData.number}
                onFocus={handleInputFocus}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="text-lg h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Password Input</label>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onFocus={handleInputFocus}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="text-lg h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Textarea</label>
              <textarea
                name="textarea"
                placeholder="Click to type with keyboard"
                value={formData.textarea}
                onFocus={handleInputFocus}
                onChange={(e) => setFormData(prev => ({ ...prev, textarea: e.target.value }))}
                className="w-full h-24 px-3 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Features:
              </h3>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>✓ Full QWERTY layout with all symbols & numbers</li>
                <li>✓ Lucide React icons for visual clarity</li>
                <li>✓ Shadcn Drawer component for smooth transitions</li>
                <li>✓ Caps Lock & Shift with visual feedback</li>
                <li>✓ Full-width Windows-style design</li>
                <li>✓ Works with all input types & textareas</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Additional test section */}
        <Card className="p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-slate-800">More Test Inputs</h2>
          <div className="space-y-4">
            <Input
              name="test1"
              placeholder="Test input 1"
              onFocus={handleInputFocus}
              className="h-12"
            />
            <Input
              name="test2"
              placeholder="Test input 2"
              onFocus={handleInputFocus}
              className="h-12"
            />
            <Input
              name="test3"
              placeholder="Test input 3"
              onFocus={handleInputFocus}
              className="h-12"
            />
          </div>
        </Card>
      </div>

      <Keyboard
        isOpen={showKeyboard}
        onClose={() => {
          setShowKeyboard(false);
          setActiveInput(null);
        }}
        onKeyPress={handleKeyPress}
        targetInput={activeInput}
      />
    </div>
  );
}