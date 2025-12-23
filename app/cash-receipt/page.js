'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBuilding, FaCalendar, FaFileAlt, FaDollarSign, FaLayerGroup } from 'react-icons/fa';

export default function CashReceiptPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        institutionName: '',
        date: '',
        letterNumber: '',
        amount: '',
        level: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/receipts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    date: new Date(formData.date)
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Cash receipt saved successfully!' });
                setFormData({
                    institutionName: '',
                    date: '',
                    letterNumber: '',
                    amount: '',
                    level: ''
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save receipt' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft />
                            <span className="font-medium">Back to Dashboard</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Cash Receipt Entry
                    </h1>
                    <p className="text-gray-600">
                        Enter cash receipt details from Divisional Secretariats
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Institution Name */}
                        <div>
                            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                                Institution Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaBuilding className="text-gray-400" />
                                </div>
                                <input
                                    id="institutionName"
                                    name="institutionName"
                                    type="text"
                                    value={formData.institutionName}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    placeholder="Enter institution name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendar className="text-gray-400" />
                                </div>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Letter Number */}
                        <div>
                            <label htmlFor="letterNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Letter Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFileAlt className="text-gray-400" />
                                </div>
                                <input
                                    id="letterNumber"
                                    name="letterNumber"
                                    type="text"
                                    value={formData.letterNumber}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    placeholder="Enter letter number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (LKR) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaDollarSign className="text-gray-400" />
                                </div>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                                Level <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLayerGroup className="text-gray-400" />
                                </div>
                                <select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                                    required
                                >
                                    <option value="">Select level</option>
                                    <option value="Provincial">Provincial</option>
                                    <option value="Divisional">Divisional</option>
                                    <option value="Grama Niladhari">Grama Niladhari</option>
                                </select>
                            </div>
                        </div>

                        {/* Message Display */}
                        {message.text && (
                            <div
                                className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success'
                                        ? 'bg-green-50 border border-green-200 text-green-700'
                                        : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? 'Saving...' : 'Save Receipt'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
