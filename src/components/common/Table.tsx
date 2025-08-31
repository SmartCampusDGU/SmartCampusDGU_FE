import clsx from "clsx";
import React from "react";

export function Th({
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        "h-[42px] text-center text-[14px] font-semibold text-black",
        "border-b border-[#ACACAC] bg-white px-3",
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({
  className,
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={clsx(
        "h-[52px] align-middle text-[14px] text-black px-3",
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
}