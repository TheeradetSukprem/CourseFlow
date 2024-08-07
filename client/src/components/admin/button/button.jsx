function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-Blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-[171px] h-[60px] font-semibold"
    >
      {text}
    </button>
  );
}

export default Button;
