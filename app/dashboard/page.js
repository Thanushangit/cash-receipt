'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaReceipt, FaFileInvoiceDollar, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function DashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Cash Receipt Management System
                            </h1>
                            <p className="text-sm text-gray-600">
                                Chief Secretariat - Southern Province
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                                <FaUser className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {session?.user?.username || 'User'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                <FaSignOutAlt />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                        Welcome to Dashboard
                    </h2>
                    <p className="text-gray-600">
                        Select an action to manage cash receipts and money letters
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Cash Receipt Card */}
                    <div
                        onClick={() => router.push('/cash-receipt')}
                        className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <FaReceipt className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                Cash Receipt
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Record new cash receipt letters from Divisional Secretariats
                            </p>
                            <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all duration-200">
                                <span>Enter Receipt</span>
                                <span className="text-xl">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Money Letter Card */}
                    <div
                        onClick={() => router.push('/money-letter')}
                        className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:border-indigo-300 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <FaFileInvoiceDollar className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                Money Letter
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Search and generate money letters for specific date ranges
                            </p>
                            <div className="flex items-center gap-2 text-indigo-600 font-medium group-hover:gap-3 transition-all duration-200">
                                <span>Generate Letter</span>
                                <span className="text-xl">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
