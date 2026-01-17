import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen overflow-x-hidden">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
