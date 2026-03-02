import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-x-hidden">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
