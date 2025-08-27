import DeliveryAgentRegForm from "@/components/modules/auth/DeliveryAgentRegForm";
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { ArrowLeft, Truck, Shield, Clock, MapPin } from 'lucide-react'

export default function DeliveryAgentRegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="absolute top-6 left-6 z-50">
                            <Button asChild variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900">
              <Link to="/" replace>
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Delivery Partner</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Join our network of trusted delivery agents and start earning with flexible hours and competitive rates
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Join Us?</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Flexible Hours</h3>
                                            <p className="text-sm text-gray-600">Work when you want, earn on your schedule</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Shield className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Insurance Coverage</h3>
                                            <p className="text-sm text-gray-600">Full protection for you and your vehicle</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <MapPin className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Smart Routing</h3>
                                            <p className="text-sm text-gray-600">Optimized routes for maximum efficiency</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                    <h3 className="font-semibold text-blue-900 mb-2">Requirements</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Valid driver's license</li>
                                        <li>• Clean driving record</li>
                                        <li>• Reliable vehicle</li>
                                        <li>• Smartphone with GPS</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                                <DeliveryAgentRegForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}