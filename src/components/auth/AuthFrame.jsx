import Modal from '../Modal';
import { CloseIcon } from '../icons';
import { useAuth } from '../../context/useAuth';

export default function AuthFrame({ title, subtitle, className, children }) {
  const { closeModal } = useAuth();

  return (
    <Modal onClose={closeModal}>
      <div
        className={`flex flex-col gap-6 rounded-[28px] border border-raised bg-page p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-h2 font-extrabold">{title}</h2>
            <p className="text-body-s text-muted">{subtitle}</p>
          </div>
          <button type="button" onClick={closeModal} aria-label="Close" className="cursor-pointer">
            <CloseIcon width={24} height={24} />
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}
