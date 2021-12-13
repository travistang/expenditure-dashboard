export default function Logo() {
  return (
    <div className="sm:hidden md:block overflow-hidden px-4 text-xl uppercase h-12 horizontal-center md:center flex items-center flex-nowrap overflow-x-hidden">
      {process.env.NODE_ENV !== "production" && (
        <span className="badge badge-warning mr-2">DEV</span>
      )}
      <span className="whitespace-nowrap overflow-hidden overflow-ellipsis font-bold">
        Expenditure dashboard
      </span>
    </div>
  );
}
