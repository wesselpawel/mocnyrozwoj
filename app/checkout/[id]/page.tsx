import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ClearCache from "./ClearCache";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasa - Finalizuj zakup | MocnyRozwój.pl",
  description:
    "Finalizuj swój zakup kursu lub produktu rozwojowego. Bezpieczna płatność przez Stripe z natychmiastowym dostępem do materiałów.",
  keywords:
    "kasa, płatność, zakup kursu, finalizacja zamówienia, bezpieczna płatność",
  openGraph: {
    title: "Kasa - Finalizuj zakup | MocnyRozwój.pl",
    description:
      "Finalizuj swój zakup kursu lub produktu rozwojowego. Bezpieczna płatność przez Stripe.",
    type: "website",
    url: "https://mocnyrozwoj.pl/checkout",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Kasa - Finalizuj zakup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kasa - Finalizuj zakup | MocnyRozwój.pl",
    description:
      "Finalizuj swój zakup kursu lub produktu rozwojowego. Bezpieczna płatność przez Stripe.",
    images: ["/logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://mocnyrozwoj.pl/checkout",
  },
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orders = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/orders`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  ).then((res) => res.json());
  const order = orders?.data?.find(
    (order: any) => order.metadata.id === params.id
  );
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center text-white h-screen absolute left-0 top-0 w-screen">
        <h1 className="text-3xl font-bold text-center">
          Nie znaleziono zamówienia
        </h1>
        <Link
          href="https://blackbellartstudio.pl/"
          className="text-white font-bold text-xl flex flex-row items-center relative z-50"
        >
          <FaArrowLeft className="mr-2" />
          Powrót
        </Link>
      </div>
    );
  }
  return (
    <div className="p-5 lg:p-7 xl:p-12">
      <Link
        href="https://blackbellartstudio.pl/"
        className="text-gray-800 font-bold text-xl flex flex-row items-center relative z-50"
      >
        <FaArrowLeft className="mr-2" />
        Powrót
      </Link>
      <div className="text-white text-2xl mt-4">
        {order.metadata.productName}
      </div>
      <div className="flex flex-col items-center justify-center text-white h-screen absolute left-0 top-0 w-screen">
        {order.payment_status === "paid" && (
          <div className="mx-4 border border-gray-300 p-6 bg-gray-700">
            <ClearCache order={order.metadata} price={order.amount_total} />
            <h1 className="text-3xl font-bold text-center font-cardo">
              Dziękuję za zakupy!
            </h1>
            <h2 className="text-center mt-2">Twój numer zamówienia</h2>
            <span className="text-green-400 text-center block">
              {order.metadata.id}
            </span>
            <p className="text-center">
              W razie pytań proszę o kontakt na adres:{" "}
              <Link
                href="mailto:eliza.czer09@gmail.com"
                className="underline text-blue-400"
              >
                eliza.czer09@gmail.com
              </Link>
            </p>
          </div>
        )}
        {order.payment_status === "unpaid" && (
          <div className="border border-gray-300 mx-4 p-6 bg-gray-700">
            <h1 className="text-3xl font-bold text-center">
              Płatność nie powiodła się
            </h1>
            <h2 className="font-bold text-center mt-2">
              Twój numer zamówienia
            </h2>
            <span className="text-red-400 block text-center">
              {order.metadata.id}
            </span>
            <div className="my-3">
              <span className="text-center block">
                Spróbuj ponowić płatność tutaj
              </span>
              <Link
                href={order.url}
                className="text-green-500 block text-center"
              >
                Przejdź do płatności
              </Link>
            </div>
            <p className="text-center">
              W razie pytań proszę o kontakt na adres:{" "}
              <Link
                href="mailto:eliza.czer09@gmail.com"
                className="underline text-blue-400"
              >
                eliza.czer09@gmail.com
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
