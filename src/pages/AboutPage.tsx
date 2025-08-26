import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>About Our Parcel Delivery Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            We provide reliable, fast, and transparent parcel delivery across cities. Our
            platform enables senders, receivers, and delivery agents to seamlessly coordinate
            every step of the delivery lifecycle.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            To make last‑mile logistics simple and trustworthy through clear status tracking,
            fair pricing, and responsive support.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc pl-6">
            <li>Operations: Ensures on‑time pickups and deliveries</li>
            <li>Engineering: Builds a robust, user‑friendly platform</li>
            <li>Support: Helps users resolve issues quickly</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}


