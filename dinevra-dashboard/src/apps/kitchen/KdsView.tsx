import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  items?: Array<{ name: string; quantity: number }>;
}

export default function KdsView() {
  const { kitchen_id } = useParams<{ kitchen_id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Generate dummy device ID for KDS client
    const deviceId = '00000000-0000-0000-0000-000000000000';
    const wsUrl = `ws://localhost:8080/api/v1/ws?kitchen_id=${kitchen_id}&device_id=${deviceId}`;
    
    // Fallback URL if we move the route. In our Go code, route might be simply /ws via the router.
    // Wait, the Go code explicitly set router.GET("/ws", ...), not under API group!
    const correctWsUrl = `ws://localhost:8080/ws?kitchen_id=${kitchen_id}&device_id=${deviceId}`;

    const connect = () => {
      const ws = new WebSocket(correctWsUrl);
      
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => {
        setIsConnected(false);
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketEvent(data);
        } catch (err) {
          console.error('Failed to parse WS msg', err);
        }
      };
      
      wsRef.current = ws;
    };

    connect();

    // Fetch initial orders via REST API
    fetch(`http://localhost:8080/api/v1/orders/kitchen/${kitchen_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(console.error);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [kitchen_id]);

  const handleWebSocketEvent = (event: any) => {
    console.log("WS Event Received", event);
    if (event.type === 'ORDER_CREATED') {
      // Typically we'd fetch the exact order details or the event payload would contain it
      const newOrder = {
        id: event.payload.order_id,
        status: 'new',
        total_amount: 0,
      };
      setOrders(prev => [newOrder, ...prev]);
    } else if (event.type === 'ORDER_STATUS_UPDATED') {
      setOrders(prev => prev.map(o => 
        o.id === event.payload.order_id ? { ...o, status: event.payload.status } : o
      ));
    }
  };

  const advanceOrder = async (orderId: string) => {
    try {
      await fetch(`http://localhost:8080/api/v1/orders/${orderId}/advance`, { method: 'PATCH' });
      // The websocket will broadcast back the updated status, which react handles automatically
    } catch (err) {
      console.error(err);
    }
  };

  const renderColumn = (status: string, title: string, bgClass: string) => {
    const list = orders.filter(o => o.status === status);
    return (
      <div className={`flex-1 flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-200 ${bgClass}`}>
        <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-md font-semibold text-gray-800 flex justify-between items-center">
          {title}
          <span className="bg-white text-xs px-2 py-1 rounded-full shadow-sm">{list.length}</span>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {list.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-gray-500">#{order.id.split('-')[0]}</span>
                <span className="text-sm font-medium">${order.total_amount?.toFixed(2)}</span>
              </div>
              <div className="text-gray-800 font-medium">
                {order.items?.length ? "Items..." : "No items logged"}
              </div>
              <button 
                onClick={() => advanceOrder(order.id)}
                className="mt-2 w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-sm font-medium transition"
              >
                Advance →
              </button>
            </div>
          ))}
          {list.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">No orders here</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="h-16 bg-gray-900 text-white flex items-center px-6 justify-between shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">Dinevra KDS</h1>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-300">
            Kitchen: {kitchen_id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-300">{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </header>

      <main className="flex-1 p-6 flex gap-6 overflow-hidden">
        {renderColumn('new', 'Incoming', 'bg-blue-50/50')}
        {renderColumn('preparing', 'Preparing', 'bg-orange-50/50')}
        {renderColumn('ready', 'Ready for Pickup', 'bg-green-50/50')}
      </main>
    </div>
  );
}
