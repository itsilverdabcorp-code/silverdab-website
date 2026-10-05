import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";

export const metadata = {
  title: "Contact Us | Silverdab",
};

export default function ContactPage() {
  return (
    <section className="w-full bg-white px-6 py-16 text-black md:px-12 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}