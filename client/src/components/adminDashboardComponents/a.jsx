// components/CommonModal.jsx

const CommonModal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div className="bg-white rounded-xl p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        {children}

      </div>

    </div>
  );
};

export default CommonModal;