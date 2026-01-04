function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
