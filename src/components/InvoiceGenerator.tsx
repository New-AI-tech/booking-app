// src/components/staff/InvoiceGenerator.tsx
import { X, Printer, Download, Mail, Phone, MapPin } from 'lucide-react';

interface InvoiceGeneratorProps {
    booking: any;
    onClose: () => void;
}

export default function InvoiceGenerator({ booking, onClose }: InvoiceGeneratorProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl relative flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-stone-50">
                    <h2 className="text-xl font-serif text-stone-900">معاينة الفاتورة</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 hover:bg-stone-800 transition-colors text-sm rounded-sm"
                        >
                            <Printer className="w-4 h-4" /> طباعة
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="flex-1 overflow-y-auto p-12 bg-white text-stone-900 font-sans" id="printable-invoice" dir="rtl">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-16">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-serif text-gold font-bold tracking-tighter">Feryal Exclusive</h1>
                            <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold">متجر فريال الحصري لتأجير الفساتين</p>
                        </div>
                        <div className="text-left" dir="ltr">
                            <h3 className="text-2xl font-serif text-stone-300">INVOICE</h3>
                            <p className="text-stone-500 font-mono text-xs mt-1">#{booking.transaction_id || booking.id.substring(0, 8)}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">تفاصيل العميل</h4>
                            <div className="space-y-1">
                                <p className="font-bold text-lg">{booking.customer_name}</p>
                                <p className="text-stone-500 flex items-center gap-2 text-sm">
                                    <Phone className="w-3 h-3" /> {booking.customer_phone || 'لا يوجد هاتف'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">تفاصيل الفاتورة</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-stone-500">تاريخ البدء:</span>
                                <span>{new Date(booking.start_date).toLocaleDateString('ar-EG')}</span>
                                <span className="text-stone-500">تاريخ الإرجاع:</span>
                                <span>{new Date(booking.due_date || booking.start_date).toLocaleDateString('ar-EG')}</span>
                                <span className="text-stone-500">الحالة:</span>
                                <span className={booking.status === 'completed' ? 'text-green-600 font-bold' : 'text-gold font-bold'}>
                                    {booking.status === 'completed' ? 'تم الإرجاع' : 'نشط'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full mb-16">
                        <thead>
                            <tr className="border-b-2 border-stone-900 text-right">
                                <th className="py-4 font-serif text-lg">الوصف</th>
                                <th className="py-4 font-serif text-lg text-center">السعر الأساسي</th>
                                <th className="py-4 font-serif text-lg text-left">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            <tr className="group">
                                <td className="py-6">
                                    <p className="font-bold">{booking.dresses?.name || 'فستان سهرة'}</p>
                                    <p className="text-xs text-stone-400 mt-1">تأجير فستان حصري بملحقاته</p>
                                </td>
                                <td className="py-6 text-center">{booking.base_rental_fee} EGP</td>
                                <td className="py-6 text-left font-bold">{booking.base_rental_fee} EGP</td>
                            </tr>
                            {booking.delay_fee > 0 && (
                                <tr>
                                    <td className="py-6">
                                        <p className="font-bold text-red-600">رسوم تأخير</p>
                                        <p className="text-xs text-stone-400 mt-1">غرامة تأخير في الإرجاع</p>
                                    </td>
                                    <td className="py-6 text-center">{booking.delay_fee} EGP</td>
                                    <td className="py-6 text-left font-bold text-red-600">{booking.delay_fee} EGP</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end pt-8 border-t-2 border-stone-900">
                        <div className="w-72 space-y-4">
                            <div className="flex justify-between text-stone-500">
                                <span>المجموع الفرعي:</span>
                                <span>{booking.total_due} EGP</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-bold">
                                <span>المدفوع:</span>
                                <span>-{booking.amount_paid} EGP</span>
                            </div>
                            <div className="flex justify-between text-2xl font-serif font-bold pt-4 border-t border-stone-100">
                                <span>المتبقي:</span>
                                <span className="text-stone-900">{booking.total_due - booking.amount_paid} EGP</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-20 pt-12 border-t border-stone-100 text-center space-y-4">
                        <p className="text-stone-400 text-sm font-serif italic">شكرًا لاختياركم متجر فريال الحصري. نأمل أن تكونوا قد استمتعتم بتجربتكم.</p>
                        <div className="flex justify-center gap-8 text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +20 123 456 789</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> القاهرة، مصر</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> info@feryal-exclusive.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * { visibility: hidden; }
                    #printable-invoice, #printable-invoice * { visibility: visible; }
                    #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
                }
            ` }} />
        </div>
    );
}
