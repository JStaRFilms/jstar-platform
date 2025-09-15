
import ContactHero from "@/features/ContactPage/components/ContactHero";
import ContactForm from "@/features/ContactPage/components/ContactForm";
import ContactOptions from "@/features/ContactPage/components/ContactOptions";
import Faq from "@/features/ContactPage/components/Faq";
import ContactCta from "@/features/ContactPage/components/ContactCta";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactOptions />
          </div>
        </div>
      </section>
      <Faq />
      <ContactCta />
    </>
  );
}
