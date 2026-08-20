const FormField = ({ label, id, type = "text", value, onChange, placeholder,mode }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-[16px] font-semibold my-3">
        {label}
      </label>
      <input
        type={type}
        id={id}
        disabled={mode === "view"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="diabled:read-only border border-gray-200 rounded-md px-2 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
};

export default FormField;