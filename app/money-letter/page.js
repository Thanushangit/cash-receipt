'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBuilding, FaCalendar, FaDownload, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MoneyLetterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [receipts, setReceipts] = useState([]);

    const [searchParams, setSearchParams] = useState({
        institutionName: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchInstitutions();
        fetchAllReceipts(); // Fetch all receipts on initial load
    }, []);

    const fetchInstitutions = async () => {
        try {
            const response = await fetch('/api/institutions');
            const data = await response.json();
            setInstitutions(data);
        } catch (error) {
            console.error('Error fetching institutions:', error);
        }
    };

    const fetchAllReceipts = async () => {
        try {
            const response = await fetch('/api/receipts');
            const data = await response.json();
            setReceipts(data);
        } catch (error) {
            console.error('Error fetching all receipts:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearching(true);

        try {
            const params = new URLSearchParams();
            if (searchParams.institutionName) params.append('institutionName', searchParams.institutionName);
            if (searchParams.startDate) params.append('startDate', searchParams.startDate);
            if (searchParams.endDate) params.append('endDate', searchParams.endDate);

            const response = await fetch(`/api/receipts?${params.toString()}`);
            const data = await response.json();
            setReceipts(data);
        } catch (error) {
            console.error('Error searching receipts:', error);
        } finally {
            setSearching(false);
        }
    };

    const generatePDF = () => {
        try {
            console.log('Starting PDF generation...');
            console.log('Receipts:', receipts);

            const doc = new jsPDF();

            // Header
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Money Letter', 105, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Chief Secretariat - Southern Province', 105, 28, { align: 'center' });
            doc.text('Accounts Department', 105, 35, { align: 'center' });

            // Date range
            doc.setFontSize(10);
            let dateRange = 'All Records';
            if (searchParams.startDate && searchParams.endDate) {
                dateRange = `Period: ${new Date(searchParams.startDate).toLocaleDateString()} - ${new Date(searchParams.endDate).toLocaleDateString()}`;
            }
            doc.text(dateRange, 105, 45, { align: 'center' });

            if (searchParams.institutionName) {
                doc.text(`Institution: ${searchParams.institutionName}`, 105, 52, { align: 'center' });
            }

            // Table
            const tableData = receipts.map((receipt, index) => [
                index + 1,
                receipt.institutionName,
                new Date(receipt.date).toLocaleDateString(),
                receipt.letterNumber,
                `LKR ${receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                receipt.level
            ]);

            console.log('Table data:', tableData);

            autoTable(doc, {
                startY: 60,
                head: [['No.', 'Institution', 'Date', 'Letter No.', 'Amount', 'Level']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [59, 130, 246],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 15 },
                    1: { cellWidth: 45 },
                    2: { halign: 'center', cellWidth: 25 },
                    3: { halign: 'center', cellWidth: 30 },
                    4: { halign: 'right', cellWidth: 35 },
                    5: { halign: 'center', cellWidth: 30 }
                }
            });

            // Total
            const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Total Amount: LKR ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 200, finalY, { align: 'right' });

            // Footer
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, pageHeight - 15, { align: 'center' });
            doc.text('Cash Receipt Management System', 105, pageHeight - 10, { align: 'center' });

            // Save using blob method for better browser compatibility
            const fileName = `Money_Letter_${new Date().toISOString().split('T')[0]}.pdf`;
            console.log('Saving PDF as:', fileName);

            // Generate blob with explicit MIME type
            const pdfBlob = doc.output('blob');
            const blobWithType = new Blob([pdfBlob], { type: 'application/pdf' });
            const url = URL.createObjectURL(blobWithType);

            // Try to download first
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Also open in new tab as fallback (user can save from there)
            setTimeout(() => {
                window.open(url, '_blank');
            }, 100);

            // Clean up after a delay
            setTimeout(() => URL.revokeObjectURL(url), 5000);

            console.log('PDF generation completed successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF: ' + error.message);
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Money Letter Generation
                    </h1>
                    <p className="text-gray-600">
                        Search and generate money letters for specific date ranges
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Institution */}
                            <div>
                                <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Institution
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaBuilding className="text-gray-400" />
                                    </div>
                                    <select
                                        id="institutionName"
                                        value={searchParams.institutionName}
                                        onChange={(e) => setSearchParams({ ...searchParams, institutionName: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                                    >
                                        <option value="">All Institutions</option>
                                        {institutions.map((inst) => (
                                            <option key={inst} value={inst}>{inst}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendar className="text-gray-400" />
                                    </div>
                                    <input
                                        id="startDate"
                                        type="date"
                                        value={searchParams.startDate}
                                        onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendar className="text-gray-400" />
                                    </div>
                                    <input
                                        id="endDate"
                                        type="date"
                                        value={searchParams.endDate}
                                        onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={searching}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <FaSearch />
                            {searching ? 'Searching...' : 'Search Receipts'}
                        </button>
                    </form>
                </div>

                {/* Results Table */}
                {receipts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Search Results</h2>
                                <p className="text-sm text-gray-600 mt-1">{receipts.length} receipt(s) found</p>
                            </div>
                            <button
                                onClick={generatePDF}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <FaDownload />
                                Download PDF
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">No.</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Institution</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Letter Number</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Amount (LKR)</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Level</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {receipts.map((receipt, index) => (
                                        <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{receipt.institutionName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {new Date(receipt.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{receipt.letterNumber}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 text-right font-medium">
                                                {receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{receipt.level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                                            Total:
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                                            {receipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {receipts.length === 0 && !searching && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No receipts found</h3>
                        <p className="text-gray-500">No receipts available in the database</p>
                    </div>
                )}
            </main>
        </div>
    );
}
