const FloatingShape = ({ className, delay = 0 }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s`, animationDuration: "4s" }}
  />
);

export default FloatingShape;