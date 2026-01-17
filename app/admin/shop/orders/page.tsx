"use client";
import { useState, useEffect } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  products: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  paymentStatus: "pending" | "paid" | "failed";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading orders
    setTimeout(() => {
      setOrders([
        {
          id: "1",
          customerEmail: "customer@example.com",
          customerName: "Jan Kowalski",
          products: [
            { id: "1", title: "Test osobowości", price: 99.99, quantity: 1 },
          ],
          total: 99.99,
          status: "pending",
          createdAt: "2024-01-15T10:30:00Z",
          paymentStatus: "paid",
        },
        {
          id: "2",
          customerEmail: "anna@example.com",
          customerName: "Anna Nowak",
          products: [
            {
              id: "2",
              title: "Kurs rozwoju osobistego",
              price: 199.99,
              quantity: 1,
            },
          ],
          total: 199.99,
          status: "completed",
          createdAt: "2024-01-14T15:45:00Z",
          paymentStatus: "paid",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Zamówienia</h1>
        <p className="text-gray-600">
          Zarządzaj zamówieniami i statusami płatności
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Brak zamówień
          </h3>
          <p className="text-gray-500">
            Gdy pojawią się nowe zamówienia, będą widoczne tutaj.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kwota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Płatność
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.products
                          .map((product) => product.title)
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total.toFixed(2)} zł
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status === "pending" && "Oczekujące"}
                        {order.status === "processing" && "W realizacji"}
                        {order.status === "completed" && "Zakończone"}
                        {order.status === "cancelled" && "Anulowane"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus === "paid" && "Opłacone"}
                        {order.paymentStatus === "pending" && "Oczekujące"}
                        {order.paymentStatus === "failed" && "Błąd"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "processing")
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Rozpocznij realizację"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "cancelled")
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Anuluj zamówienie"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Szczegóły zamówienia #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Informacje o kliencie</h3>
                <p>
                  <strong>Imię:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Produkty</h3>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{product.title}</span>
                      <span>{product.price.toFixed(2)} zł</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Suma:</span>
                  <span>{selectedOrder.total.toFixed(2)} zł</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  Status: {selectedOrder.status}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                    selectedOrder.paymentStatus
                  )}`}
                >
                  Płatność: {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
