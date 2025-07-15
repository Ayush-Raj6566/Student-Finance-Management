import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail, Phone } from 'lucide-react';

const Help: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I add a new transaction?",
      answer: "Click the 'Add' button in the dashboard, fill in the transaction details, and submit."
    },
    {
      question: "How can I filter my transactions?",
      answer: "Use the Year, Month, and Date filters in the dashboard to view specific transactions."
    },
    {
      question: "How do I set up a budget?",
      answer: "Go to Budget Planner from the menu and click 'Add Budget' to create category-wise budgets."
    },
    {
      question: "Can I export my transaction data?",
      answer: "Yes, you can export your data from the Profile page using the Export button."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Help & Support</h1>
              <p className="text-sm text-slate-400">Get assistance and find answers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-700/50 transition-colors cursor-pointer">
            <MessageCircle className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-sm text-slate-400">Chat with our support team</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-700/50 transition-colors cursor-pointer">
            <Mail className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Email Support</h3>
            <p className="text-sm text-slate-400">Send us an email</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-700/50 transition-colors cursor-pointer">
            <Phone className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Phone Support</h3>
            <p className="text-sm text-slate-400">Call our helpline</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Book className="w-6 h-6 text-indigo-400" />
            <h2 className="text-lg font-semibold text-indigo-400">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-slate-300 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-400">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <p className="text-slate-300">support@studentfinance.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Phone</h3>
              <p className="text-slate-300">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Office Hours</h3>
              <p className="text-slate-300">Monday - Friday: 9 AM - 6 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Response Time</h3>
              <p className="text-slate-300">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;