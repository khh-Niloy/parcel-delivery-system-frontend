import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useUserInfoQuery } from '@/redux/features/auth/auth.api'

export default function HomePage() {

  const { data: meData } = useUserInfoQuery(undefined)
  const role = meData?.data?.role

  return (
    <main>
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 sm:py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 10,000+ businesses worldwide
              </div>
              
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                Deliver with
                <span className="block text-blue-600">Confidence</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl lg:max-w-none">
                Transform your delivery operations with our intelligent platform. Ship smarter, track better, and delight customers with lightning-fast, reliable parcel delivery.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                
                {
                  role ? (
                    <div className='flex gap-4'>
                <Button asChild size="lg" className="bg-primary text-white hover:bg-blue-600 px-8 py-3 text-lg font-semibold">
                <Link to="/track-parcel">Tap to track your parcel</Link>
              </Button>
                      <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg">
                <Link to={`/${role?.toLowerCase()}`}>See your parcels</Link>
                </Button>
                    </div>
                  )
                  : (
                    <div className='flex gap-4'>
                      <Button asChild size="lg" className="bg-primary text-white hover:bg-blue-600 px-8 py-3 text-lg font-semibold">
                <Link to="/login">Tap to track your parcel</Link>
              </Button>
                    <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg">
                      <Link to="/about">about ourselves</Link>
                    </Button>
                    </div>
                  )
                }
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="font-medium">99.9% on‑time delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">24/7 live tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Insured & Secure</span>
                </div>
              </div>
            </div>
            
            <div className="relative grid gap-4">
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-200 shadow-xl">
                <div className="rounded-2xl bg-white/85 backdrop-blur p-6 border border-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8l2 2h8M3 7h8l2 2h8" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Live Network</p>
                        <h3 className="text-lg font-semibold text-gray-900">Today’s Performance</h3>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-xs text-gray-500">On‑time deliveries</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
                      <div className="h-2 w-1/2 rounded-full bg-blue-500/60" />
                    </div>
                    <p className="mt-2 text-[11px] text-gray-500">Exact values load when data is available.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/85 backdrop-blur p-5 shadow-lg border border-white/40">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">Avg. Delivery Time</h4>
                  </div>
                  <p className="text-sm text-gray-600">Shows your recent average once data is available.</p>
                </div>

                <div className="rounded-2xl bg-white/85 backdrop-blur p-5 shadow-lg border border-white/40">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">Customer Rating</h4>
                  </div>
                  <p className="text-sm text-gray-600">Reflects verified reviews from your customers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern technology to deliver exceptional service and reliability
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Real‑time Tracking',
              desc: 'Stay updated with live parcel movement and delivery ETA. Get instant notifications and detailed tracking history.',
              icon: (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Secure & Reliable',
              desc: 'Insured deliveries with verified agents and smart routing. Your packages are protected every step of the way.',
              icon: (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Seamless Dashboard',
              desc: 'Manage parcels, customers, and billing from one place. Powerful analytics and reporting tools included.',
              icon: (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Fast Delivery',
              desc: 'Same-day and next-day delivery options available. Optimized routes for maximum efficiency.',
              icon: (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )
            },
            {
              title: '24/7 Support',
              desc: 'Round-the-clock customer support via chat, phone, and email. We\'re here when you need us.',
              icon: (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Global Coverage',
              desc: 'Deliver to over 200 countries worldwide. International shipping with customs handling.',
              icon: (
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )
            }
          ].map((f, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their deliveries
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Sarah Johnson",
              role: "E-commerce Manager",
              company: "TechCorp",
              content: "The real-time tracking feature is incredible. Our customers love knowing exactly where their packages are.",
              rating: 5
            },
            {
              name: "Michael Chen",
              role: "Operations Director", 
              company: "Global Retail",
              content: "Switched to this platform last year and our delivery times improved by 40%. Highly recommended!",
              rating: 5
            },
            {
              name: "Emily Rodriguez",
              role: "Small Business Owner",
              company: "Artisan Crafts",
              content: "Perfect for our small business. Easy to use dashboard and excellent customer support.",
              rating: 5
            }
          ].map((testimonial, i) => (
            <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Built for scale and reliability
              </h2>
              <p className="mt-2 text-muted-foreground">
                Our network processes thousands of parcels per hour with enterprise‑grade uptime.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-blue-600">1M+</p>
                  <p className="text-sm text-gray-600">Parcels delivered</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-orange-600">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-purple-600">200+</p>
                  <p className="text-sm text-gray-600">Countries</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-3">Ready to ship smarter?</h3>
              <p className="text-muted-foreground mb-6">Get started in minutes—no credit card required.</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-primary text-white hover:bg-blue-600">
                  <Link to="/register">Create Account</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Link to="/contact">Talk to Sales</Link>
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">Already have an account?</p>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link to="/login">Sign in here</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
