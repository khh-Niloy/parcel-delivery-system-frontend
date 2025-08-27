import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              About Us
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Delivering confidence, every mile
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We build modern logistics experiences for senders, receivers, and delivery partners—simple, transparent, and reliable.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[{
            title: 'Reliability first',
            desc: 'Operational excellence and strong SLAs so your parcels arrive as planned.',
          },{
            title: 'Clarity & control',
            desc: 'Transparent statuses and updates—know where things stand at every step.',
          },{
            title: 'Human support',
            desc: 'Helpful people when you need them—no hassle, just solutions.',
          }].map((v, i) => (
            <Card key={i} className="border-white/40 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-gray-900">{v.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-white/40 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-900">Our mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We’re on a mission to simplify last‑mile logistics for businesses of all sizes. By
                combining thoughtful design with dependable operations, we help you focus on what matters—your customers.
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/40 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-900">How we work</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span> Clear status updates from pickup to delivery</li>
                <li className="flex gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span> Verified agents and smart routing</li>
                <li className="flex gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span> Support that prioritizes real outcomes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}


