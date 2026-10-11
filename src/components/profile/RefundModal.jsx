import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { refundOrder } from '../../api/tickets';
import useAuthedMutation from '../../hooks/useAuthedMutation';
import Button from '../Button';
import Modal from '../Modal';

export default function RefundModal({ order, onClose }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const refund = useAuthedMutation({
    mutationFn: () => refundOrder(order.reference),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['movie-sessions'] });
      onClose();
    },
    onError: (error) => {
      if (error.status === 401) return;

      setMessage(
        error.status === 422 && error.body?.message
          ? error.body.message
          : 'Something went wrong. Please try again.',
      );
    },
  });

  return (
    <Modal onClose={onClose}>
      <div className="flex w-100.75 flex-col gap-6 rounded-[28px] border border-raised bg-page p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 font-extrabold">Refund this order?</h2>
          <p className="text-body-s text-muted">
            Order #{order.reference} for {order.session.movie.title} will be refunded and the seats
            released. This cannot be undone.
          </p>
        </div>
        {message && <p className="text-label-s font-semibold text-red">{message}</p>}
        <div className="flex gap-3">
          <Button variant="transparent" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => refund.run()} disabled={refund.isPending} className="flex-1">
            {refund.isPending ? 'Refunding...' : 'Refund'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
