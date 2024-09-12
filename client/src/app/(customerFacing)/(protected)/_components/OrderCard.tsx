import { Package, Truck, CheckCircle, Clock, XCircle, RefreshCcw } from 'lucide-react';
import { Order, Product } from "@prisma/client";
import { currencyFormat } from '@/lib/utils';
import { OrderWithDetails } from '@/db/basket';

interface OrderCardProps {
    order:OrderWithDetails
}

const orderStatuses = {
  pending: { 
    color: 'text-orange-500', 
    icon: Clock, 
    description: 'The order has been received but is awaiting payment confirmation.',
    actions: 'Verify payment, update inventory.',
    step: 1
  },
  processing: { 
    color: 'text-yellow-500', 
    icon: Package, 
    description: 'Payment has been confirmed, and the order is being prepared for shipment.',
    actions: 'Pick, pack, and label items; prepare for shipping.',
    step: 2
  },
  shipped: { 
    color: 'text-blue-500', 
    icon: Truck, 
    description: 'The order has been handed over to the shipping carrier and is on its way to the customer.',
    actions: 'Provide tracking information to the customer, monitor shipment progress.',
    step: 3
  },
  delivered: { 
    color: 'text-green-500', 
    icon: CheckCircle, 
    description: 'The order has been successfully delivered to the customer.',
    actions: 'Confirm delivery with the carrier, update order status to complete.',
    step: 4
  },
  canceled: { 
    color: 'text-red-500', 
    icon: XCircle, 
    description: 'The order has been canceled either by the customer or due to payment issues.',
    actions: 'Reverse inventory updates, process any necessary refunds.',
    step: 0
  },
  returned: { 
    color: 'text-purple-500', 
    icon: RefreshCcw, 
    description: 'The customer has returned the order, and a refund or replacement is being processed.',
    actions: 'Inspect returned items, process refunds or exchanges.',
    step: 0
  },
};

interface OrderStatusProps {
    status: keyof typeof orderStatuses;
}


const OrderStatus = ({ status }:OrderStatusProps) => {
    const { color, icon: Icon } = orderStatuses[status] || {
        color: 'text-gray-500',
        icon: Clock, // Default icon
        description: 'Status unknown',
        actions: 'No actions available',
        step: 0
      };
    return (
      <div className={`flex items-center ${color}`}>
        <Icon size={20} className="mr-2" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const ProgressBar = ({ status }:OrderStatusProps) => {
    const step = orderStatuses[status].step;
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  
    return (
      <div className="w-full mt-6 mb-4">
      {/* {step > 0 && step <= 4 && (
        <p className="text-sm text-gray-600 mb-2">
          {step === 3 ? `Shipped on ${shippedDate}` : `${steps[step - 1]}`}
        </p>
      )} */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${((step - 1) / 3) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"
          ></div>
        </div>
        <div 
          className="absolute w-4 h-4 bg-black rounded-full top-1/2 transform -translate-y-1/2"
          style={{ left: `calc(${((step - 1) / 3) * 100}% - 0.2rem)` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((stepName, index) => (
          <div key={index} className={`text-xs ${index < step ? 'text-black font-semibold' : 'text-gray-400'}`}>
            {stepName}
          </div>
        ))}
      </div>
    </div>
    );
  };

  

export default function OrderCard({ order }:OrderCardProps) {
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-md md:text-lg font-semibold text-black">Order #{order.id}</h3>
          <div className="flex space-x-2 mt-2">
            {order.items.slice(0, 3).map((item) => (
              <img
                key={item.id}
                src={item.product.pictureUrl}
                alt={item.product.name}
                className="w-[80px] h-[80px] object-cover rounded"
              />
            ))}
          </div>
          
        </div>
        <div>
        <span className="text-gray-500">{order.createdAt.toLocaleDateString('en-US', {year: '2-digit',month: 'short',day: 'numeric',})}</span>
        <p className='text-black text-lg font-semibold'>{currencyFormat(order.total)}</p>
        </div>
        
        
      </div>
      
      <OrderStatus status={order.orderStatus.toLowerCase() as keyof typeof orderStatuses} />
      {['pending', 'processing', 'shipped', 'delivered'].includes(order.orderStatus.toLowerCase()) && (
        <ProgressBar status={order.orderStatus.toLowerCase() as keyof typeof orderStatuses} />
      )}
      
    </div>
  );
};